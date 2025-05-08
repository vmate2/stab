-- CreateTable
CREATE TABLE "transactions" (
    "id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");
