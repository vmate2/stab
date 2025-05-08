/*
  Warnings:

  - You are about to drop the column `success` on the `szponzorok` table. All the data in the column will be lost.
  - Added the required column `status` to the `szponzorok` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "szponzorok" DROP COLUMN "success",
ADD COLUMN     "status" TEXT NOT NULL;
