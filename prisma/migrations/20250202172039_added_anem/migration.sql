/*
  Warnings:

  - Added the required column `name` to the `stabtagok` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stabtagok" ADD COLUMN     "name" TEXT NOT NULL;
