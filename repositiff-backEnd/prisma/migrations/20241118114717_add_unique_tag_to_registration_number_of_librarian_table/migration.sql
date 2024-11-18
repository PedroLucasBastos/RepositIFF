/*
  Warnings:

  - A unique constraint covering the columns `[registrationNumber]` on the table `Librarian` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Librarian_registrationNumber_key" ON "Librarian"("registrationNumber");
