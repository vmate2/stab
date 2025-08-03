-- CreateTable
CREATE TABLE "tesztszponzorok" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "contact" TEXT,
    "status" TEXT NOT NULL,
    "desc" TEXT,
    "type" TEXT NOT NULL DEFAULT 'money',
    "sentFirstLetter" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tesztszponzorok_pkey" PRIMARY KEY ("id")
);
