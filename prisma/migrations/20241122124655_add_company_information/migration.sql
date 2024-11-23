-- CreateTable
CREATE TABLE "company_information" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "websiteUrl" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "industry" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_information_user_id_key" ON "company_information"("user_id");
