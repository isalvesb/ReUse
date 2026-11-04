import test from "node:test";
import assert from "node:assert/strict";
import { cleanupPhotos } from "../src/lib/item-storage.mjs";
test("limpeza só remove expirados sem associação e preserva arquivos adquiridos por publicação concorrente", async () => {
  const removed = [],
    deleted = [],
    restored = [];
  const rows = [
    {
      id: "expired",
      ownerId: "owner",
      mime: "image/jpeg",
      status: "PENDING",
      stagingKey: "staging/expired",
      storageKey: null,
    },
    {
      id: "attached-race",
      status: "VERIFIED",
      stagingKey: "stage",
      storageKey: "live",
    },
    {
      id: "claimed",
      status: "VERIFIED",
      stagingKey: "stage2",
      storageKey: "live2",
    },
  ];
  let query;
  const db = {
    itemUpload: {
      findMany: async (q) => {
        query = q;
        return rows;
      },
      updateMany: async ({ where }) => ({
        count: where.id === "claimed" ? 0 : 1,
      }),
      update: async (q) => restored.push(q),
      delete: async (q) => deleted.push(q.where.id),
    },
    itemImage: {
      count: async ({ where }) => (where.uploadId === "attached-race" ? 1 : 0),
    },
  };
  const result = await cleanupPhotos(
    db,
    { userId: "verified-owner" },
    {
      remove: async (keys) => {
        removed.push(...keys);
        return { error: null };
      },
    },
  );
  assert.equal(result.removed, 1);
  assert.equal(query.where.ownerId, "verified-owner");
  assert.equal(query.where.status.not, "ATTACHED");
  assert.ok(query.where.expiresAt.lt instanceof Date);
  assert.deepEqual(removed, ["staging/expired", "verified/owner/expired.jpg"]);
  assert.deepEqual(deleted, ["expired"]);
  assert.equal(restored[0].data.status, "ATTACHED");
});
