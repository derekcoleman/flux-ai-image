import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import dayjs from "dayjs";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Credits, loraTriggerWords, model, Ratio } from "@/config/constants";
import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";
import { getUserCredit } from "@/db/queries/account";
import { BillingType } from "@/db/type";
import { env } from "@/env.mjs";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";
import { S3Service } from "@/lib/s3";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

function getKey(id: string) {
  return `generate:${id}`;
}

export const maxDuration = 60;

const CreateGenerateSchema = z.object({
  model: z.string(),
  inputPrompt: z.string(),
  aspectRatio: z.enum([
    Ratio.r1,
    Ratio.r2,
    Ratio.r3,
    Ratio.r4,
    Ratio.r5,
    Ratio.r6,
    Ratio.r7,
  ]),
  numberOfImages: z.number(),
  isPrivate: z.number().default(0),
  locale: z.string().default("en"),
  loraName: z.string().optional(),
  inputImageUrl: z.string().url().optional(),
  productName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  let triggerWord = "";
  const user = await currentUser();
  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  // if (env.APP_ENV !== "production" && !user.publicMetadata.siteOwner) {
  //   return NextResponse.json({ error: "no permission" }, { status: 403 });
  // }

  const { success } = await ratelimit.limit(
    getKey(user.id) + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  try {
    const data = await req.json();

    const {
      model: modelName,
      inputPrompt,
      aspectRatio,
      numberOfImages,
      locale,
      loraName,
      inputImageUrl,
      productName,
    } = CreateGenerateSchema.parse(data);

    console.log("productName", productName);

    if (
      Object.prototype.hasOwnProperty.call(loraTriggerWords, loraName || "")
    ) {
      triggerWord = loraTriggerWords[loraName || ""];
    }

    // if (loraTriggerWords.hasOwnProperty(loraName || "")) {
    //   triggerWord = loraTriggerWords[loraName || ""];
    // }

    const finalPrompt = modelName.startsWith("vizyai/")
      ? `${inputPrompt} in ${productName?.toUpperCase() || ""} style`
      : triggerWord
        ? `${inputPrompt} ${triggerWord}`
        : inputPrompt;

    const modelId =
      "58b9f08e13f0909493fac7045ae489ab54112779e92352f7466135386553311c";
    const headers = new Headers();
    if (modelName === model.freeSchnell) {
      const thisMonthStart = dayjs().startOf("M");
      const thisMonthEnd = dayjs().endOf("M");
      const freeSchnellCount = await prisma.fluxData.count({
        where: {
          model: `${model.freeSchnell}:${modelId}`,
          userId,
          createdAt: {
            gte: thisMonthStart.toDate(),
            lte: thisMonthEnd.toDate(),
          },
        },
      });

      if (freeSchnellCount >= 5 && !user.publicMetadata.siteOwner) {
        return NextResponse.json(
          { error: "Insufficient credit", code: 1000403 },
          { status: 400 },
        );
      }
    }

    const account = await getUserCredit(userId);
    const needCredit = modelName.startsWith("vizyai/")
      ? 10 * Number(numberOfImages)
      : Number(Credits[modelName]) * Number(numberOfImages);

    if (
      (!account.credit && modelName !== model.freeSchnell) ||
      account.credit < needCredit
    ) {
      return NextResponse.json(
        { error: "Insufficient credit", code: 1000402 },
        { status: 400 },
      );
    }

    headers.append("Content-Type", "application/json");
    headers.append("API-TOKEN", env.FLUX_HEADER_KEY);

    const replicate = new Replicate({
      auth: env.REPLICATE_API_TOKEN,
    });

    const successfulModels = await prisma.productMockup.findMany({
      where: {
        userId,
        trainingStatus: "succeeded",
      },
      select: {
        id: true,
        modelName: true,
        description: true,
        trainingId: true,
        triggerWord: true,
        createdAt: true,
      },
    });

    const customModel = successfulModels.find(
      (m) => m.modelName === modelName.split("/")[1],
    )?.modelName;

    const input = {
      prompt: finalPrompt,
      aspect_ratio: aspectRatio,
      output_format: "webp",
      output_quality: 80,
      ...(modelName === "black-forest-labs/flux-1.1-pro" && {
        safety_tolerance: 2,
        prompt_upsampling: true,
      }),
      ...(modelName === "black-forest-labs/flux-schnell" && {
        go_fast: true,
        megapixels: "1",
        num_outputs: numberOfImages,
        num_inference_steps: 4,
      }),
      ...(modelName === "black-forest-labs/flux-dev" && {
        image: inputImageUrl,
        go_fast: true,
        guidance: 3.5,
        megapixels: "1",
        num_outputs: numberOfImages,
        prompt_strength: 0.8,
        num_inference_steps: 28,
      }),
      ...(modelName === "lucataco/flux-dev-lora" && {
        hf_lora: loraName,
        lora_scale: 0.8,
        num_outputs: numberOfImages,
        guidance_scale: 3.5,
        prompt_strength: 0.8,
        num_inference_steps: 28,
      }),
      ...(modelName === "philz1337x/clarity-upscaler" && {
        seed: 1337,
        image: inputImageUrl,
        dynamic: 6,
        handfix: "disabled",
        pattern: false,
        sharpen: 0,
        sd_model: "juggernaut_reborn.safetensors [338b85bc4f]",
        scheduler: "DPM++ 3M SDE Karras",
        creativity: 0.35,
        lora_links: "",
        downscaling: false,
        resemblance: 0.6,
        scale_factor: 2,
        tiling_width: 112,
        tiling_height: 144,
        custom_sd_model: "",
        negative_prompt:
          "(worst quality, low quality, normal quality:2) JuggernautNegative-neg",
        num_inference_steps: 18,
        downscaling_resolution: 768,
      }),
      ...(modelName === "vizyai/product-photography" && {
        model: "dev",
        go_fast: false,
        lora_scale: 1,
        megapixels: "1",
        num_outputs: numberOfImages,
        guidance_scale: 3,
        prompt_strength: 0.8,
        extra_lora_scale: 1,
        num_inference_steps: 28,
      }),
      ...(modelName === `vizyai/${customModel}` && {
        model: "dev",
        go_fast: false,
        lora_scale: 1,
        megapixels: "1",
        num_outputs: numberOfImages,
        output_format: "webp",
        guidance_scale: 3,
        output_quality: 80,
        prompt_strength: 0.8,
        extra_lora_scale: 1,
        num_inference_steps: 28,
      }),
    };

    const [owner, modelPath] = modelName.split("/");
    const replicateRes = await replicate.run(
      `${owner}/${modelPath}:${modelId}`,
      {
        input,
      },
    );

    if (!replicateRes) {
      return NextResponse.json(
        { error: "Create Generator Error" },
        { status: 400 },
      );
    }

    // const res = await fetch(`${env.FLUX_CREATE_URL}/flux/create`, {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify({
    //     model: modelName,
    //     input_image_url: inputImageUrl,
    //     input_prompt: inputPrompt,
    //     aspect_ratio: aspectRatio,
    //     is_private: isPrivate,
    //     user_id: userId,
    //     lora_name: loraName,
    //     locale,
    //   }),
    // }).then((res) => res.json());

    // if (!res?.replicate_id && res.error) {
    //   return NextResponse.json(
    //     { error: res.error || "Create Generator Error" },
    //     { status: 400 },
    //   );
    // }
    // const fluxData = await prisma.fluxData.findFirst({
    //   where: {
    //     replicateId: res.replicate_id,
    //   },
    // });
    // if (!fluxData) {
    //   return NextResponse.json({ error: "Create Task Error" }, { status: 400 });
    // }

    const s3Service = new S3Service({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
      url: env.S3_URL_BASE,
    });

    const replicateId = uuidv4();
    const imageUrls: string[] = [];

    for (const replicateImageUrl of replicateRes as string[]) {
      const response = await fetch(replicateImageUrl);

      if (!response.ok)
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      const fileName = `${uuidv4()}.webp`;

      const s3Response = await s3Service.putItemInBucket(
        fileName,
        imageBuffer,
        {
          path: `generated-images`,
          ContentType: "image/webp",
        },
        env.S3_BUCKET,
      );

      imageUrls.push(s3Response.completedUrl);
    }

    const fluxData = await prisma.fluxData.create({
      data: {
        userId: userId, // Required field
        replicateId: replicateId, // Required field
        inputPrompt: finalPrompt, // Optional
        inputImageUrl: inputImageUrl, // Optional
        model: `${modelName}:${modelId}`, // Required field
        locale: locale, // Optional
        aspectRatio: aspectRatio, // Required field
        taskStatus: "succeeded", // Required field
        loraName: loraName, // Optional
      },
    });

    if (!fluxData) {
      return NextResponse.json({ error: "Create Task Error" }, { status: 400 });
    }

    if (imageUrls && imageUrls.length > 0) {
      const imagesData = imageUrls.map((url) => ({
        fluxId: fluxData.id, // Reference the FluxData id
        imageUrl: url, // The image URL
      }));

      // Insert the images into the FluxAiImages table
      await prisma.fluxAiImages.createMany({
        data: imagesData,
      });
    }

    await prisma.$transaction(async (tx) => {
      const newAccount = await tx.userCredit.update({
        where: { id: account.id },
        data: {
          credit: {
            decrement: needCredit,
          },
        },
      });
      const billing = await tx.userBilling.create({
        data: {
          userId,
          fluxId: fluxData.id,
          state: "Done",
          amount: -needCredit,
          type: BillingType.Withdraw,
          description: `Generate ${modelName} - ${aspectRatio} Withdraw`,
        },
      });

      await tx.userCreditTransaction.create({
        data: {
          userId,
          credit: -needCredit,
          balance: newAccount.credit,
          billingId: billing.id,
          type: "Generate",
        },
      });
    });
    return NextResponse.json({
      id: FluxHashids.encode(fluxData.id),
      images: imageUrls,
      aspectRatio: aspectRatio,
      inputPrompt: finalPrompt,
      model: modelName,
    });
  } catch (error) {
    console.log("error-->", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
