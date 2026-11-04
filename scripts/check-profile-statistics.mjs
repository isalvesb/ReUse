// Lab-only verification. No uploads or cleanup. Status exercise is explicit and reversible.
import fs from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import {
  assertLabDatabaseUrl,
  LAB_PROJECT_REF,
  LAB_AUTH_URL,
} from "../apps/web/src/lib/lab-config.mjs";
import {
  storageClient,
  inspectPhotoCleanup,
} from "../apps/web/src/lib/item-storage.mjs";
const req = createRequire(new URL("../apps/web/package.json", import.meta.url));
const { PrismaClient } = req("@prisma/client"),
  { createClient } = req("@supabase/supabase-js");
assertLabDatabaseUrl(process.env.DATABASE_URL);
const credentials = JSON.parse(
  fs.readFileSync(process.env.REUSE_TEST_CREDENTIALS_FILE),
);
assert.equal(credentials.project_ref, LAB_PROJECT_REF);
assert.equal(credentials.auth_url, LAB_AUTH_URL);
const db = new PrismaClient(),
  base = "http://127.0.0.1:4330/api/v1",
  clients = [],
  tokens = {},
  checks = [];
const hash = (x) =>
  createHash("sha256").update(JSON.stringify(x)).digest("hex");
async function response(account, path, method = "GET", body) {
  return fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(account ? { Authorization: `Bearer ${tokens[account]}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function data(account, path, method, body) {
  const r = await response(account, path, method, body);
  assert.equal(r.status, 200, `HTTP inesperado em ${path.split("?")[0]}`);
  return (await r.json()).data;
}
async function databaseStats(userId) {
  const [r] =
    await db.$queryRaw`SELECT COUNT(*)::int AS "totalItems", COUNT(*) FILTER (WHERE status='ATIVO')::int AS "activeItems", COUNT(*) FILTER (WHERE status='INATIVO')::int AS "pausedItems", COUNT(*) FILTER (WHERE type='DOACAO')::int AS "donationItems", COUNT(*) FILTER (WHERE type='TROCA')::int AS "tradeItems", COUNT(*) FILTER (WHERE type='VENDA')::int AS "saleItems" FROM items WHERE "sellerId"=${userId}`;
  return r;
}
async function imageSnapshot() {
  return {
    uploads: hash(await db.itemUpload.findMany({ orderBy: { id: "asc" } })),
    associations: hash(await db.itemImage.findMany({ orderBy: { id: "asc" } })),
  };
}
async function storageSnapshot(ownerIds) {
  const store = storageClient(),
    files = [];
  for (const id of ownerIds)
    for (const area of ["staging", "verified"]) {
      const { data, error } = await store.list(`${area}/${id}`, {
        limit: 1000,
      });
      assert.ok(!error, "Inventário Storage indisponível.");
      for (const f of data)
        files.push([area, id, f.name, f.id, f.metadata?.size]);
    }
  return {
    count: files.length,
    hash: hash(
      files.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    ),
  };
}
let restoration = null,
  report;
try {
  const profiles = {};
  for (const account of ["a", "b"]) {
    const client = createClient(LAB_AUTH_URL, credentials.publishable_key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    clients.push(client);
    const { data: login, error } = await client.auth.signInWithPassword({
      email: credentials[`account_${account}_email`],
      password: credentials[`account_${account}_password`],
    });
    assert.ok(!error, "Login de teste indisponível.");
    tokens[account] = login.session.access_token;
    profiles[account] = await data(account, "/me");
  }
  assert.notEqual(profiles.a.id, profiles.b.id);
  const beforeImages = await imageSnapshot(),
    beforeStorage = await storageSnapshot([profiles.a.id, profiles.b.id]);
  const stats = {};
  for (const account of ["a", "b"]) {
    stats[account] = await data(account, "/me/stats");
    assert.deepEqual(stats[account], await databaseStats(profiles[account].id));
  }
  checks.push(
    "A e B: API corresponde a contagens SQL independentes por proprietário",
  );
  assert.equal((await response(null, "/me/stats")).status, 401);
  assert.equal(
    (await response("b", `/me/stats?userId=${profiles.a.id}`)).status,
    400,
  );
  assert.equal((await response("b", "/me/stats", "PATCH", {})).status, 405);
  checks.push(
    "Sem sessão e tentativa de escolher outro titular recusadas; endpoint somente de leitura",
  );
  const first = await inspectPhotoCleanup(db),
    second = await inspectPhotoCleanup(db);
  assert.equal(first.expiredCandidates, second.expiredCandidates);
  assert.deepEqual(
    first.rows.map((r) => r.id),
    second.rows.map((r) => r.id),
  );
  for (const row of first.rows)
    assert.equal(await db.itemImage.count({ where: { uploadId: row.id } }), 0);
  checks.push(
    "Duas simulações de limpeza estáveis, sem associações vivas entre candidatos",
  );
  if (process.argv.includes("--exercise-status")) {
    const item = await db.item.findFirst({
      where: {
        sellerId: profiles.a.id,
        status: "ATIVO",
        title: { contains: "fictíc" },
      },
      include: { category: true, images: { orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    assert.ok(
      item,
      "Nenhum anúncio fictício próprio elegível; não alterar outros registros.",
    );
    const body = {
      title: item.title,
      description: item.description,
      category: item.category.slug,
      type: item.type,
      condition: item.condition,
      price: item.price?.toString() ?? null,
      location: item.location || "",
      status: "INATIVO",
      updatedAt: item.updatedAt.toISOString(),
      photos: item.images.map((i) => ({ imageId: i.id })),
    };
    restoration = { id: item.id, body: { ...body, status: "ATIVO" } };
    await data("a", `/items/${item.id}`, "PATCH", body);
    const paused = await data("a", "/me/stats");
    assert.equal(paused.totalItems, stats.a.totalItems);
    assert.equal(paused.activeItems, stats.a.activeItems - 1);
    assert.equal(paused.pausedItems, stats.a.pausedItems + 1);
    assert.deepEqual(paused, await databaseStats(profiles.a.id));
    assert.deepEqual(await data("b", "/me/stats"), stats.b);
    restoration.body.updatedAt = (
      await db.item.findUnique({
        where: { id: item.id },
        select: { updatedAt: true },
      })
    ).updatedAt.toISOString();
    await data("a", `/items/${item.id}`, "PATCH", restoration.body);
    restoration = null;
    assert.deepEqual(await data("a", "/me/stats"), stats.a);
    checks.push(
      "Pausa e reativação fictícia refletidas; contagens restauradas e B inalterada",
    );
  }
  assert.deepEqual(await imageSnapshot(), beforeImages);
  assert.deepEqual(
    await storageSnapshot([profiles.a.id, profiles.b.id]),
    beforeStorage,
  );
  checks.push(
    "Associações, registros de upload e inventário Storage preservados",
  );
  report = {
    project: LAB_PROJECT_REF,
    checks,
    statistics: stats,
    expiredCandidateRecords: first.expiredCandidates,
    trackedStorageObjects: beforeStorage.count,
    storageFingerprint: beforeStorage.hash,
    realCleanup: false,
    statusExercise: process.argv.includes("--exercise-status"),
  };
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(
    JSON.stringify({
      error: "Verificação de manutenção não concluída",
      message: error.message?.replaceAll(
        /postgres(?:ql)?:\/\/[^\s]+/g,
        "[redacted]",
      ),
    }),
  );
  process.exitCode = 1;
} finally {
  if (restoration) {
    try {
      restoration.body.updatedAt = (
        await db.item.findUnique({
          where: { id: restoration.id },
          select: { updatedAt: true },
        })
      ).updatedAt.toISOString();
      await data("a", `/items/${restoration.id}`, "PATCH", restoration.body);
      console.error("Estado fictício original restaurado.");
    } catch {
      console.error(
        "PENDENTE: conferir manualmente o estado do anúncio fictício utilizado.",
      );
      process.exitCode = 1;
    }
  }
  for (const client of clients) client.auth.stopAutoRefresh();
  await db.$disconnect();
}
