-- AlterTable
ALTER TABLE "wheelWin" ADD COLUMN     "claimedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "locations" (
    "username" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_userID_key" ON "locations"("userID");
