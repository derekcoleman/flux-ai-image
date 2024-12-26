import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import Replicate from "replicate";
import { z } from "zod";

import { prisma } from "@/db/prisma";
import { env } from "@/env.mjs";

const createModelSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public"),
  hardware: z.enum(["cpu", "gpu-t4", "gpu-a100"]).default("gpu-t4"),
  username: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const requestData = createModelSchema.parse(await req.json());
    console.log({
      replicate: env.REPLICATE_API_TOKEN,
      username: env.REPLICATE_USERNAME,
      name: requestData?.name,
    });

    const replicate = new Replicate({
      auth: env.REPLICATE_API_TOKEN,
    });

    const model = await replicate.models.create(
      env.REPLICATE_USERNAME,
      requestData.name,
      {
        visibility: "private",
        hardware: "gpu-t4",
        description: requestData?.username,
      },
    );

    const productMockup = await prisma.productMockup.create({
      data: {
        userId,
        modelName: requestData.name,
        trainingId: "",
        steps: 1000,
        loraRank: 16,
        trainingStatus: "pending",
        optimizer: "adamw8bit",
        batchSize: 1,
        resolution: "512,768,1024",
        autocaption: true,
        imageInput: "",
        triggerWord: "TOK",
        learningRate: 0.0004,
        wandbProject: "flux_train_replicate",
        wandbSaveInterval: 100,
        captionDropoutRate: 0.05,
        cacheLatentsToDisk: false,
        wandbSampleInterval: 100,
      },
    });

    return NextResponse.json({ model, productMockup }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: err.errors },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create model", details: err.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const productMockups = await prisma.productMockup.findMany({
      where: {
        userId: userId,
      },
      select: {
        modelName: true,
        userId: true,
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        Models: productMockups,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch data", details: err.message },
      { status: 500 },
    );
  }
}
