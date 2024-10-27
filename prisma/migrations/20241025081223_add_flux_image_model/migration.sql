/*
  Warnings:

  - You are about to drop the column `image_url` on the `flux_data` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "flux_data" DROP COLUMN "image_url";

-- CreateTable
CREATE TABLE "flux_ai_images" (
    "id" SERIAL NOT NULL,
    "flux_id" INTEGER NOT NULL,
    "image_url" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flux_ai_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flux_ai_images" ADD CONSTRAINT "flux_ai_images_flux_id_fkey" FOREIGN KEY ("flux_id") REFERENCES "flux_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
