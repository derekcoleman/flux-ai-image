// import { NextResponse, type NextRequest } from "next/server";

// import { auth, currentUser } from "@clerk/nextjs/server";
// import Replicate from "replicate";
// import { v4 as uuidv4 } from "uuid";
// import { z } from "zod";

// import { prisma } from "@/db/prisma";
// import { env } from "@/env.mjs";
// import { S3Service } from "@/lib/s3";

// const trainModelSchema = z.object({
//   model_name: z.string().min(1),
//   steps: z.number().int().min(1),
//   lora_rank: z.number().int(),
//   optimizer: z.string(),
//   batch_size: z.number().int(),
//   resolution: z.string(),
//   autocaption: z.boolean(),
//   input_images: z.string(),
//   trigger_word: z.string(),
//   learning_rate: z.number(),
//   wandb_project: z.string(),
//   wandb_save_interval: z.number().int(),
//   caption_dropout_rate: z.number(),
//   cache_latents_to_disk: z.boolean(),
//   wandb_sample_interval: z.number().int(),
// });

// export async function POST(req: NextRequest) {
//   const { userId } = auth();
//   const user = await currentUser();

//   if (!userId || !user) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   try {
//     const requestData = trainModelSchema.parse(await req.json());

//     // 1. Upload zip file to storage
//     const matches = requestData.input_images.match(
//       /^data:application\/zip;base64,(.+)$/,
//     );

//     if (!matches) {
//       return NextResponse.json(
//         { error: "Invalid zip file format. Expected Base64 string." },
//         { status: 400 },
//       );
//     }

//     const [, base64Data] = matches;
//     const buffer = Buffer.from(base64Data, "base64");
//     const fileName = `${uuidv4()}.zip`;

//     const s3Service = new S3Service({
//       endpoint: env.S3_ENDPOINT,
//       region: env.S3_REGION,
//       accessKeyId: env.S3_ACCESS_KEY,
//       secretAccessKey: env.S3_SECRET_KEY,
//       url: env.S3_URL_BASE,
//     });

//     let zipFileUrl: string;
//     try {
//       const s3Response = await s3Service.putItemInBucket(
//         fileName,
//         buffer,
//         {
//           path: `training-data`,
//           ContentType: "application/zip",
//         },
//         env.S3_BUCKET,
//       );

//       zipFileUrl = s3Response.completedUrl;
//     } catch (s3Error) {
//       console.error("S3 upload error:", s3Error);
//       return NextResponse.json(
//         { error: "Failed to upload training data" },
//         { status: 500 },
//       );
//     }

//     // 2. Initialize Replicate client and start training
//     const replicate = new Replicate({
//       auth: env.REPLICATE_API_TOKEN,
//     });

//     const training = await replicate.trainings.create(
//       "ostris",
//       "flux-dev-lora-trainer",
//       "58b9f08e13f0909493fac7045ae489ab54112779e92352f7466135386553311c",
//       {
//         destination: `${env.REPLICATE_USERNAME}/${requestData.model_name}`,
//         input: {
//           steps: requestData.steps,
//           lora_rank: requestData.lora_rank,
//           optimizer: requestData.optimizer,
//           batch_size: requestData.batch_size,
//           resolution: requestData.resolution,
//           autocaption: requestData.autocaption,
//           input_images: zipFileUrl,
//           trigger_word: requestData.trigger_word,
//           learning_rate: requestData.learning_rate,
//           wandb_project: requestData.wandb_project,
//           wandb_save_interval: requestData.wandb_save_interval,
//           caption_dropout_rate: requestData.caption_dropout_rate,
//           cache_latents_to_disk: requestData.cache_latents_to_disk,
//           wandb_sample_interval: requestData.wandb_sample_interval,
//         },
//       },
//     );

//     const productMockup = await prisma.productMockup.create({
//       data: {
//         userId,
//         modelName: requestData.model_name,
//         steps: requestData.steps,
//         loraRank: requestData.lora_rank,
//         optimizer: requestData.optimizer,
//         batchSize: requestData.batch_size,
//         resolution: requestData.resolution,
//         autocaption: requestData.autocaption,
//         imageInput: zipFileUrl,
//         triggerWord: requestData.trigger_word,
//         learningRate: requestData.learning_rate,
//         wandbProject: requestData.wandb_project,
//         wandbSaveInterval: requestData.wandb_save_interval,
//         captionDropoutRate: requestData.caption_dropout_rate,
//         cacheLatentsToDisk: requestData.cache_latents_to_disk,
//         wandbSampleInterval: requestData.wandb_sample_interval,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Training started successfully",
//         trainingId: training.id,
//         productMockup,
//       },
//       { status: 200 },
//     );
//   } catch (err) {
//     if (err instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: "Invalid input data", details: err.errors },
//         { status: 400 },
//       );
//     }
//     console.error(err);
//     return NextResponse.json(
//       { error: "Failed to process request", details: err.message },
//       { status: 500 },
//     );
//   }
// }

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
  steps: z.number().int().min(1),
  lora_rank: z.number().int(),
  optimizer: z.string(),
  batch_size: z.number().int(),
  resolution: z.string(),
  autocaption: z.boolean(),
  input_images: z.string(),
  trigger_word: z.string(),
  learning_rate: z.number(),
  wandb_project: z.string(),
  wandb_save_interval: z.number().int(),
  caption_dropout_rate: z.number(),
  cache_latents_to_disk: z.boolean(),
  wandb_sample_interval: z.number().int(),
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

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

    // const ensureModelExists = async (username, modelName) => {
    //   try {
    //     const models = await replicate.models.list();
    //     const modelExists = models.results.some(
    //       (model) => model.name === modelName,
    //     );

    //     if (!modelExists) {
    //       // Create the model
    //       await replicate.models.create(username, modelName, {
    //         visibility: "public",
    //         hardware: "gpu-t4",
    //       });
    //       console.log(`Model ${modelName} created successfully.`);
    //     }
    //   } catch (err) {
    //     console.error("Failed to ensure model exists:", err.message);
    //     throw new Error("Could not create or verify the model.");
    //   }
    // };

    const uniqueModelName = `${requestData.model_name}-${uuidv4()}`;

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
      {
        destination: `${env.REPLICATE_USERNAME}/${uniqueModelName}`,
        input: {
          steps: requestData.steps,
          lora_rank: requestData.lora_rank,
          optimizer: requestData.optimizer,
          batch_size: requestData.batch_size,
          resolution: requestData.resolution,
          autocaption: requestData.autocaption,
          input_images: zipFileUrl,
          trigger_word: requestData.trigger_word,
          learning_rate: requestData.learning_rate,
          wandb_project: requestData.wandb_project,
          wandb_save_interval: requestData.wandb_save_interval,
          caption_dropout_rate: requestData.caption_dropout_rate,
          cache_latents_to_disk: requestData.cache_latents_to_disk,
          wandb_sample_interval: requestData.wandb_sample_interval,
        },
      },
    );

    const productMockup = await prisma.productMockup.create({
      data: {
        userId,
        modelName: requestData.model_name,
        steps: requestData.steps,
        loraRank: requestData.lora_rank,
        optimizer: requestData.optimizer,
        batchSize: requestData.batch_size,
        resolution: requestData.resolution,
        autocaption: requestData.autocaption,
        imageInput: zipFileUrl,
        triggerWord: requestData.trigger_word,
        learningRate: requestData.learning_rate,
        wandbProject: requestData.wandb_project,
        wandbSaveInterval: requestData.wandb_save_interval,
        captionDropoutRate: requestData.caption_dropout_rate,
        cacheLatentsToDisk: requestData.cache_latents_to_disk,
        wandbSampleInterval: requestData.wandb_sample_interval,
      },
    });

    return NextResponse.json(
      {
        message: "Training started successfully",
        trainingId: training.id,
        productMockup,
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
