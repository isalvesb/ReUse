import {verifiedIdentity} from "../apps/web/src/lib/supabase-auth.mjs";
import fs from "node:fs";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { randomUUID, randomBytes } from "node:crypto";
const require = createRequire(
    new URL("../apps/web/package.json", import.meta.url),
  ),
  { createClient } = require("@supabase/supabase-js");
const c = JSON.parse(fs.readFileSync(process.env.REUSE_TEST_CREDENTIALS_FILE));
assert.equal(c.project_ref, "mqvlgrxwuirgjutqltpv");
process.env.SUPABASE_AUTH_URL=c.auth_url;process.env.SUPABASE_PUBLISHABLE_KEY=c.publishable_key;
const base = "http://127.0.0.1:4330",
  clients = [],
  tokens = {},
  checks = [];
let conversationId;
const extraFile = process.env.REUSE_CHAT_THIRD_ACCOUNT_FILE;
assert.ok(extraFile && !extraFile.includes("/reuse-lab/"));
async function call(a, path, method = "GET", body) {
  return fetch(base + "/api/v1" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(a ? { Authorization: `Bearer ${tokens[a]}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function data(a, path, method, body) {
  const r = await call(a, path, method, body);
  assert.equal(r.status, 200, `HTTP ${r.status}: ${path.split("?")[0]}`);
  return (await r.json()).data;
}
async function check(name, f) {
  await f();
  checks.push({ name, passed: true });
}
try {
  let third;
  if (fs.existsSync(extraFile)) third = JSON.parse(fs.readFileSync(extraFile));
  else {
    third = {
      email: `reuse-lab-chat-c-${randomUUID()}@example.com`,
      password: randomBytes(30).toString("base64url"),
    };
    const admin = createClient(c.auth_url, c.service_role_key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: d, error } = await admin.auth.admin.createUser({
      email: third.email,
      password: third.password,
      email_confirm: true,
      user_metadata: { name: "Conta C - isolamento do chat" },
    });
    assert.equal(error, null);
    third.id = d.user.id;
    fs.writeFileSync(extraFile, JSON.stringify(third), { mode: 0o600 });
  }
  for (const a of ["a", "b", "c"]) {
    const client = createClient(c.auth_url, c.publishable_key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    clients.push(client);
    const { data: d, error } = await client.auth.signInWithPassword({
      email: a === "c" ? third.email : c[`account_${a}_email`],
      password: a === "c" ? third.password : c[`account_${a}_password`],
    });
    assert.equal(error, null);
    tokens[a] = d.session.access_token;
  }
  const profiles = await Promise.all(["a", "b"].map((a) => data(a, "/me")));
  await data("c", "/me");
  // Select an existing fictitious fixture owned by B, without modifying item data.
  const catalogue = await data(null, "/items?pageSize=24");
  let item;
  for (const i of catalogue.items) {
    const detail = await data(null, `/items/${i.id}`);
    if (detail.seller.id === profiles[1].id && (!process.env.REUSE_CHAT_ITEM_ID || detail.id===process.env.REUSE_CHAT_ITEM_ID)) {
      item = detail;
      break;
    }
  }
  assert.ok(item, "Anúncio fictício de B necessário");
  await check(
    "identidade, entrada estrita e anúncio público alheio",
    async () => {
      assert.equal((await call(null, "/conversations")).status, 401);
      assert.equal(
        (
          await call("a", "/conversations", "POST", {
            itemId: item.id,
            buyerId: profiles[1].id,
          })
        ).status,
        400,
      );
      assert.equal(
        (await call("b", "/conversations", "POST", { itemId: item.id })).status,
        404,
      );
      assert.equal(
        (await call("a", "/conversations", "POST", { itemId: "lab15-item-13" }))
          .status,
        404,
      );
      const [one, two] = await Promise.all([
        data("a", "/conversations", "POST", { itemId: item.id }),
        data("a", "/conversations", "POST", { itemId: item.id }),
      ]);
      conversationId = one.id;
      assert.equal(two.id, one.id);
    },
  );
  let first;
  await check(
    "envio simultâneo idempotente, notificação única e conflito de chave",
    async () => {
      const input = {
        content: "Mensagem fictícia de A para B, teste HTTP Work 1.7.",
        clientKey: randomUUID(),
      };
      const [one, two] = await Promise.all([
        data("a", `/conversations/${conversationId}/messages`, "POST", input),
        data("a", `/conversations/${conversationId}/messages`, "POST", input),
      ]);
      first = one;
      assert.equal(one.id, two.id);
      assert.equal(
        (
          await call("a", `/conversations/${conversationId}/messages`, "POST", {
            ...input,
            content: "Outro conteúdo",
          })
        ).status,
        409,
      );
      const notices = await data("b", "/notifications");
      assert.equal(
        notices.items.filter(
          (n) => n.conversationId === conversationId && !n.read,
        ).length >= 1,
        true,
      );
      assert.ok(!notices.items[0].message.includes(input.content));
    },
  );
  await check(
    "resposta B aparece para A e consulta é paginada/estável sem duplicar",
    async () => {
      await data("b", `/conversations/${conversationId}/messages`, "POST", {
        content: "Resposta fictícia de B persistida no servidor.",
        clientKey: randomUUID(),
      });
      const page = await data(
        "a",
        `/conversations/${conversationId}/messages?limit=1`,
      );
      assert.equal(page.items.length, 1);
      assert.equal(page.items[0].sender, "other");
      assert.ok(page.nextCursor);
      const previous = await data(
        "a",
        `/conversations/${conversationId}/messages?limit=1&cursor=${page.nextCursor}`,
      );
      assert.equal(previous.items[0].id, first.id);
      assert.notEqual(page.items[0].id, previous.items[0].id);
      assert.ok(
        (await data("b", "/conversations")).items.some(
          (x) => x.id === conversationId,
        ),
      );
    },
  );
  await check(
    "terceira identidade não lê, envia, confirma leitura nem prepara envio alheio",
    async () => {
      assert.ok(
        !(await data("c", "/conversations")).items.some(
          (x) => x.id === conversationId,
        ),
      );
      for (const [path, method, body] of [
        [`/conversations/${conversationId}/messages`, "GET"],
        [
          `/conversations/${conversationId}/messages`,
          "POST",
          { content: "Não autorizado", clientKey: randomUUID() },
        ],
        [
          `/conversations/${conversationId}/read`,
          "POST",
          { throughMessageId: first.id },
        ],
        [`/conversations/${conversationId}/messages/key`, "POST"],
      ])
        assert.equal((await call("c", path, method, body)).status, 404);
      assert.equal(
        (
          await call("b", `/conversations/${conversationId}/messages`, "POST", {
            content: "falsa autoria",
            clientKey: randomUUID(),
            senderId: profiles[0].id,
          })
        ).status,
        400,
      );
    },
  );
  await check(
    "notificação exclusiva e leitura sincronizada sem marcar mensagem futura",
    async () => {
      const notice = (await data("b", "/notifications")).items.find(
        (n) => n.conversationId === conversationId && !n.read,
      );
      assert.ok(notice);
      assert.equal(
        (await call("a", `/notifications/${notice.id}/read`, "POST")).status,
        404,
      );
      assert.equal(
        (await call("c", `/notifications/${notice.id}/read`, "POST")).status,
        404,
      );
      await data("b", `/conversations/${conversationId}/read`, "POST", {
        throughMessageId: first.id,
      });
      assert.ok(
        (await data("b", "/notifications")).items.find(
          (n) => n.id === notice.id,
        ).read,
      );
      const after = await data(
        "a",
        `/conversations/${conversationId}/messages`,
        "POST",
        {
          content: "Mensagem fictícia posterior à leitura.",
          clientKey: randomUUID(),
        },
      );
      await data("b", `/conversations/${conversationId}/read`, "POST", {
        throughMessageId: first.id,
      });
      assert.ok(
        (await data("b", "/notifications")).items.some(
          (n) => n.conversationId === conversationId && !n.read,
        ),
      );
      await data("b", `/conversations/${conversationId}/read`, "POST", {
        throughMessageId: after.id,
      });
      assert.equal(
        (await data("b", "/conversations")).items.find(
          (x) => x.id === conversationId,
        ).unreadCount,
        0,
      );
    },
  );
  await check(
    "validação, limites e sessão encerrada recusam escrita",
    async () => {
      for (const content of ["", "x".repeat(1001), "a\u0000b"])
        assert.equal(
          (
            await call(
              "a",
              `/conversations/${conversationId}/messages`,
              "POST",
              { content, clientKey: randomUUID() },
            )
          ).status,
          400,
        );
      assert.equal(
        (
          await call(
            "a",
            `/conversations/${conversationId}/messages?cursor=bad`,
          )
        ).status,
        400,
      );
      assert.equal(
        (await call("a", "/notifications?userId=other")).status,
        400,
      );
      const claims=JSON.parse(Buffer.from(tokens.a.split('.')[1],'base64url'));
    await assert.rejects(verifiedIdentity(tokens.a,{now:new Date((claims.exp+1)*1000)}),e=>e.status===401);
    await data("c", "/session/logout", "POST");
      assert.equal(
        (
          await call("c", `/conversations/${conversationId}/messages`, "POST", {
            content: "Após logout",
            clientKey: randomUUID(),
          })
        ).status,
        401,
      );
    },
  );
  await check(
    "regressão de perfis, catálogo, registros de controle e imagens por leitura",
    async () => {
      for (let i = 0; i < 2; i++)
        assert.deepEqual(await data(["a", "b"][i], "/me"), profiles[i]);
      for (let i = 1; i <= 15; i++)
        assert.equal(
          (await call(null, `/items/lab15-item-${String(i).padStart(2, "0")}`))
            .status,
          i <= 12 ? 200 : 404,
        );
      const owned = await data("a", "/me/items");
      assert.ok(Array.isArray(owned.items) || Array.isArray(owned));
      const withImage = await data(null, "/items/cmw1sv9nj0009nyvh6jv794b7");
      assert.equal(withImage.images.length, 2);
      for (const image of withImage.images) {
        const r = await fetch(base + image);
        assert.equal(r.status, 200);
        assert.ok((await r.arrayBuffer()).byteLength > 0);
      }
    },
  );
  console.log(
    JSON.stringify(
      {
        passed: true,
        conversationId,
        itemId: item.id,
        thirdIdentityPurpose:
          "Exclusivamente isolamento de não participante, sem anúncios ou mensagens próprios.",
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
        conversationId,
        errorType: e.name,
        message: e.name === "AssertionError" ? e.message : "Falha sanitizada",
        checks,
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} finally {
  for (const a of ["a", "b", "c"])
    if (tokens[a])
      try {
        await call(a, "/session/logout", "POST");
      } catch {}
  for (const client of clients) await client.auth.signOut({ scope: "local" });
}
