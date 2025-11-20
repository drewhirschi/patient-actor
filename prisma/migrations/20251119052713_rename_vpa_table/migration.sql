/*
  Warnings:

  - You are about to drop the `PatientActor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PatientActor" DROP CONSTRAINT "PatientActor_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."chat_session" DROP CONSTRAINT "chat_session_patientActorId_fkey";

-- AlterTable
ALTER TABLE "submitted_session" ADD COLUMN     "aiGradedAt" TIMESTAMP(3),
ADD COLUMN     "aiGrades" JSONB,
ADD COLUMN     "autoGraded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rubricScores" JSONB;

-- DropTable
ALTER TABLE "public"."PatientActor" RENAME TO "patient_actor";

-- CreateTable
CREATE TABLE "grading_rubric" (
    "id" TEXT NOT NULL,
    "patientActorId" TEXT NOT NULL,
    "categories" JSONB NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "passingThreshold" INTEGER,
    "autoGradeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grading_rubric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_actor_slug_key" ON "patient_actor"("slug");

-- CreateIndex
CREATE INDEX "patient_actor_slug_idx" ON "patient_actor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "grading_rubric_patientActorId_key" ON "grading_rubric"("patientActorId");

-- CreateIndex
CREATE INDEX "submitted_session_requiresReview_idx" ON "submitted_session"("requiresReview");

-- AddForeignKey
ALTER TABLE "patient_actor" ADD CONSTRAINT "patient_actor_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_session" ADD CONSTRAINT "chat_session_patientActorId_fkey" FOREIGN KEY ("patientActorId") REFERENCES "patient_actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_rubric" ADD CONSTRAINT "grading_rubric_patientActorId_fkey" FOREIGN KEY ("patientActorId") REFERENCES "patient_actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
