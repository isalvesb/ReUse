import fs from "node:fs";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
const req = createRequire(new URL("../apps/web/package.json", import.meta.url)),
  { createClient } = req("@supabase/supabase-js");
const c = JSON.parse(fs.readFileSync(process.env.REUSE_TEST_CREDENTIALS_FILE));
assert.equal(c.project_ref, "mqvlgrxwuirgjutqltpv");
const base = "http://127.0.0.1:4330",
  checks = [],
  clients = [];
const tokens = {};
let itemId;
async function call(account, path, method = "GET", body) {
  return fetch(base + "/api/v1" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(account ? { Authorization: `Bearer ${tokens[account]}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function data(account, path, method, body) {
  const r = await call(account, path, method, body);
  assert.equal(r.status, 200, `HTTP ${r.status} em ${path.split("?")[0]}`);
  return (await r.json()).data;
}
async function check(name, run) {
  await run();
  checks.push({ name, passed: true });
}
async function upload(account, buffer, type = "image/jpeg") {
  const signed = await data(account, "/uploads", "POST", {
    type,
    size: buffer.length,
  });
  const r = await fetch(signed.url, {
    method: "PUT",
    headers: { "Content-Type": type },
    body: buffer,
  });
  assert.ok(r.ok, "Upload direto falhou.");
  await data(account, `/uploads/${signed.id}/complete`, "POST");
  return signed.id;
}
try {
  for (const a of ["a", "b"]) {
    const s = createClient(c.auth_url, c.publishable_key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    clients.push(s);
    const { data: d, error } = await s.auth.signInWithPassword({
      email: c[`account_${a}_email`],
      password: c[`account_${a}_password`],
    });
    assert.equal(error, null);
    tokens[a] = d.session.access_token;
  }
  const profiles = await Promise.all(["a", "b"].map((a) => data(a, "/me")));
  const image = fs.readFileSync(
    new URL("../apps/web/public/images/itens/cadeira.png", import.meta.url),
  );
  let first, second, body, own;
  await check("sessão obrigatória e limites declarados de upload", async () => {
    assert.equal(
      (await call(null, "/uploads", "POST", { type: "image/png", size: 100 }))
        .status,
      401,
    );
    for (const input of [
      { type: "image/svg+xml", size: 100 },
      { type: "image/png", size: 5242881 },
      { type: "image/png", size: -1 },
    ])
      assert.equal((await call("a", "/uploads", "POST", input)).status, 400);
  });
  await check(
    "assinatura real e decodificação recusam arquivo disfarçado",
    async () => {
      const signed = await data("a", "/uploads", "POST", {
        type: "image/jpeg",
        size: 32,
      });
      assert.ok(
        (
          await fetch(signed.url, {
            method: "PUT",
            headers: { "Content-Type": "image/jpeg" },
            body: Buffer.concat([
              Buffer.from([255, 216, 255]),
              Buffer.alloc(29),
            ]),
          })
        ).ok,
      );
      assert.equal(
        (await call("a", `/uploads/${signed.id}/complete`, "POST")).status,
        400,
      );
    },
  );
  await check(
    "dois uploads reais diretos, verificados, sem arquivos no corpo Next",
    async () => {
      first = await upload("a", image);
      second = await upload("a", image);
      assert.equal(
        (await call("b", `/uploads/${first}/complete`, "POST")).status,
        404,
      );
    },
  );
  await check(
    "publicação e repetição são idempotentes; galeria pública corresponde ao Storage privado",
    async () => {
      body = {
        creationKey: randomUUID(),
        title: "Cadeira fictícia — teste de integração",
        description:
          "Anúncio fictício criado para verificar publicação e edição compartilhadas.",
        category: "moveis",
        type: "VENDA",
        condition: "USADO_BOM_ESTADO",
        price: "79.90",
        location: "Bairro fictício, São Paulo, SP",
        photos: [{ uploadId: first }, { uploadId: second }],
      };
      const [item, repeated] = await Promise.all([
        data("a", "/items", "POST", body),
        data("a", "/items", "POST", body),
      ]);
      itemId = item.id;
      assert.equal(repeated.id, itemId);
      assert.equal(item.images.length, 2);
      for (const url of item.images) {
        const r = await fetch(base + url);
        assert.equal(r.status, 200);
        assert.deepEqual(Buffer.from(await r.arrayBuffer()), image);
      }
      assert.ok(
        (await data(null, "/items?q=Cadeira%20fict%C3%ADcia")).items.some(
          (i) => i.id === itemId,
        ),
      );
    },
  );
  await check(
    "conta B não consulta, edita, substitui ou associa fotos de A",
    async () => {
      assert.equal((await call("b", `/me/items?id=${itemId}`)).status, 404);
      const edit = { ...body, updatedAt: new Date().toISOString() };
      delete edit.creationKey;
      assert.equal(
        (await call("b", `/items/${itemId}`, "PATCH", edit)).status,
        404,
      );
      assert.equal(
        (
          await call("b", "/items", "POST", {
            ...body,
            creationKey: randomUUID(),
          })
        ).status,
        400,
      );
    },
  );
  await check(
    "edição persistida e repetição obsoleta recusada sem perda de fotos",
    async () => {
      own = await data("a", `/me/items?id=${itemId}`);
      const edit = {
        ...body,
        title: "Cadeira fictícia editada",
        updatedAt: own.updatedAt,
        photos: own.photos.map((p) => ({ imageId: p.id })),
      };
      delete edit.creationKey;
      const saved = await data("a", `/items/${itemId}`, "PATCH", edit);
      assert.equal(saved.title, edit.title);
      assert.equal(
        (await call("a", `/items/${itemId}`, "PATCH", edit)).status,
        409,
      );
      assert.equal((await data(null, `/items/${itemId}`)).title, edit.title);
    },
  );
  await check(
    "remoção de associação, pausa/reativação e imagens não públicas",
    async () => {
      own = await data("a", `/me/items?id=${itemId}`);
      const edit = {
        ...body,
        title: own.title,
        updatedAt: own.updatedAt,
        status: "INATIVO",
        photos: [{ imageId: own.photos[0].id }],
      };
      delete edit.creationKey;
      await data("a", `/items/${itemId}`, "PATCH", edit);
      assert.equal((await call(null, `/items/${itemId}`)).status, 404);
      assert.equal(
        (await fetch(base + `/api/v1/images/${first}`, { redirect: "manual" }))
          .status,
        404,
      );
      assert.equal(
        (await fetch(base + `/api/v1/images/${second}`, { redirect: "manual" }))
          .status,
        404,
      );
      own = await data("a", `/me/items?id=${itemId}`);
      await data("a", `/items/${itemId}`, "PATCH", {
        ...edit,
        status: "ATIVO",
        updatedAt: own.updatedAt,
      });
      assert.equal((await data(null, `/items/${itemId}`)).images.length, 1);
    },
  );
  await check(
    "fixtures anteriores, perfis e isolamento Auth preservados",
    async () => {
      for (let i = 1; i <= 15; i++) {
        const r = await call(
          null,
          `/items/lab15-item-${String(i).padStart(2, "0")}`,
        );
        assert.equal(r.status, i <= 12 ? 200 : 404);
      }
      for (let i = 0; i < 2; i++)
        assert.deepEqual(await data(["a", "b"][i], "/me"), profiles[i]);
    },
  );
  console.log(
    JSON.stringify(
      {
        passed: true,
        itemId,
        mode: "Auth, API, banco e Storage reais de laboratório; sem interface",
        checks,
      },
      null,
      2,
    ),
  );
} catch (e) {
  console.log(
    JSON.stringify(
      {
        passed: false,
        itemId,
        errorType: e.name,
        message:
          e.name === "AssertionError"
            ? e.message
            : "Falha sanitizada; consulte o contrato.",
        checks,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} finally {
  for (const [a] of Object.entries(tokens))
    try {
      await call(a, "/session/logout", "POST");
    } catch {}
  for (const client of clients) await client.auth.signOut({ scope: "local" });
}
