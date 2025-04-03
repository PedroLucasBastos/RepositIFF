/*
  Warnings:

  - You are about to drop the column `url` on the `AcademicWork` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `AcademicWork` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AcademicWork" DROP COLUMN "url",
ADD COLUMN     "fileId" TEXT;

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createAt" TEXT NOT NULL,
    "updalaodAt" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicWork_fileId_key" ON "AcademicWork"("fileId");

-- AddForeignKey
ALTER TABLE "AcademicWork" ADD CONSTRAINT "AcademicWork_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
