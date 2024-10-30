import { NextResponse, type NextRequest } from "next/server";

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
  });

  if (!fluxData) {
    return null;
  }

  const imageUrl = await prisma.fluxAiImages.findUnique({
    where: {
      id: Number(imageUrlId),
      fluxId: id as number,
    },
  });

  if (!imageUrl) return null;

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
    const whereConditions: Prisma.FluxDataWhereInput = {
      isPrivate: false,
      taskStatus: {
        in: [FluxTaskStatus.Succeeded],
      },
    };
    if (model) {
      whereConditions.model = model;
    }

    const [fluxData, total] = await Promise.all([
      prisma.fluxData.findMany({
        where: whereConditions,
        take: pageSize,
        skip: offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.fluxData.count({ where: whereConditions }),
    ]);

    // const fluxDataWithImages = (
    //   await Promise.all(
    //     fluxData.map(async (data) => {
    //       const imageUrls = await prisma.fluxAiImages.findMany({
    //         where: { fluxId: data.id },
    //       });

    //       return imageUrls.map((image) => ({
    //         ...data,
    //         imageUrl: image,
    //         executeTime:
    //           data.executeEndTime && data.executeStartTime
    //             ? Number(`${data.executeEndTime - data.executeStartTime}`)
    //             : 0,
    //         id: FluxHashids.encode(data.id),
    //       }));
    //     }),
    //   )
    // ).flat();

    // console.log({ data: fluxDataWithImages?.[0] });

    const fluxDataWithImages = (
      await Promise.all(
        fluxData.map(async (data) => {
          try {
            const imageUrls = await prisma.fluxAiImages.findMany({
              where: { fluxId: data.id },
            });

            return imageUrls.map((image) => ({
              ...data,
              imageUrl: image,
              executeTime:
                data.executeEndTime && data.executeStartTime
                  ? Number(`${data.executeEndTime - data.executeStartTime}`)
                  : 0,
              id: FluxHashids.encode(data.id),
            }));
          } catch (error) {
            console.error(
              `Error fetching images for fluxId ${data.id}:`,
              error,
            );
            return [];
          }
        }),
      )
    ).flat();

    return {
      data: {
        total,
        page,
        pageSize,
        // data: fluxData.map(
        //   ({ id, executeEndTime, executeStartTime, loraUrl, ...rest }) => ({
        //     ...rest,
        //     executeTime:
        //       executeEndTime && executeStartTime
        //         ? Number(`${executeEndTime - executeStartTime}`)
        //         : 0,
        //     id: FluxHashids.encode(id),
        //   }),
        // ),
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
