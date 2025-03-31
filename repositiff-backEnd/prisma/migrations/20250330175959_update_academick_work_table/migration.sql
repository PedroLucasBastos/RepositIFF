/*
  Warnings:

  - You are about to drop the column `fileId` on the `AcademicWork` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[file]` on the table `AcademicWork` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AcademicWork" DROP CONSTRAINT "AcademicWork_fileId_fkey";

-- DropIndex
DROP INDEX "AcademicWork_fileId_key";

-- AlterTable
ALTER TABLE "AcademicWork" DROP COLUMN "fileId",
ADD COLUMN     "file" TEXT;

-- DropTable
DROP TABLE "File";

-- CreateIndex
CREATE UNIQUE INDEX "AcademicWork_file_key" ON "AcademicWork"("file");
