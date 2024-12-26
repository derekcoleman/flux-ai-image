/*
  Warnings:

  - Added the required column `training_id` to the `product_mockup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_mockup" ADD COLUMN     "training_id" VARCHAR NOT NULL;
