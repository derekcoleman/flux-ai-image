/*
  Warnings:

  - A unique constraint covering the columns `[training_id]` on the table `product_mockup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_mockup_training_id_key" ON "product_mockup"("training_id");
