import test from "node:test";
import assert from "node:assert/strict";
import {
  messageInput,
  chatQuery,
  requireConversation,
  sendChatMessage,
  markConversationRead,
  markNotificationRead,
  startConversation,
  listMessages,
} from "../src/lib/chat-domain.mjs";
const actor = { userId: "A" },
  key = "01234567-0123-4123-8123-012345678901";
test("mensagem rejeita autoria cliente, campos inesperados, controles e limites", () => {
  assert.deepEqual(messageInput({ content: " Olá ", clientKey: key }), {
    content: "Olá",
    clientKey: key,
  });
  for (const patch of [
    { senderId: "B" },
    { content: "" },
    { content: "x".repeat(1001) },
    { content: "a\u0000b" },
    { clientKey: "bad" },
  ])
    assert.throws(
      () => messageInput({ content: "Olá", clientKey: key, ...patch }),
      (e) => e.status === 400,
    );
});
test("paginação valida limite/cursor e ordena empates por id sem offset", async () => {
  assert.throws(() => chatQuery(new URLSearchParams("limit=51")));
  assert.throws(() => chatQuery(new URLSearchParams("cursor=garbage")));
  assert.throws(() => chatQuery(new URLSearchParams("limit=2&limit=3")));
  const at = "2026-11-04T00:00:00.000Z",
    cursor = Buffer.from(JSON.stringify({ at, id: "m2" })).toString(
      "base64url",
    );
  const q = chatQuery(new URLSearchParams({ limit: "1", cursor }));
  let options;
  const db = {
    conversation: {
      findFirst: async () => ({
        id: "c",
        buyerId: "A",
        sellerId: "B",
        buyer: {},
        seller: { name: "B" },
        item: { title: "fictício" },
        lastActivityAt: new Date(at),
      }),
    },
    message: {
      findMany: async (o) => {
        options = o;
        return [
          { id: "m1", content: "x", createdAt: new Date(at), senderId: "A" },
          { id: "m0", content: "y", createdAt: new Date(at), senderId: "B" },
        ];
      },
    },
  };
  const result = await listMessages(db, actor, "c", q);
  assert.equal(result.items[0].sender, "me");
  assert.ok(result.nextCursor);
  assert.deepEqual(options.orderBy, [{ createdAt: "desc" }, { id: "desc" }]);
  assert.deepEqual(options.where.OR[1], {
    createdAt: new Date(at),
    id: { lt: "m2" },
  });
});
test("conversa é autorizada por participantes antes de mensagens e envio", async () => {
  let where,
    accessed = false;
  const db = {
    conversation: {
      findFirst: async (o) => {
        where = o.where;
        return null;
      },
    },
    message: {
      findUnique: async () => {
        accessed = true;
      },
    },
  };
  await assert.rejects(
    sendChatMessage(db, actor, "c", { content: "x", clientKey: key }),
    (e) => e.status === 404,
  );
  assert.equal(accessed, false);
  assert.deepEqual(where, {
    id: "c",
    OR: [{ buyerId: "A" }, { sellerId: "A" }],
  });
  await assert.rejects(
    requireConversation(db, actor, "missing"),
    (e) => e.status === 404,
  );
});
test("reenvio confirma mesma mensagem sem nova transação e conflito gera 409", async () => {
  const db = {
    conversation: { findFirst: async () => ({}) },
    message: {
      findUnique: async () => ({
        id: "m",
        conversationId: "c",
        senderId: "A",
        content: "x",
        createdAt: new Date(),
      }),
    },
    $transaction: async () => {
      throw Error("Não deve criar");
    },
  };
  assert.equal(
    (await sendChatMessage(db, actor, "c", { content: "x", clientKey: key }))
      .id,
    "m",
  );
  await assert.rejects(
    sendChatMessage(db, actor, "c", { content: "outra", clientKey: key }),
    (e) => e.status === 409,
  );
});
test("envio vincula uma notificação genérica ao destinatário e respeita limite", async () => {
  let notification, update;
  const db = {
    conversation: {
      findFirst: async () => ({ buyerId: "A", sellerId: "B", itemId: "i" }),
    },
    message: { findUnique: async () => null },
    $transaction: async (f) =>
      f({
        message: {
          create: async ({ data }) => ({
            ...data,
            id: "m",
            createdAt: new Date(),
          }),
        },
        notification: {
          create: async ({ data }) => {
            notification = data;
          },
        },
        conversation: {
          updateMany: async ({ data }) => {
            update = data;
          },
        },
      }),
  };
  await assert.rejects(
    sendChatMessage(
      db,
      actor,
      "c",
      { content: "texto privado", clientKey: key },
      async () => ({ allowed: false }),
    ),
    (e) => e.status === 429,
  );
  const row = await sendChatMessage(db, actor, "c", {
    content: "texto privado",
    clientKey: key,
  });
  assert.equal(row.sender, "me");
  assert.equal(notification.userId, "B");
  assert.equal(notification.conversationId, "c");
  assert.equal(notification.messageId, "m");
  assert.ok(!notification.message.includes("texto privado"));
  assert.ok(update.lastActivityAt);
});
test("leitura só alcança mensagens vistas do destinatário autenticado", async () => {
  let where;
  const db = {
    conversation: { findFirst: async () => ({}) },
    message: { findFirst: async () => ({ id: "seen", createdAt: new Date() }) },
    notification: {
      updateMany: async (o) => {
        where = o.where;
        return { count: 1 };
      },
    },
  };
  await markConversationRead(db, actor, "c", { throughMessageId: "seen" });
  assert.equal(where.userId, "A");
  assert.equal(where.conversationId, "c");
  assert.equal(where.relatedMessage.OR[1].id.lte, "seen");
  db.notification.updateMany = async () => ({ count: 0 });
  await assert.rejects(
    markNotificationRead(db, actor, "foreign"),
    (e) => e.status === 404,
  );
});
test("iniciar conversa nunca recebe vendedor/participante e requer anúncio público alheio", async () => {
  let where;
  const db = {
    conversation: { findUnique: async () => null },
    item: {
      findFirst: async (o) => {
        where = o.where;
        return null;
      },
    },
  };
  await assert.rejects(
    startConversation(db, actor, { itemId: "i", sellerId: "B" }),
    (e) => e.status === 400,
  );
  await assert.rejects(
    startConversation(db, actor, { itemId: "i" }),
    (e) => e.status === 404,
  );
  assert.deepEqual(where, { id: "i", status: "ATIVO", NOT: { sellerId: "A" } });
});
test("criação concorrente recupera a conversa vencedora sem duplicar participantes", async () => {
  let reads = 0;
  const row = {
    id: "c",
    buyerId: "A",
    sellerId: "B",
    itemId: "i",
    seller: { id: "B", name: "B" },
    item: { title: "Fictício", status: "ATIVO" },
    lastActivityAt: new Date(),
  };
  const db = {
    conversation: {
      findUnique: async () => (++reads === 1 ? null : row),
      upsert: async () => {
        throw Object.assign(Error(), { code: "P2002" });
      },
    },
    item: { findFirst: async () => ({ id: "i", sellerId: "B" }) },
  };
  assert.equal((await startConversation(db, actor, { itemId: "i" })).id, "c");
  assert.equal(reads, 2);
});
