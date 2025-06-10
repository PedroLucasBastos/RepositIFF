/*
  Warnings:

  - A unique constraint covering the columns `[advisorId]` on the table `Advisor_AcademicWork` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Advisor_AcademicWork_advisorId_key" ON "Advisor_AcademicWork"("advisorId");
