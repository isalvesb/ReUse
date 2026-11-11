import { IntegrationError } from "./profile-domain.mjs";
const fail = (status, code, message) => {
  throw new IntegrationError(status, code, message);
};
const member = (userId) => ({
  OR: [{ buyerId: userId }, { sellerId: userId }],
});
const person = { id: true, name: true, avatarUrl: true };
const includes = {
  buyer: { select: person },
  seller: { select: person },
  item: { select: { id: true, title: true, status: true } },
};
export function chatId(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(value))
    fail(400, "INVALID_ID", "Identificador inválido.");
  return value;
}
export function chatInput(input, keys) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.keys(input).some((k) => !keys.includes(k))
  )
    fail(400, "INVALID_INPUT", "Envie somente os campos permitidos.");
  return input;
}
export function messageInput(input) {
  chatInput(input, ["content", "clientKey"]);
  if (
    typeof input.content !== "string" ||
    !input.content.trim() ||
    input.content.trim().length > 1000 ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(input.content)
  )
    fail(
      400,
      "INVALID_MESSAGE",
      "A mensagem deve ter entre 1 e 1000 caracteres de texto.",
    );
  if (
    typeof input.clientKey !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      input.clientKey,
    )
  )
    fail(400, "INVALID_KEY", "Informe uma chave de envio válida.");
  return {
    content: input.content.trim(),
    clientKey: input.clientKey.toLowerCase(),
  };
}
export function chatQuery(params) {
  if (
    [...params.keys()].some((k) => !["cursor", "limit"].includes(k)) ||
    [...params.keys()].some((k) => params.getAll(k).length > 1)
  )
    fail(400, "INVALID_QUERY", "Consulta inválida.");
  const raw = params.get("limit") ?? "30";
  if (!/^\d{1,2}$/.test(raw) || +raw < 1 || +raw > 50)
    fail(400, "INVALID_QUERY", "O limite deve estar entre 1 e 50.");
  let cursor = null;
  if (params.has("cursor")) {
    try {
      if (params.get("cursor").length > 400) throw Error();
      cursor = JSON.parse(
        Buffer.from(params.get("cursor"), "base64url").toString(),
      );
      chatId(cursor.id);
      if (!cursor.at || new Date(cursor.at).toISOString() !== cursor.at)
        throw Error();
    } catch {
      fail(400, "INVALID_CURSOR", "Página inválida.");
    }
  }
  return { limit: +raw, cursor };
}
const encode = (row, field) =>
  Buffer.from(
    JSON.stringify({ id: row.id, at: row[field].toISOString() }),
  ).toString("base64url");
function boundary(cursor, field = "createdAt") {
  return cursor
    ? {
        OR: [
          { [field]: { lt: new Date(cursor.at) } },
          { [field]: new Date(cursor.at), id: { lt: cursor.id } },
        ],
      }
    : {};
}
export async function requireConversation(db, actor, id) {
  const row = await db.conversation.findFirst({
    where: { id: chatId(id), ...member(actor.userId) },
    include: includes,
  });
  if (!row) fail(404, "CONVERSATION_NOT_FOUND", "Conversa indisponível.");
  return row;
}
function conversationDto(row, actor, unreadCount = 0) {
  const other = row.buyerId === actor.userId ? row.seller : row.buyer;
  return {
    id: row.id,
    itemId: row.itemId,
    itemTitle: row.item.title,
    itemStatus: row.item.status,
    role: row.buyerId === actor.userId ? "interessado" : "anunciante",
    participant: { name: other.name, avatarUrl: other.avatarUrl, id: other.id },
    preview: row.messages?.[0]?.content ?? "",
    lastActivity: row.lastActivityAt.toISOString(),
    unreadCount,
  };
}
export async function listConversations(
  db,
  actor,
  { limit = 30, cursor = null } = {},
) {
  const rows = await db.conversation.findMany({
    where: { AND: [member(actor.userId), boundary(cursor, "lastActivityAt")] },
    include: {
      ...includes,
      messages: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 },
    },
    orderBy: [{ lastActivityAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });
  const page = rows.slice(0, limit);
  const counts = await db.notification.groupBy({
    by: ["conversationId"],
    where: {
      userId: actor.userId,
      read: false,
      conversationId: { in: page.map((r) => r.id) },
    },
    _count: { _all: true },
  });
  return {
    items: page.map((r) =>
      conversationDto(
        r,
        actor,
        counts.find((c) => c.conversationId === r.id)?._count._all ?? 0,
      ),
    ),
    nextCursor:
      rows.length > limit ? encode(page.at(-1), "lastActivityAt") : null,
  };
}
export async function getConversation(db, actor, id) {
  return conversationDto(await requireConversation(db, actor, id), actor);
}
export async function startConversation(
  db,
  actor,
  input,
  rateLimit = async () => ({ allowed: true }),
) {
  chatInput(input, ["itemId"]);
  const itemId = chatId(input.itemId);
  // Recover an existing conversation even if the item was later paused; new ones require public visibility.
  const existing = await db.conversation.findUnique({
    where: { itemId_buyerId: { itemId, buyerId: actor.userId } },
    include: includes,
  });
  if (existing) return conversationDto(existing, actor);
  const item = await db.item.findFirst({
    where: { id: itemId, status: "ATIVO", NOT: { sellerId: actor.userId } },
    select: { id: true, sellerId: true },
  });
  if (!item)
    fail(
      404,
      "ITEM_UNAVAILABLE",
      "Anúncio indisponível para iniciar conversa.",
    );
  if (
    !(
      await rateLimit({
        scope: "conversas",
        identifier: actor.userId,
        limit: 30,
        windowMs: 60000,
      })
    ).allowed
  )
    fail(
      429,
      "RATE_LIMIT",
      "Muitas conversas em pouco tempo. Aguarde um momento.",
    );
  let row;
  try {
    row = await db.conversation.upsert({
      where: { itemId_buyerId: { itemId, buyerId: actor.userId } },
      update: {},
      create: { itemId, buyerId: actor.userId, sellerId: item.sellerId },
      include: includes,
    });
  } catch (e) {
    if (e.code !== "P2002") throw e;
    row = await db.conversation.findUnique({
      where: { itemId_buyerId: { itemId, buyerId: actor.userId } },
      include: includes,
    });
    if (!row) throw e;
  }
  return conversationDto(row, actor);
}
const messageDto = (row, actor) => ({
  id: row.id,
  content: row.content,
  createdAt: row.createdAt.toISOString(),
  sender: row.senderId === actor.userId ? "me" : "other",
});
export async function listMessages(
  db,
  actor,
  id,
  { limit = 30, cursor = null } = {},
) {
  const conversation = await getConversation(db, actor, id);
  const rows = await db.message.findMany({
    where: { conversationId: id, ...boundary(cursor) },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });
  const page = rows.slice(0, limit);
  return {
    conversation,
    items: page.map((r) => messageDto(r, actor)).reverse(),
    nextCursor: rows.length > limit ? encode(page.at(-1), "createdAt") : null,
  };
}
async function replay(db, actor, id, input) {
  const row = await db.message.findUnique({
    where: {
      senderId_clientKey: {
        senderId: actor.userId,
        clientKey: input.clientKey,
      },
    },
  });
  if (!row) return null;
  if (row.conversationId !== id || row.content !== input.content)
    fail(
      409,
      "MESSAGE_KEY_CONFLICT",
      "A chave de envio já foi usada para outra mensagem.",
    );
  return messageDto(row, actor);
}
export async function sendChatMessage(
  db,
  actor,
  id,
  raw,
  rateLimit = async () => ({ allowed: true }),
) {
  const input = messageInput(raw),
    conversation = await requireConversation(db, actor, id);
  const previous = await replay(db, actor, id, input);
  if (previous) return previous;
  if (
    !(
      await rateLimit({
        scope: "mensagens",
        identifier: actor.userId,
        limit: 30,
        windowMs: 60000,
      })
    ).allowed
  )
    fail(
      429,
      "RATE_LIMIT",
      "Muitas mensagens em pouco tempo. Aguarde um momento.",
    );
  try {
    return await db.$transaction(async (tx) => {
      const row = await tx.message.create({
        data: { ...input, senderId: actor.userId, conversationId: id },
      });
      await tx.notification.create({
        data: {
          userId:
            conversation.buyerId === actor.userId
              ? conversation.sellerId
              : conversation.buyerId,
          itemId: conversation.itemId,
          conversationId: id,
          messageId: row.id,
          message: "Você recebeu uma nova mensagem sobre um item.",
        },
      });
      await tx.conversation.updateMany({
        where: { id, lastActivityAt: { lt: row.createdAt } },
        data: { lastActivityAt: row.createdAt },
      });
      return messageDto(row, actor);
    });
  } catch (e) {
    if (e.code === "P2002") {
      const previous = await replay(db, actor, id, input);
      if (previous) return previous;
    }
    throw e;
  }
}
export async function markConversationRead(db, actor, id, input) {
  chatInput(input, ["throughMessageId"]);
  await requireConversation(db, actor, id);
  const message = await db.message.findFirst({
    where: { id: chatId(input.throughMessageId), conversationId: id },
  });
  if (!message)
    fail(400, "INVALID_MESSAGE", "Mensagem indisponível nesta conversa.");
  const result = await db.notification.updateMany({
    where: {
      userId: actor.userId,
      conversationId: id,
      read: false,
      relatedMessage: {
        OR: [
          { createdAt: { lt: message.createdAt } },
          { createdAt: message.createdAt, id: { lte: message.id } },
        ],
      },
    },
    data: { read: true },
  });
  return { updated: result.count };
}
export async function listNotifications(
  db,
  actor,
  { limit = 30, cursor = null } = {},
) {
  const [rows, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: actor.userId, ...boundary(cursor) },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      select: {
        id: true,
        message: true,
        read: true,
        createdAt: true,
        itemId: true,
        conversationId: true,
      },
    }),
    db.notification.count({ where: { userId: actor.userId, read: false } }),
  ]);
  const page = rows.slice(0, limit);
  return {
    items: page.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() })),
    unreadCount,
    nextCursor: rows.length > limit ? encode(page.at(-1), "createdAt") : null,
  };
}
export async function markNotificationRead(db, actor, id) {
  const result = await db.notification.updateMany({
    where: { id: chatId(id), userId: actor.userId },
    data: { read: true },
  });
  if (!result.count)
    fail(404, "NOTIFICATION_NOT_FOUND", "Notificação indisponível.");
  return { read: true };
}
export async function markAllNotificationsRead(db, actor) {
  const result = await db.notification.updateMany({
    where: { userId: actor.userId, read: false },
    data: { read: true },
  });
  return { updated: result.count };
}
