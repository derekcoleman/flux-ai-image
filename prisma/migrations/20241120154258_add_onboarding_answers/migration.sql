-- CreateTable
CREATE TABLE "onboarding_answers" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "role" TEXT NOT NULL,
    "interests" JSONB NOT NULL,
    "designTypes" JSONB NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "goals" JSONB NOT NULL,
    "contentFrequency" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "onboarding_answers_pkey" PRIMARY KEY ("id")
);
