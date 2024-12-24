-- AlterTable
ALTER TABLE "charge_order" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "charge_product" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "flux_data" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "lora_name" SET DATA TYPE TEXT,
ALTER COLUMN "lora_url" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "product_mockup" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "model_name" VARCHAR NOT NULL,
    "steps" INTEGER NOT NULL,
    "lora_rank" INTEGER NOT NULL,
    "optimizer" VARCHAR NOT NULL,
    "batch_size" INTEGER NOT NULL,
    "resolution" VARCHAR NOT NULL,
    "autocaption" BOOLEAN NOT NULL,
    "image_input" VARCHAR NOT NULL,
    "trigger_word" VARCHAR NOT NULL,
    "learning_rate" DOUBLE PRECISION NOT NULL,
    "wandb_project" VARCHAR NOT NULL,
    "wandb_save_interval" INTEGER NOT NULL,
    "caption_dropout_rate" DOUBLE PRECISION NOT NULL,
    "cache_latents_to_disk" BOOLEAN NOT NULL,
    "wandb_sample_interval" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_mockup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flux_ai_images_flux_id_idx" ON "flux_ai_images"("flux_id");
