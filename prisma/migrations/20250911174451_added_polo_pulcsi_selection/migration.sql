/*
  Warnings:

  - Added the required column `type` to the `polorendeles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."polorendeles" ADD COLUMN     "type" TEXT NOT NULL;
