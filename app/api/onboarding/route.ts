import { NextResponse, type NextRequest } from "next/server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { prisma } from "@/db/prisma";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
});

export async function POST(req: NextRequest) {
  // Authenticate user
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user || !user.primaryEmailAddress) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Rate limiting
  const { success } = await ratelimit.limit(`onboarding_${userId}`);
  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }

  // Parse and validate input using zod
  const schema = z.object({
    role: z.string().nonempty(),
    interests: z.array(z.string()),
    designTypes: z.array(z.string()),
    experienceLevel: z.string().nonempty(),
    goals: z.array(z.string()),
  });

  let requestData;
  try {
    requestData = schema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid input data", details: err.errors },
      { status: 400 },
    );
  }

  // Insert into database
  try {
    const savedData = await prisma.onboardingAnswers.create({
      data: {
        userId,
        ...requestData,
      },
    });

    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        popupSeen: true,
      },
    });
    return NextResponse.json(savedData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save data", details: error.message },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const onboardingData = await prisma.onboardingAnswers.findUnique({
      where: { userId },
    });

    if (!onboardingData) {
      return NextResponse.json(
        { error: "No onboarding data found for this user" },
        { status: 404 },
      );
    }

    return NextResponse.json(onboardingData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve data", details: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    role: z.string().nonempty().optional(),
    interests: z.array(z.string()).optional(),
    designTypes: z.array(z.string()).optional(),
    experienceLevel: z.string().nonempty().optional(),
    goals: z.array(z.string()).optional(),
  });

  let requestData;
  try {
    requestData = schema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid input data", details: err.errors },
      { status: 400 },
    );
  }

  try {
    const updatedData = await prisma.onboardingAnswers.update({
      where: { userId },
      data: requestData,
    });

    return NextResponse.json(updatedData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update data", details: error.message },
      { status: 500 },
    );
  }
}
