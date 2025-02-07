-- CreateTable
CREATE TABLE "stabtagok" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "school" TEXT,
    "paidcash" INTEGER,
    "post" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT,

    CONSTRAINT "stabtagok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stabtagok_uuid_key" ON "stabtagok"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "stabtagok_email_key" ON "stabtagok"("email");

-- CreateIndex
CREATE UNIQUE INDEX "stabtagok_phone_key" ON "stabtagok"("phone");
