-- CreateTable
CREATE TABLE "szponzorok" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "contact" TEXT,
    "sucess" INTEGER NOT NULL,
    "desc" TEXT,

    CONSTRAINT "szponzorok_pkey" PRIMARY KEY ("id")
);
