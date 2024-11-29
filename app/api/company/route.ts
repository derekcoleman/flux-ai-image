import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { prisma } from "@/db/prisma";
import { env } from "@/env.mjs";
import { S3Service } from "@/lib/s3";
import { CompanyInformation } from "@/lib/services/companyInformationService";

const companySchema = z.object({
  companyName: z.string().nonempty(),
  websiteUrl: z.string().url().nonempty(),
  description: z.string().nonempty(),
  companyLogo: z.union([z.string(), z.null()]),
  targetAudience: z.string().nonempty(),
  industry: z.string().nonempty(),
});

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

      const [, mimeType, base64Data] = matches;
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

export async function GET() {
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
    return createResponse("Not authenticated", 401);
  }

  let requestData;
  try {
    requestData = await parseRequestData(req);
  } catch (err) {
    return createResponse("Invalid input data", 400, err.errors);
  }
  console.log({ requestData });

  try {
    const existingCompany = await fetchExistingCompany(userId);

    if (!existingCompany) {
      return createResponse("No company information found", 404);
    }

    const s3Service = createS3Service();
    const companyLogoUrl = await handleCompanyLogo(
      existingCompany,
      requestData.companyLogo,
      s3Service,
    );

    const updatedCompany = await prisma.companyInformation.update({
      where: { userId },
      data: {
        ...requestData,
        companyLogo: companyLogoUrl,
      },
    });

    return createResponse(
      "company data updated successfully",
      200,
      updatedCompany,
    );
  } catch (error) {
    console.error("Error updating company information:", error);
    return createResponse("Failed to update data", 500, error.message);
  }
}

// Utility Functions
function createResponse(
  message: string | undefined,
  status: number,
  details?: CompanyInformation,
) {
  return NextResponse.json(details ? { error: message, details } : message, {
    status,
  });
}

async function parseRequestData(req: NextRequest) {
  const jsonData = await req.json();
  return companySchema.partial().parse(jsonData);
}

async function fetchExistingCompany(userId: string) {
  return prisma.companyInformation.findUnique({ where: { userId } });
}

function createS3Service() {
  return new S3Service({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
    url: env.S3_URL_BASE,
    bucket: env.S3_BUCKET,
  });
}

async function handleCompanyLogo(
  existingCompany: CompanyInformation,
  companyLogo: string | null,
  s3Service: S3Service,
) {
  console.log(companyLogo, existingCompany.companyLogo, "ok");

  if (companyLogo === null && existingCompany.companyLogo) {
    return await deleteExistingLogo(existingCompany, s3Service);
  }

  if (companyLogo && isBase64Image(companyLogo)) {
    return await uploadNewLogo(existingCompany, companyLogo, s3Service);
  }

  return companyLogo || existingCompany.companyLogo || "";
}

function isBase64Image(data: string) {
  return /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/.test(data);
}

async function uploadNewLogo(
  existingCompany: CompanyInformation,
  companyLogo: string,
  s3Service: S3Service,
) {
  const matchResult = companyLogo.match(
    /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/,
  );
  if (!matchResult) throw new Error("Invalid base64 image format");
  const [, mimeType, base64Data] = matchResult;
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `${uuidv4()}.${mimeType}`;

  await deleteExistingLogo(existingCompany, s3Service);

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
    return s3Response.completedUrl;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload new logo to S3");
  }
}

function extractFileName(url: string) {
  return url.split("/").pop();
}

async function deleteExistingLogo(
  existingCompany: CompanyInformation,
  s3Service: S3Service,
) {
  if (existingCompany.companyLogo) {
    const existingLogoKey = extractFileName(existingCompany.companyLogo);
    try {
      const deletedLogo = await s3Service.deleteItemInBucket(
        `company-logos/${existingLogoKey}`,
      );
      console.log({ deletedLogo });
    } catch (error) {
      console.error("Failed to delete existing logo from S3:", error);
      throw new Error("Failed to delete existing logo from S3");
    }
  }
  return "";
}
