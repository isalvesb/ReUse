ALTER TABLE "items" ADD COLUMN "creationKey" TEXT, ADD COLUMN "creationHash" TEXT;
CREATE UNIQUE INDEX "items_creationKey_key" ON "items"("creationKey");
ALTER TABLE "item_images" ADD COLUMN "uploadId" UUID;
CREATE UNIQUE INDEX "item_images_uploadId_key" ON "item_images"("uploadId");
CREATE TABLE "item_uploads" (
 "id" UUID PRIMARY KEY, "ownerId" TEXT NOT NULL REFERENCES users(id),
 "stagingKey" TEXT NOT NULL UNIQUE, "storageKey" TEXT UNIQUE,
 "mime" TEXT NOT NULL, "size" INTEGER NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "expiresAt" TIMESTAMP(3) NOT NULL
);
ALTER TABLE item_images ADD CONSTRAINT item_image_upload FOREIGN KEY ("uploadId") REFERENCES item_uploads(id);
CREATE INDEX "item_uploads_ownerId_status_expiresAt_idx" ON item_uploads("ownerId",status,"expiresAt");
ALTER TABLE item_uploads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON item_uploads FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON item_uploads TO reuse_lab_runtime;
CREATE POLICY backend_only ON item_uploads FOR ALL TO reuse_lab_runtime USING (true) WITH CHECK (true);
