import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import Replicate from "replicate";
import { z } from "zod";

import { env } from "@/env.mjs";

const createModelSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public"),
  hardware: z.enum(["cpu", "gpu-t4", "gpu-a100"]).default("gpu-t4"),
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const requestData = createModelSchema.parse(await req.json());

    const replicate = new Replicate({
      auth: env.REPLICATE_API_TOKEN,
    });

    const model = await replicate.models.create(
      env.REPLICATE_USERNAME,
      requestData.name,
      {
        visibility: "public",
        hardware: requestData.hardware,
        description: requestData.description,
      },
    );

    return NextResponse.json({ model }, { status: 201 });
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

export async function GET(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const replicate = new Replicate({
      auth: env.REPLICATE_API_TOKEN,
    });

    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get("username") || env.REPLICATE_USERNAME;

    const models = await replicate.models.list({ username });

    return NextResponse.json({ models: models.results }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch models", details: err.message },
      { status: 500 },
    );
  }
}
