// A parameterized join avoids three remote queries per photograph. Keys never
// leave this server-side flow except through the existing short-lived signature.
export async function authorizedPhotoUrl(db, id, readActor, sign) {
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const [photo] = await db.$queryRaw`
    SELECT item.status, item."sellerId", upload."storageKey"
    FROM "public"."item_images" AS image
    JOIN "public"."items" AS item ON item.id = image."itemId"
    JOIN "public"."item_uploads" AS upload ON upload.id = image."uploadId"
    WHERE image."uploadId" = ${id}::uuid
    LIMIT 1
  `;
  if (!photo?.storageKey) return null;
  if (photo.status !== "ATIVO") {
    let actor;
    try { actor = await readActor(); } catch { /* Keep private failures indistinguishable from absence. */ }
    if (actor?.userId !== photo.sellerId) return null;
  }
  return sign(photo.storageKey);
}
