import { NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/db/prisma";

export async function GET() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const succeededModels = await prisma.productMockup.findMany({
      where: {
        userId,
        trainingStatus: "succeeded",
      },
    });

    return NextResponse.json({
      models: succeededModels,
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models", details: error.message },
      { status: 500 },
    );
  }
}
