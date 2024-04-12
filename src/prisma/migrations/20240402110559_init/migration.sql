/*
  Warnings:

  - A unique constraint covering the columns `[id_telegram]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_id_telegram_key" ON "User"("id_telegram");