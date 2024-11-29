import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { prisma } from "@/db/prisma";
import { env } from "@/env.mjs";
import { S3Service } from "@/lib/s3";

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  currency: z.string().min(1),
  frequency: z.string().min(1),
  images: z.array(z.string().min(1)),
  category: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const requestData = productSchema.parse(await req.json());
    const productImages: string[] = [];

    for (const image of requestData.images) {
      const matches = image.match(
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
            path: `Product-images`,
            ContentType: `image/${mimeType}`,
          },
          env.S3_BUCKET,
        );

        productImages.push(s3Response.completedUrl);
      } catch (s3Error) {
        console.error("S3 upload error:", s3Error);
        return NextResponse.json(
          { error: "Failed to upload logo to S3" },
          { status: 500 },
        );
      }
    }
    const product = await prisma.product.create({
      data: {
        userId,
        ...requestData,
        images: productImages,
      },
    });

    return NextResponse.json(product, { status: 200 });
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
    const products = await prisma.product.findMany({
      where: { userId },
    });

    if (!products) {
      return NextResponse.json(
        { error: "No company information found" },
        { status: 404 },
      );
    }

    return NextResponse.json(products, { status: 200 });
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
  // console.log({ requestData });

  try {
    const existingProduct = await fetchExistingProduct(requestData.id, userId);

    if (!existingProduct) {
      return createResponse("No product information found", 404);
    }

    const s3Service = createS3Service();

    // Handle image updates
    const updatedImages = await handleImages(
      existingProduct.images as string[],
      requestData.images as string[],
      s3Service,
    );

    // Update product information in DB
    const updatedProduct = await prisma.product.update({
      where: { id: requestData.id },
      data: {
        ...requestData,
        images: updatedImages,
      },
    });

    return createResponse("Product updated successfully", 200, updatedProduct);
  } catch (error) {
    console.error("Error updating product information:", error);
    return createResponse("Failed to update data", 500, error.message);
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return createResponse("Not authenticated", 401);
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return createResponse("Product ID is required", 400);
    }

    // Fetch product details
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id), userId },
    });

    if (!product) {
      return createResponse("Product not found or not authorized", 404);
    }

    const s3Service = createS3Service();

    await Promise.all(
      ((product.images as string[]) ?? []).map((image) =>
        deleteImage(image, s3Service),
      ),
    );

    // Delete product from DB
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return createResponse(
      "Product and associated images deleted successfully",
      200,
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return createResponse("Failed to delete product", 500, error.message);
  }
}

// Utility Functions

function createResponse(
  message: string,
  status: number,
  details?: Record<string, unknown>,
) {
  return NextResponse.json(details ? { message, details } : { message }, {
    status,
  });
}

async function parseRequestData(req: NextRequest) {
  const jsonData = await req.json();
  return productSchema.parse(jsonData);
}

async function fetchExistingProduct(productId: string, userId: string) {
  // console.log({ id: productId, userId });

  return prisma.product.findUnique({
    where: { id: parseInt(productId), userId },
  });
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

async function handleImages(
  existingImages: string[],
  newImages: string[],
  s3Service: S3Service,
) {
  const toAdd = newImages.filter((image) => isBase64Image(image));
  const toDelete = existingImages.filter((image) => !newImages.includes(image));

  // Upload new images to S3
  const uploadedUrls = await Promise.all(
    toAdd.map((image) => uploadImage(image, s3Service)),
  );

  // Delete missing images from S3
  await Promise.all(toDelete.map((image) => deleteImage(image, s3Service)));

  // Combine existing and new uploaded URLs
  return [
    ...newImages.filter((image) => !isBase64Image(image)),
    ...uploadedUrls,
  ];
}

function isBase64Image(data: string) {
  return /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/.test(data);
}

async function uploadImage(image: string, s3Service: S3Service) {
  const matchResult = image.match(
    /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/,
  );
  if (!matchResult) throw new Error("Invalid base64 image format");
  const [, mimeType, base64Data] = matchResult;
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `${uuidv4()}.${mimeType}`;

  try {
    const s3Response = await s3Service.putItemInBucket(
      fileName,
      buffer,
      {
        path: `Product-images`,
        ContentType: `image/${mimeType}`,
      },
      env.S3_BUCKET,
    );
    return s3Response.completedUrl;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload new image to S3");
  }
}

async function deleteImage(imageUrl: string, s3Service: S3Service) {
  const imageKey = extractFileName(imageUrl);
  try {
    await s3Service.deleteItemInBucket(`Product-images/${imageKey}`);
    console.log(`Deleted image: ${imageKey}`);
  } catch (error) {
    console.error("Failed to delete image from S3:", error);
    throw new Error("Failed to delete image from S3");
  }
}

function extractFileName(url: string) {
  return url.split("/").pop();
}
