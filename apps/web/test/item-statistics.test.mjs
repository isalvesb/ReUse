import test from "node:test";
import assert from "node:assert/strict";
import { readOwnItemStatistics } from "../src/lib/profile-domain.mjs";
import { itemStatistics } from "../src/lib/item-statistics.mjs";
function database(rows) {
  return {
    item: {
      groupBy: async (q) => {
        assert.deepEqual(q.by, ["type", "status"]);
        assert.deepEqual(q._count, { _all: true });
        const groups = new Map();
        for (const r of rows.filter((r) => r.sellerId === q.where.sellerId)) {
          const key = r.type + r.status;
          if (!groups.has(key))
            groups.set(key, {
              type: r.type,
              status: r.status,
              _count: { _all: 0 },
            });
          groups.get(key)._count._all++;
        }
        return [...groups.values()];
      },
    },
  };
}
test("estatísticas separam titulares e reutilizam a semântica de anúncios da Web", async () => {
  const rows = [
    { sellerId: "A", type: "TROCA", status: "ATIVO" },
    { sellerId: "A", type: "VENDA", status: "INATIVO" },
    { sellerId: "A", type: "DOACAO", status: "RESERVADO" },
    { sellerId: "B", type: "VENDA", status: "ATIVO" },
  ];
  const db = database(rows);
  const a = await readOwnItemStatistics(db, { userId: "A" }),
    b = await readOwnItemStatistics(db, { userId: "B" });
  assert.deepEqual(a, {
    totalItems: 3,
    activeItems: 1,
    pausedItems: 1,
    donationItems: 1,
    tradeItems: 1,
    saleItems: 1,
  });
  assert.equal(b.totalItems, 1);
  assert.equal(b.tradeItems, 0);
  assert.deepEqual(
    a,
    itemStatistics(
      rows
        .filter((r) => r.sellerId === "A")
        .map((r) => ({ negotiationType: r.type, status: r.status })),
    ),
  );
  await assert.rejects(
    readOwnItemStatistics(db, null),
    (e) => e.status === 401,
  );
});
test("publicação e pausa alteram apenas as contagens pertinentes, sem cache nem reputação artificial", async () => {
  const rows = [],
    db = database(rows);
  assert.equal(
    (await readOwnItemStatistics(db, { userId: "A" })).totalItems,
    0,
  );
  rows.push({ sellerId: "A", type: "DOACAO", status: "ATIVO" });
  assert.equal(
    (await readOwnItemStatistics(db, { userId: "A" })).activeItems,
    1,
  );
  rows[0].status = "INATIVO";
  const changed = await readOwnItemStatistics(db, { userId: "A" });
  assert.equal(changed.totalItems, 1);
  assert.equal(changed.activeItems, 0);
  assert.equal(changed.pausedItems, 1);
  assert.ok(!("rating" in changed));
});
test("falha do banco não vira contagem zero", async () => {
  await assert.rejects(
    readOwnItemStatistics(
      {
        item: {
          groupBy: async () => {
            throw Error("offline");
          },
        },
      },
      { userId: "A" },
    ),
    /offline/,
  );
});
