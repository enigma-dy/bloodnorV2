/*
  Warnings:

  - A unique constraint covering the columns `[name,hospitalId]` on the table `BloodBank` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BloodBank_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "BloodBank_name_hospitalId_key" ON "BloodBank"("name", "hospitalId");
