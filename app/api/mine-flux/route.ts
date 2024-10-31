import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { model } from "@/config/constants";
import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { FluxTaskStatus } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  sort: z.string().optional(),
  model: z.enum([model.dev, model.pro, model.schnell]).optional(),
});

export async function GET(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const values = searchParamsSchema.parse(
      Object.fromEntries(url.searchParams),
    );
    const { page, pageSize, model } = values;
    const offset = (page - 1) * pageSize;

    const whereConditions: any = {
      userId,
      taskStatus: {
        in: [FluxTaskStatus.Succeeded, FluxTaskStatus.Processing],
      },
    };
    if (model) {
      whereConditions.model = model;
    }

    // Retrieve flux data and total count in parallel
    const [fluxData, total] = await Promise.all([
      prisma.fluxData.findMany({
        where: whereConditions,
        take: pageSize,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
        },
      }),
      prisma.fluxData.count({ where: whereConditions }),
    ]);

    // Map data and attach associated images

    const fluxDataWithImages = fluxData.flatMap((data) => {
      return data.images.map((image) => ({
        ...data,
        images: image,
        executeTime:
          data.executeEndTime && data.executeStartTime
            ? Number(`${data.executeEndTime - data.executeStartTime}`)
            : 0,
        id: FluxHashids.encode(data.id),
      }));
    });

    return NextResponse.json({
      data: {
        total,
        page,
        pageSize,
        data: fluxDataWithImages,
      },
    });
  } catch (error) {
    console.error("--->", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
