/*
  Warnings:

  - You are about to drop the column `code` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseCode]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseCode` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_code_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "code",
ADD COLUMN     "courseCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseCode_key" ON "Course"("courseCode");
