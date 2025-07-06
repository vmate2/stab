/*
  Warnings:

  - Added the required column `size` to the `polorendeles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "polorendeles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "size" TEXT NOT NULL;
