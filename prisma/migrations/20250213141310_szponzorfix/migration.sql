/*
  Warnings:

  - You are about to drop the column `sucess` on the `szponzorok` table. All the data in the column will be lost.
  - Added the required column `success` to the `szponzorok` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "szponzorok" DROP COLUMN "sucess",
ADD COLUMN     "success" TEXT NOT NULL;
