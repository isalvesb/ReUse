ALTER TABLE "users" ADD COLUMN "authSubject" UUID;
CREATE UNIQUE INDEX "users_authSubject_key" ON "users"("authSubject");
CREATE TABLE "domain_auth_sessions" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    CONSTRAINT "domain_auth_sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "domain_auth_sessions_userId_idx" ON "domain_auth_sessions"("userId");
ALTER TABLE "domain_auth_sessions" ADD CONSTRAINT "domain_auth_sessions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
