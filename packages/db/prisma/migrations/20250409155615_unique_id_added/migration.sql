/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_messageId_key" ON "Chat"("messageId");
