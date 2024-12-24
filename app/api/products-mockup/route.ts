import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { prisma } from "@/db/prisma";
import { env } from "@/env.mjs";
import { S3Service } from "@/lib/s3";

const trainModelSchema = z.object({
  model_name: z.string().min(1),
  description: z.string().min(1),
  input_images: z.string(),
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  console.log({ userId, user });

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const requestData = trainModelSchema.parse(await req.json());

    // 1. Upload zip file to storage
    const matches = requestData.input_images.match(
      /^data:application\/zip;base64,(.+)$/,
    );

    if (!matches) {
      return NextResponse.json(
        { error: "Invalid zip file format. Expected Base64 string." },
        { status: 400 },
      );
    }

    const [, base64Data] = matches;
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${uuidv4()}.zip`;

    const s3Service = new S3Service({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
      url: env.S3_URL_BASE,
    });

    let zipFileUrl: string;
    try {
      const s3Response = await s3Service.putItemInBucket(
        fileName,
        buffer,
        {
          path: `training-data`,
          ContentType: "application/zip",
        },
        env.S3_BUCKET,
      );

      zipFileUrl = s3Response.completedUrl;
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      return NextResponse.json(
        { error: "Failed to upload training data" },
        { status: 500 },
      );
    }

    // 2. Initialize Replicate client and start training
    const replicate = new Replicate({
      auth: env.REPLICATE_API_TOKEN,
    });

    try {
      await replicate.models.create(
        env.REPLICATE_USERNAME,
        requestData.model_name,
        {
          visibility: "private",
          hardware: "gpu-t4",
          description: requestData.description,
        },
      );
    } catch (error) {
      console.error("Replicate model creation error:", error);
      return NextResponse.json(
        {
          error: "Failed to create model",
          details: error.message || "A model with this name may already exist",
        },
        { status: 400 },
      );
    }

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
      {
        destination: `${env.REPLICATE_USERNAME}/${requestData.model_name}`,
        input: {
          steps: 1000,
          lora_rank: 16,
          optimizer: "adamw8bit",
          batch_size: 1,
          resolution: "512,768,1024",
          autocaption: true,
          input_images: zipFileUrl,
          trigger_word: "TOK",
          learning_rate: 0.0004,
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100,
        },
      },
    );
    await prisma.productMockup.create({
      data: {
        userId,
        modelName: requestData.model_name,
        steps: 1000,
        description: requestData.description,
        trainingId: training.id,
        loraRank: 16,
        trainingStatus: "pending",
        optimizer: "adamw8bit",
        batchSize: 1,
        resolution: "512,768,1024",
        autocaption: true,
        imageInput: zipFileUrl,
        triggerWord: "TOK",
        learningRate: 0.0004,
        wandbProject: "flux_train_replicate",
        wandbSaveInterval: 100,
        captionDropoutRate: 0.05,
        cacheLatentsToDisk: false,
        wandbSampleInterval: 100,
        failedReason: null,
      },
    });

    return NextResponse.json(
      {
        message: "Training started successfully",
        urls: training.urls,
        training,
      },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: err.errors },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to process request", details: err.message },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  let trainingId: string | null = null;
  try {
    const url = new URL(req.url);
    trainingId = url.searchParams.get("trainingId");

    if (!trainingId) {
      return NextResponse.json(
        { error: "Training ID is required" },
        { status: 400 },
      );
    }

    const replicate = new Replicate({
      auth: env.REPLICATE_API_TOKEN,
    });

    const trainingStatus = await replicate.trainings.get(trainingId);

    if (trainingStatus.status === "failed") {
      await prisma.productMockup.update({
        where: { trainingId },
        data: {
          trainingStatus: "failed",
          failedReason:
            trainingStatus.error || "Unknown error occurred during training",
        },
      });
    } else if (trainingStatus.status === "succeeded") {
      await prisma.productMockup.update({
        where: { trainingId },
        data: {
          trainingStatus: trainingStatus.status,
          failedReason: null, // Clear any previous error when succeeded
        },
      });
    }

    return NextResponse.json({
      trainingStatus: trainingStatus.status,
      failedReason: trainingStatus.error || null,
    });
  } catch (error) {
    console.error("Training status check error:", error);

    // Update the database with the error if we can
    if (trainingId) {
      await prisma.productMockup.update({
        where: { trainingId },
        data: {
          trainingStatus: "failed",
          failedReason: error.message || "Failed to check training status",
        },
      });
    }

    return NextResponse.json(
      {
        error: "Failed to check training status",
        details: error.message,
        failedReason: error.message,
      },
      { status: 500 },
    );
  }
}
