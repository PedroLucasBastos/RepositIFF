/*
  Warnings:

  - Added the required column `ilustration` to the `AcademicWork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicWork" ADD COLUMN     "ilustration" TEXT NOT NULL,
ADD COLUMN     "references" INTEGER[];
