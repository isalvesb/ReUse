-- DropIndex
DROP INDEX "messages_conversationId_idx";

-- CreateIndex
CREATE INDEX "conversations_buyerId_idx" ON "conversations"("buyerId");

-- CreateIndex
CREATE INDEX "conversations_sellerId_idx" ON "conversations"("sellerId");

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");
