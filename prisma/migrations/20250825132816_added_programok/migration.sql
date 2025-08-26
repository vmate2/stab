-- CreateTable
CREATE TABLE "public"."programok" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "beosztva" JSONB NOT NULL,

    CONSTRAINT "programok_pkey" PRIMARY KEY ("id")
);
