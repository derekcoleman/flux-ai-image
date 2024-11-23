import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { prisma } from "@/db/prisma";
import { env } from "@/env.mjs";
import { redis } from "@/lib/redis";
import { S3Service } from "@/lib/s3";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
});

const companySchema = z.object({
  companyName: z.string().nonempty(),
  websiteUrl: z.string().url().nonempty(),
  description: z.string().nonempty(),
  companyLogo: z.string().optional(),
  targetAudience: z.string().nonempty(),
  industry: z.string().nonempty(),
});

// export async function POST(req: NextRequest) {
//   const { userId } = auth();
//   const user = await currentUser();

//   if (!userId || !user) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   const { success } = await ratelimit.limit(`company_post_${userId}`);
//   if (!success) {
//     return new Response("Too Many Requests", { status: 429 });
//   }

//   let requestData;
//   try {
//     requestData = companySchema.parse(await req.json());
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Invalid input data", details: err.errors },
//       { status: 400 },
//     );
//   }

//   try {
//     const company = await prisma.companyInformation.create({
//       data: {
//         userId,
//         ...requestData,
//       },
//     });
//     return NextResponse.json(company, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to save data", details: error.message },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const requestData = companySchema.parse(await req.json());
    const { companyLogo } = requestData;

    let companyLogoUrl = "";

    // Handle logo upload to S3
    if (companyLogo) {
      const matches = companyLogo.match(
        /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/,
      );
      if (!matches) {
        return NextResponse.json(
          { error: "Invalid logo format. Expected Base64 string." },
          { status: 400 },
        );
      }

      const [_, mimeType, base64Data] = matches;
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `${uuidv4()}.${mimeType}`;
      const s3Service = new S3Service({
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
        url: env.S3_URL_BASE,
      });

      try {
        const s3Response = await s3Service.putItemInBucket(
          fileName,
          buffer,
          {
            path: `company-logos`,
            ContentType: `image/${mimeType}`,
          },
          env.S3_BUCKET,
        );

        companyLogoUrl = s3Response.completedUrl;
      } catch (s3Error) {
        console.error("S3 upload error:", s3Error);
        return NextResponse.json(
          { error: "Failed to upload logo to S3" },
          { status: 500 },
        );
      }
    }

    const company = await prisma.companyInformation.create({
      data: {
        userId,
        ...requestData,
        companyLogo: companyLogoUrl,
      },
    });

    return NextResponse.json(company, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: err.errors },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to process request", details: err.message },
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
    const company = await prisma.companyInformation.findUnique({
      where: { userId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "No company information found" },
        { status: 404 },
      );
    }

    return NextResponse.json(company, { status: 200 });
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

  let requestData;
  try {
    requestData = companySchema.partial().parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid input data", details: err.errors },
      { status: 400 },
    );
  }

  try {
    const updatedCompany = await prisma.companyInformation.update({
      where: { userId },
      data: requestData,
    });

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update data", details: error.message },
      { status: 500 },
    );
  }
}
