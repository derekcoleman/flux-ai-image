-- AlterTable
ALTER TABLE "flux_data" ALTER COLUMN "lora_url" SET DATA TYPE VARCHAR,
ALTER COLUMN "lora_name" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "flux_downloads" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "flux_views" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "gift_code" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "newsletters" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subscribers" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_billing" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_credit" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_credit_transaction" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_payment_info" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- DropTable
DROP TABLE "product_mockup";

