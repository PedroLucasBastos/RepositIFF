/*
  Warnings:

  - You are about to drop the column `academicWorkStatus` on the `AcademicWork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AcademicWork" DROP COLUMN "academicWorkStatus",
ADD COLUMN     "academicWorkVisibility" BOOLEAN NOT NULL DEFAULT false;
