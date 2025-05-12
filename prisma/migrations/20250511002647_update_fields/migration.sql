/*
  Warnings:

  - You are about to drop the column `lastDonation` on the `BloodGroup` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `BloodGroup` table. All the data in the column will be lost.
  - Added the required column `bloodType` to the `BloodGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BloodGroup" DROP COLUMN "lastDonation",
DROP COLUMN "type",
ADD COLUMN     "bloodType" TEXT NOT NULL;
