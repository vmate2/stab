-- CreateTable
CREATE TABLE "public"."kaszinoUser" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kaszinoUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kaszinoUser_email_key" ON "public"."kaszinoUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kaszinoUser_username_key" ON "public"."kaszinoUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "kaszinoUser_uuid_key" ON "public"."kaszinoUser"("uuid");
