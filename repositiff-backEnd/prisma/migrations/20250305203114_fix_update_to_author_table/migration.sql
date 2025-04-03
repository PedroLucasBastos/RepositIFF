/*
  Warnings:

  - You are about to drop the column `sobrenome` on the `Author` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationNumber` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "sobrenome",
ADD COLUMN     "registrationNumber" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Author_registrationNumber_key" ON "Author"("registrationNumber");
