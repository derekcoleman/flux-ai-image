import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/db/prisma";
import { env } from "@/env.mjs";

export async function POST(
  request: Request,
  { params }: { params: { trainingId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { trainingId } = params;

    if (!trainingId) {
      return NextResponse.json(
        { success: false, message: "Training ID is required" },
        { status: 400 },
      );
    }

    await fetch(`https://api.replicate.com/v1/trainings/${trainingId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.REPLICATE_API_TOKEN}`,
      },
    });

    await prisma.productMockup.update({
      where: { trainingId },
      data: {
        trainingStatus: "cancelled",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Training ${trainingId} cancelled successfully`,
    });
  } catch (error) {
    console.error("Error cancelling training:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel training",
      },
      { status: 500 },
    );
  }
}
