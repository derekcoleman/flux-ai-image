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

// export async function getFluxById(fluxId: string, imageUrlId: string) {
//   const [id] = FluxHashids.decode(fluxId);

//   const fluxData = await prisma.fluxData.findUnique({
//     where: { id: id as number },
//   });

//   if (!fluxData) {
//     return null;
//   }

//   const imageUrl = await prisma.fluxAiImages.findUnique({
//     where: {
//       id: Number(imageUrlId),
//       fluxId: id as number,
//     },
//   });

//   if (!imageUrl) return null;

//   return { ...fluxData, id: fluxId, imageUrl: imageUrl.imageUrl };
// }
export async function getFluxById(fluxId: string, imageUrlId: string) {
  console.log("Entering getFluxById function...");
  console.log("Received fluxId:", fluxId, "Received imageUrlId:", imageUrlId);

  try {
    console.log("Decoding fluxId using FluxHashids...");
    const [id] = FluxHashids.decode(fluxId);
    console.log("Decoded fluxId:", id);

    console.log("Fetching flux data from prisma for id:", id);
    const fluxData = await prisma.fluxData.findUnique({
      where: { id: id as number },
    });
    console.log("Prisma response for fluxData:", fluxData);

    if (!fluxData) {
      console.warn("No fluxData found for id:", id);
      return null;
    }

    console.log(
      "Fetching image URL from prisma for imageUrlId:",
      imageUrlId,
      "and fluxId:",
      id,
    );
    const imageUrl = await prisma.fluxAiImages.findUnique({
      where: {
        id: Number(imageUrlId),
        fluxId: id as number,
      },
    });
    console.log("Prisma response for imageUrl:", imageUrl);

    if (!imageUrl) {
      console.warn(
        "No imageUrl found for imageUrlId:",
        imageUrlId,
        "and fluxId:",
        id,
      );
      return null;
    }

    console.log("Returning final result with fluxData and imageUrl");
    return { ...fluxData, id: fluxId, imageUrl: imageUrl.imageUrl };
  } catch (error: any) {
    // Enhanced logging for different types of errors
    console.error("Error occurred in getFluxById function:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Known Prisma errors
      console.error(
        "Prisma Client Known Request Error:",
        error.message,
        "Code:",
        error.code,
      );
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      // Unknown Prisma errors
      console.error("Prisma Client Unknown Request Error:", error.message);
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      // Prisma Rust panic
      console.error("Prisma Client Rust Panic Error:", error.message);
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      // Errors during Prisma Client initialization
      console.error("Prisma Client Initialization Error:", error.message);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Validation errors in Prisma
      console.error("Prisma Client Validation Error:", error.message);
    } else {
      // Any other error
      console.error("Unknown error:", error.message);
    }

    return null;
  }
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
