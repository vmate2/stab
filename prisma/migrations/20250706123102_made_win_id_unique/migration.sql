/*
  Warnings:

  - A unique constraint covering the columns `[winID]` on the table `wheelWin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "wheelWin_winID_key" ON "wheelWin"("winID");
