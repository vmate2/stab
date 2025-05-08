/*
  Warnings:

  - Made the column `paidcash` on table `stabtagok` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stabtagok" ALTER COLUMN "paidcash" SET NOT NULL,
ALTER COLUMN "paidcash" SET DEFAULT 0;
