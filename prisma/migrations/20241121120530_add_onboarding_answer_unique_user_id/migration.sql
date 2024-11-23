/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `onboarding_answers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "onboarding_answers_user_id_key" ON "onboarding_answers"("user_id");
