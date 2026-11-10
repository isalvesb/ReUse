import test from "node:test";
import assert from "node:assert/strict";
import { authorizedPhotoUrl } from "../src/lib/image-access.mjs";
import { notificationSnapshot } from "../src/lib/notification-snapshot.mjs";
import { startVisiblePolling, pollingSnapshotValue } from "../src/lib/visible-polling.mjs";
import { listCatalog, catalogQuery } from "../src/lib/catalog-domain.mjs";

const imageId = "00000000-0000-4000-8000-000000000001";
test("polling: renderização anônima e troca de conta/snapshot não reutilizam o resultado anterior", () => {
  assert.equal(pollingSnapshotValue(null, undefined, 0), 0);
  const snapshot = { userId: "A", initial: 1, value: 3 };
  assert.equal(pollingSnapshotValue(snapshot, "A", 1), 3);
  assert.equal(pollingSnapshotValue(snapshot, "B", 0), 0);
  assert.equal(pollingSnapshotValue(snapshot, "A", 2), 2);
});
test("imagem: ativo é público; todos os estados não públicos exigem proprietário verificado", async () => {
  for (const status of ["ATIVO", "INATIVO", "RESERVADO", "CONCLUIDO"]) {
    for (const userId of [null, "owner", "other"]) {
      let queries = 0, auth = 0, signatures = 0;
      const db = { $queryRaw: async (strings, id) => {
        queries++;
        assert.equal(id, imageId);
        assert.ok(strings.join("").includes('JOIN "public"."items"'));
        return [{ status, sellerId: "owner", storageKey: "private-key" }];
      } };
      const url = await authorizedPhotoUrl(db, imageId, async () => { auth++; return userId ? { userId } : null; }, async key => { signatures++; assert.equal(key, "private-key"); return "signed-fixture"; });
      const allowed = status === "ATIVO" || userId === "owner";
      assert.equal(url, allowed ? "signed-fixture" : null);
      assert.equal(signatures, allowed ? 1 : 0);
      assert.equal(queries, 1);
      assert.equal(auth, status === "ATIVO" ? 0 : 1);
    }
  }
});
test("imagem: ID inválido, ausência e upload incompleto não assinam; falha de Auth não concede acesso", async () => {
  const sign = async () => assert.fail("must not sign");
  const unused = { $queryRaw: async () => assert.fail("must not query") };
  for (const id of ["x", "' OR 1=1--", null]) assert.equal(await authorizedPhotoUrl(unused, id, null, sign), null);
  for (const rows of [[], [{ storageKey: null }], [{ status: "INATIVO", sellerId: "owner", storageKey: "key" }]]) {
    const db = { $queryRaw: async () => rows };
    assert.equal(await authorizedPhotoUrl(db, imageId, async () => { throw Error("Auth unavailable"); }, sign), null);
  }
});
test("imagem: falha de Storage não retorna link antigo nem ignora autorização", async () => {
  const db = { $queryRaw: async () => [{ status: "ATIVO", sellerId: "owner", storageKey: "key" }] };
  await assert.rejects(authorizedPhotoUrl(db, imageId, null, async () => { throw Error("storage unavailable"); }), /storage unavailable/);
});

test("notificações: conta esperada nunca autoriza leitura de outra conta ou sessão ausente", async () => {
  const db = { notification: { count: async () => assert.fail("no private reads") } };
  assert.equal(await notificationSnapshot(db, null, "A"), null);
  assert.equal(await notificationSnapshot(db, { userId: "B" }, "A", null, true), null);
});
test("notificações: uma leitura fornece lista e contador somente da identidade verificada", async () => {
  const rows = { A: [{ id: "a", read: false, message: "A only", createdAt: new Date(0) }], B: [] };
  let reads = 0;
  const db = { notification: {
    findMany: async ({ where }) => { reads++; return rows[where.userId]; },
    count: async ({ where }) => { reads++; assert.equal(where.read, false); return rows[where.userId].filter(n => !n.read).length; },
  } };
  const a = await notificationSnapshot(db, { userId: "A" }, "A", null, true);
  assert.equal(a.items[0].message, "A only");assert.equal(a.unreadCount, 1);assert.equal(reads, 2);
  // Simulates an update by another isolated tab/consumer, never a remote write.
  rows.A[0].read = true;
  const again = await notificationSnapshot(db, { userId: "A" }, "A", null, true);
  assert.equal(again.unreadCount, 0);assert.equal(again.items[0].read, true);
  const b = await notificationSnapshot(db, { userId: "B" }, "B", null, true);
  assert.deepEqual(b.items, []);assert.equal(b.unreadCount, 0);
  await assert.rejects(notificationSnapshot(db, { userId: "A" }, "A", "invalid-cursor", true), e => e.status === 400);
});

function environment() {
  const window = new EventTarget(), document = new EventTarget();
  document.hidden = false;
  let tick, cleared = false;
  window.setInterval = (fn, ms) => { assert.equal(ms, 10000); tick = fn; return 1; };
  window.clearInterval = id => { assert.equal(id, 1); cleared = true; };
  return { window, document, tick: () => tick(), get cleared() { return cleared; } };
}
test("polling: intervalo/foco/visibilidade simultâneos compartilham uma leitura, sem refresh completo", async () => {
  const env = environment();let resolve, reads = 0;const published = [];
  const stop = startVisiblePolling({ ...env, read: () => { reads++; return new Promise(r => { resolve = r; }); }, publish: x => published.push(x) });
  const pending = env.tick();env.window.dispatchEvent(new Event("focus"));env.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(reads, 1);resolve(7);await pending;assert.deepEqual(published, [7]);
  env.document.hidden = true;await env.tick();assert.equal(reads, 1);
  env.document.hidden = false;env.window.dispatchEvent(new Event("focus"));assert.equal(reads, 2);
  stop();resolve(8);await Promise.resolve();await Promise.resolve();
  assert.deepEqual(published, [7]);assert.equal(env.cleared, true);
  env.window.dispatchEvent(new Event("focus"));await env.tick();assert.equal(reads, 2);
});
test("polling: falha mantém dados; próxima leitura recupera, sem reutilizar dados de um consumidor desmontado", async () => {
  const env = environment();const values = [];let attempt = 0;
  const stop = startVisiblePolling({ ...env, read: async () => { if (++attempt === 1) throw Error("offline"); return 2; }, publish: value => values.push(value) });
  await env.tick();assert.deepEqual(values, []);await env.tick();assert.deepEqual(values, [2]);stop();
});

test("catálogo: lista e total mantêm filtros e snapshot RepeatableRead na mesma transação", async () => {
  const query = catalogQuery(new URLSearchParams("q=livro&categoria=livros&tipo=TROCA&page=2"));
  let listWhere, countWhere;
  const db = { item: {
    findMany: args => { listWhere = args.where;assert.equal(args.skip, 12);assert.equal(args.take, 12);return Promise.resolve([]); },
    count: args => { countWhere = args.where;return Promise.resolve(25); },
  }, $transaction: async (queries, options) => { assert.deepEqual(options, { isolationLevel: "RepeatableRead" });return Promise.all(queries); } };
  const result = await listCatalog(db, query);
  assert.deepEqual(listWhere, countWhere);assert.equal(listWhere.status, "ATIVO");
  assert.equal(result.pagination.page, 2);assert.equal(result.pagination.total, 25);assert.equal(result.pagination.totalPages, 3);
});
