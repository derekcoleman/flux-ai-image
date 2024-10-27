import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import dayjs from "dayjs";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Credits, loraTriggerWords, model, Ratio } from "@/config/constants";
import { FluxHashids } from "@/db/dto/flux.dto";
import { ReplicateHashids } from "@/db/dto/replicate.dto";
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

type Params = { params: { key: string } };
const CreateGenerateSchema = z.object({
  model: z.enum([
    model.pro,
    model.schnell,
    model.dev,
    model.general,
    model.freeSchnell,
  ]),
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
});

export async function POST(req: NextRequest, { params }: Params) {
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
      numberOfImages = 1,
      isPrivate,
      locale,
      loraName,
      inputImageUrl,
    } = CreateGenerateSchema.parse(data);

    if (loraTriggerWords.hasOwnProperty(loraName || "")) {
      triggerWord = loraTriggerWords[loraName || ""];
    }
    const finalPrompt = triggerWord
      ? `${inputPrompt} ${triggerWord}`
      : inputPrompt;

    const modelId =
      "091495765fa5ef2725a175a57b276ec30dc9d39c22d30410f2ede68a3eab66b3";
    const headers = new Headers();
    if (modelName === model.freeSchnell) {
      const thisMonthStart = dayjs().startOf("M");
      const thisMonthEnd = dayjs().endOf("M");
      const freeSchnellCount = await prisma.fluxData.count({
        where: {
          model: model.freeSchnell,
          userId,
          createdAt: {
            gte: thisMonthStart.toDate(),
            lte: thisMonthEnd.toDate(),
          },
        },
      });
      // 5 free schnell generate per month
      if (freeSchnellCount >= 5 && !user.publicMetadata.siteOwner) {
        return NextResponse.json(
          { error: "Insufficient credit", code: 1000403 },
          { status: 400 },
        );
      }
    }
    const account = await getUserCredit(userId);
    const needCredit = Credits[modelName];
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
    };

    const replicateRes = await replicate.run(`${modelName}:${modelId}`, {
      input,
    });

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
      imageUrl: imageUrls,
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
