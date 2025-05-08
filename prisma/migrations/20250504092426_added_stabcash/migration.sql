-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "stabcash" (
    "id" INTEGER NOT NULL,
    "balance" BIGINT NOT NULL,

    CONSTRAINT "stabcash_pkey" PRIMARY KEY ("id")
);
