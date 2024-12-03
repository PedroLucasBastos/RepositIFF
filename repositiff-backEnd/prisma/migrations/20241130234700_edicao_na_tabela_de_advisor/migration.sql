/*
  Warnings:

  - You are about to drop the column `nome` on the `Advisor` table. All the data in the column will be lost.
  - You are about to drop the column `sobrenome` on the `Advisor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Advisor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Advisor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNumber` to the `Advisor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Advisor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Advisor" DROP COLUMN "nome",
DROP COLUMN "sobrenome",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "registrationNumber" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_registrationNumber_key" ON "Advisor"("registrationNumber");
