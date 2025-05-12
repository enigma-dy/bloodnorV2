/*
  Warnings:

  - A unique constraint covering the columns `[bloodType]` on the table `BloodGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BloodGroup_bloodType_key" ON "BloodGroup"("bloodType");
