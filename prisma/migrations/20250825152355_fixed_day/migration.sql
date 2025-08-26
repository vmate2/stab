/*
  Warnings:

  - Added the required column `day` to the `programok` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."programok" ADD COLUMN     "day" TEXT NOT NULL;
