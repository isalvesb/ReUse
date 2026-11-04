import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanupPhotos,
  inspectPhotoCleanup,
} from "../src/lib/item-storage.mjs";
const past = new Date("2020-01-01"),
  future = new Date("2099-01-01");
function row(id, changes = {}) {
  return {
    id,
    ownerId: "A",
    mime: "image/jpeg",
    status: "PENDING",
    stagingKey: `staging/A/${id}.jpg`,
    storageKey: null,
    expiresAt: past,
    ...changes,
  };
}
// In-memory transactions serialize concurrent claims and roll back failed work.
// No connection to PostgreSQL or Storage is made by these destructive scenarios.
function database(input, linked = []) {
  let rows = new Map(input.map((r) => [r.id, { ...r }])),
    queue = Promise.resolve();
  const refs = new Set(linked),
    queries = [];
  const matches = (r, w) =>
    (!w.id || r.id === w.id) &&
    (!w.ownerId || r.ownerId === w.ownerId) &&
    (!w.status ||
      (typeof w.status === "string"
        ? r.status === w.status
        : r.status !== w.status.not)) &&
    (!w.expiresAt || r.expiresAt < w.expiresAt.lt) &&
    (!w.image || !refs.has(r.id));
  const itemUpload = {
    findMany: async (q) => {
      queries.push(q);
      return [...rows.values()]
        .filter((r) => matches(r, q.where))
        .sort((a, b) => a.expiresAt - b.expiresAt || a.id.localeCompare(b.id))
        .slice(0, q.take)
        .map((r) => ({ ...r }));
    },
    count: async (q) =>
      [...rows.values()].filter((r) => matches(r, q.where)).length,
    updateMany: async (q) => {
      if (db.beforeClaim) {
        db.beforeClaim(q);
        db.beforeClaim = null;
      }
      const r = rows.get(q.where.id);
      if (!r || !matches(r, q.where)) return { count: 0 };
      Object.assign(r, q.data);
      return { count: 1 };
    },
    update: async (q) => Object.assign(rows.get(q.where.id), q.data),
    delete: async (q) => {
      assert.ok(rows.has(q.where.id));
      rows.delete(q.where.id);
    },
  };
  const db = {
    refs,
    queries,
    beforeClaim: null,
    itemUpload,
    get rows() {
      return rows;
    },
    itemImage: { count: async (q) => (refs.has(q.where.uploadId) ? 1 : 0) },
    $transaction: async (work) => {
      const previous = queue;
      let release;
      queue = new Promise((r) => {
        release = r;
      });
      await previous;
      const snapshot = new Map([...rows].map(([id, r]) => [id, { ...r }]));
      try {
        return await work(db);
      } catch (e) {
        rows = snapshot;
        throw e;
      } finally {
        release();
      }
    },
  };
  return db;
}
test("dry-run exclui associações vivas, não expirados e outras contas sem efetuar escritas", async () => {
  const db = database(
    [
      row("live", { status: "DETACHED" }),
      row("attached", { status: "ATTACHED" }),
      row("new", { expiresAt: future }),
      row("other", { ownerId: "B" }),
      row("expired"),
    ],
    ["live"],
  );
  db.$transaction = () => assert.fail("dry-run não escreve");
  const plan = await inspectPhotoCleanup(db, { userId: "A" });
  assert.equal(plan.expiredCandidates, 1);
  assert.deepEqual(
    plan.rows.map((r) => r.id),
    ["expired"],
  );
  assert.equal(db.rows.size, 5);
  assert.equal(db.rows.get("live").status, "DETACHED");
});
test("retenção usa expiresAt existente, inclui retomada CLEANING e limita lote ordenado a 50", async () => {
  const now = new Date("2026-11-04T12:00:00Z"),
    db = database([
      row("boundary", { expiresAt: now }),
      row("cleaning", { status: "CLEANING" }),
      ...Array.from({ length: 55 }, (_, i) =>
        row(`id-${i.toString().padStart(2, "0")}`),
      ),
    ]);
  const plan = await inspectPhotoCleanup(db, null, now);
  assert.equal(plan.expiredCandidates, 56);
  assert.equal(plan.rows.length, 50);
  assert.equal(plan.rows[0].id, "cleaning");
  assert.ok(!plan.rows.some((r) => r.id === "boundary"));
  assert.equal(db.rows.get("cleaning").expiresAt, past);
});
test("publicação que ganha a disputa de associação é preservada antes da remoção", async () => {
  const db = database([row("race", { status: "VERIFIED" })]);
  db.beforeClaim = () => {
    db.refs.add("race");
    db.rows.get("race").status = "ATTACHED";
  };
  const result = await cleanupPhotos(
    db,
    { userId: "A" },
    { remove: () => assert.fail("imagem associada não pode ser removida") },
  );
  assert.deepEqual(result, { removed: 0, skipped: 1, failed: 0 });
  assert.equal(db.rows.get("race").status, "ATTACHED");
});
test("falhas parciais não interrompem lote; repetição retoma falhas e não exclui arquivos válidos", async () => {
  const db = database(
      [row("a"), row("b"), row("c"), row("live", { status: "ATTACHED" })],
      ["live"],
    ),
    removed = [];
  const first = await cleanupPhotos(db, null, {
    remove: async (keys) => {
      removed.push(keys);
      if (keys[0].includes("/a.")) return { error: Error("offline") };
      if (keys[0].includes("/b.")) throw Error("transport");
      return { error: null };
    },
  });
  assert.deepEqual(first, { removed: 1, skipped: 0, failed: 2 });
  assert.ok(db.rows.has("a") && db.rows.has("b") && db.rows.has("live"));
  assert.ok(removed.every((keys) => !keys.some((k) => k.includes("live"))));
  const store = { remove: async () => ({ error: null }) };
  assert.equal((await cleanupPhotos(db, null, store)).removed, 2);
  assert.deepEqual(await cleanupPhotos(db, null, store), {
    removed: 0,
    skipped: 0,
    failed: 0,
  });
  assert.equal(db.rows.size, 1);
});
test("dois workers não removem simultaneamente uma retomada CLEANING", async () => {
  const db = database([row("recover", { status: "CLEANING" })]);
  let calls = 0;
  const store = {
    remove: async (keys) => {
      calls++;
      assert.deepEqual(keys, [
        "staging/A/recover.jpg",
        "verified/A/recover.jpg",
      ]);
      await new Promise((r) => setImmediate(r));
      return { error: null };
    },
  };
  const results = await Promise.all([
    cleanupPhotos(db, null, store),
    cleanupPhotos(db, null, store),
  ]);
  assert.equal(calls, 1);
  assert.equal(
    results.reduce((n, r) => n + r.removed, 0),
    1,
  );
  assert.equal(
    results.reduce((n, r) => n + r.skipped, 0),
    1,
  );
});
