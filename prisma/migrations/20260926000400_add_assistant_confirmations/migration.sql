-- CreateTable
CREATE TABLE "assistant_confirmations" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "assistant_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assistant_confirmations_jti_key" ON "assistant_confirmations"("jti");

-- CreateIndex
CREATE INDEX "assistant_confirmations_userId_expiresAt_idx" ON "assistant_confirmations"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "assistant_confirmations" ADD CONSTRAINT "assistant_confirmations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
