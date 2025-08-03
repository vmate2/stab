-- AlterTable
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "transactions_id_key";
