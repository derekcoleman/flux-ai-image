import { Prisma } from "@prisma/client";
import { z } from "zod";

import { model } from "@/config/constants";
import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { FluxTaskStatus } from "@/db/type";
import { getErrorMessage } from "@/lib/handle-error";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(12),
  sort: z.string().optional(),
  model: z.enum([model.dev, model.pro, model.schnell]).optional(),
});

export async function getFluxById(fluxId: string, imageUrlId: string) {
  const [id] = FluxHashids.decode(fluxId);

  const fluxData = await prisma.fluxData.findUnique({
    where: { id: id as number },
    include: {
      images: {
        where: {
          id: Number(imageUrlId),
        },
      },
    },
  });

  if (!fluxData || !fluxData.images.length) {
    return null;
  }

  const imageUrl = fluxData.images[0];
  return { ...fluxData, id: fluxId, imageUrl: imageUrl.imageUrl };
}

export async function getFluxDataByPage(params: {
  page: number;
  pageSize: number;
  model?: string;
}) {
  try {
    const { page, pageSize, model } = params;
    const offset = (page - 1) * pageSize;

    // Define the filtering conditions
    const whereConditions: Prisma.FluxDataWhereInput = {
      isPrivate: false,
      taskStatus: FluxTaskStatus.Succeeded,
      ...(model ? { model } : {}),
    };

    const [fluxData, total] = await Promise.all([
      prisma.fluxData.findMany({
        where: whereConditions,
        take: pageSize,
        skip: offset,
        include: {
          images: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.fluxData.count({ where: whereConditions }),
    ]);

    // Map FluxData with associated images and necessary transformations
    // const fluxDataWithImages = fluxData.map((data) => {
    //   return {
    //     ...data,
    //     images: data.images.map((image) => ({
    //       ...image,
    //     })),
    //     executeTime:
    //       data.executeEndTime && data.executeStartTime
    //         ? Number(`${data.executeEndTime - data.executeStartTime}`)
    //         : 0,
    //     id: FluxHashids.encode(data.id),
    //   };
    // });
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

    return {
      data: {
        total,
        page,
        pageSize,
        data: fluxDataWithImages,
      },
    };
  } catch (error) {
    return {
      data: {
        total: 0,
        page: 0,
        pageSize: 0,
        data: [],
      },
      error: getErrorMessage(error),
    };
  }
}
