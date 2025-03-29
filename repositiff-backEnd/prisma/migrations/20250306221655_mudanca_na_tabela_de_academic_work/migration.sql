/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AcademicWorkToAuthor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AcademicWorkToAuthor" DROP CONSTRAINT "_AcademicWorkToAuthor_A_fkey";

-- DropForeignKey
ALTER TABLE "_AcademicWorkToAuthor" DROP CONSTRAINT "_AcademicWorkToAuthor_B_fkey";

-- AlterTable
ALTER TABLE "AcademicWork" ADD COLUMN     "authors" TEXT[];

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "_AcademicWorkToAuthor";
