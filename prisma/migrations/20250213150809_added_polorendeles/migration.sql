-- CreateTable
CREATE TABLE "polorendeles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "felirat" TEXT,
    "paid" BOOLEAN NOT NULL,

    CONSTRAINT "polorendeles_pkey" PRIMARY KEY ("id")
);
