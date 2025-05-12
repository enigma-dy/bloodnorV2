-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "bloodGroupId" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodGroup" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "lastDonation" TIMESTAMP(3),

    CONSTRAINT "BloodGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bloodGroupId_fkey" FOREIGN KEY ("bloodGroupId") REFERENCES "BloodGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
