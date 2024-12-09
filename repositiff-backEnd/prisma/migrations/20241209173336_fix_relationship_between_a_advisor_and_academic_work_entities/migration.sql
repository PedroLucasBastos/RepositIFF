/*
  Warnings:

  - You are about to drop the `_AcademicWorkToAdvisor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AcademicWorkToAdvisor" DROP CONSTRAINT "_AcademicWorkToAdvisor_A_fkey";

-- DropForeignKey
ALTER TABLE "_AcademicWorkToAdvisor" DROP CONSTRAINT "_AcademicWorkToAdvisor_B_fkey";

-- DropTable
DROP TABLE "_AcademicWorkToAdvisor";

-- CreateTable
CREATE TABLE "Advisor_AcademicWork" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "academicWorkId" TEXT NOT NULL,

    CONSTRAINT "Advisor_AcademicWork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_AcademicWork_id_key" ON "Advisor_AcademicWork"("id");

-- AddForeignKey
ALTER TABLE "Advisor_AcademicWork" ADD CONSTRAINT "Advisor_AcademicWork_academicWorkId_fkey" FOREIGN KEY ("academicWorkId") REFERENCES "AcademicWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisor_AcademicWork" ADD CONSTRAINT "Advisor_AcademicWork_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
