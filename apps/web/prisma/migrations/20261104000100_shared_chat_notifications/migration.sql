ALTER TABLE "conversations" ADD COLUMN "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "conversations" c SET "lastActivityAt" = COALESCE((SELECT MAX(m."createdAt") FROM "messages" m WHERE m."conversationId" = c.id), c."createdAt");
ALTER TABLE "messages" ADD COLUMN "clientKey" UUID;
ALTER TABLE "notifications" ADD COLUMN "conversationId" TEXT, ADD COLUMN "messageId" TEXT;
CREATE UNIQUE INDEX "messages_senderId_clientKey_key" ON "messages"("senderId", "clientKey");
CREATE UNIQUE INDEX "notifications_messageId_key" ON "notifications"("messageId");
CREATE INDEX "messages_conversationId_createdAt_id_idx" ON "messages"("conversationId", "createdAt", "id");
CREATE INDEX "conversations_buyerId_lastActivityAt_id_idx" ON "conversations"("buyerId", "lastActivityAt", "id");
CREATE INDEX "conversations_sellerId_lastActivityAt_id_idx" ON "conversations"("sellerId", "lastActivityAt", "id");
CREATE INDEX "notifications_userId_read_conversationId_idx" ON "notifications"("userId", "read", "conversationId");
CREATE INDEX "notifications_userId_createdAt_id_idx" ON "notifications"("userId", "createdAt", "id");
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- Existing RLS and runtime-only grants are preserved. Legacy notifications stay unlinked;
-- inferring conversations from itemId alone could select the wrong interested party.
