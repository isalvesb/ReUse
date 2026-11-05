import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { DOMAIN_SESSION_MAX_AGE_MS, IntegrationError } from "./profile-domain.mjs";

const AUDIENCE = "reuse-assistant-selected-item";
const ISSUER = "reuse-lab";
const TRANSITIONS = {
  PAUSAR: { from: "ATIVO", to: "INATIVO" },
  RETOMAR: { from: "INATIVO", to: "ATIVO" },
};

function fail(status, code, message) {
  throw new IntegrationError(status, code, message);
}
function key(secret) {
  if (typeof secret !== "string" || secret.length < 32)
    throw new Error("Configure a chave privada de confirmação do assistente.");
  return new TextEncoder().encode(secret);
}
function transition(intent) {
  const value = Object.hasOwn(TRANSITIONS, intent) && TRANSITIONS[intent];
  if (!value) fail(400, "INVALID_ACTION", "Ação do assistente inválida.");
  return value;
}
function itemView(item) {
  return { id: item.id, title: item.title, status: item.status, updatedAt: item.updatedAt.toISOString() };
}

export function createAssistantItemDomain({ db, secret, clock = () => new Date() }) {
  async function sign(actor, claims, lifetime) {
    if (!actor?.userId || !actor.sessionId)
      fail(401, "UNAUTHENTICATED", "Entre novamente para continuar.");
    const now = Math.floor(clock().getTime() / 1000);
    return new SignJWT({ ...claims, sessionId: actor.sessionId })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(ISSUER).setAudience(AUDIENCE).setSubject(actor.userId)
      .setJti(randomUUID()).setIssuedAt(now).setExpirationTime(now + lifetime)
      .sign(key(secret));
  }
  async function verify(actor, token, kind) {
    try {
      if (typeof token !== "string" || token.length > 4096) throw new Error();
      const { payload } = await jwtVerify(token, key(secret), {
        algorithms: ["HS256"], issuer: ISSUER, audience: AUDIENCE, currentDate: clock(),
      });
      if (payload.sub !== actor?.userId || payload.sessionId !== actor?.sessionId ||
          payload.kind !== kind || typeof payload.jti !== "string" ||
          typeof payload.exp !== "number" || !Object.hasOwn(TRANSITIONS, payload.intent)) throw new Error();
      return payload;
    } catch {
      fail(409, "INVALID_CONFIRMATION", "Solicitação inválida ou expirada. Faça um novo pedido ao assistente.");
    }
  }
  async function assertSession(tx, actor) {
    const now = clock();
    const session = await tx.domainAuthSession.findFirst({ where: {
      id: actor.sessionId, userId: actor.userId, revokedAt: null,
      createdAt: { gt: new Date(now.getTime() - DOMAIN_SESSION_MAX_AGE_MS) },
    }, select: { id: true } });
    if (!session) fail(401, "UNAUTHENTICATED", "Entre novamente para continuar.");
  }

  // Called only by the server after a successful, validated IBM intent response.
  async function propose(actor, intent) {
    transition(intent);
    await assertSession(db, actor);
    const proposalToken = await sign(actor, { kind: "proposal", intent }, 300);
    return { intent, proposalToken, items: await eligible(actor, proposalToken) };
  }
  async function eligible(actor, proposalToken) {
    const claims = await verify(actor, proposalToken, "proposal");
    await assertSession(db, actor);
    const items = await db.item.findMany({ where: {
      sellerId: actor.userId, status: transition(claims.intent).from,
    }, select: { id: true, title: true, status: true, updatedAt: true },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }], take: 100 });
    return items.map(itemView);
  }
  async function prepare(actor, proposalToken, itemId) {
    const proposal = await verify(actor, proposalToken, "proposal");
    if (typeof itemId !== "string" || !itemId || itemId.length > 128)
      fail(400, "INVALID_ITEM", "Selecione um anúncio.");
    await assertSession(db, actor);
    const item = await db.item.findFirst({ where: { id: itemId, sellerId: actor.userId,
      status: transition(proposal.intent).from },
    select: { id: true, title: true, status: true, updatedAt: true } });
    if (!item) fail(404, "ITEM_NOT_FOUND", "Anúncio próprio elegível não encontrado.");
    const token = await sign(actor, { kind: "confirmation", intent: proposal.intent,
      itemId: item.id, version: item.updatedAt.toISOString() }, 300);
    const claims = await verify(actor, token, "confirmation");
    await db.assistantConfirmation.create({ data: {
      jti: claims.jti, userId: actor.userId, intent: claims.intent,
      expiresAt: new Date(claims.exp * 1000),
    } });
    return { confirmationToken: token, expiresAt: new Date(claims.exp * 1000).toISOString(),
      intent: claims.intent, item: itemView(item), targetStatus: transition(claims.intent).to };
  }
  async function decide(actor, token, decision) {
    if (!["confirm", "cancel"].includes(decision))
      fail(400, "INVALID_DECISION", "Confirme ou cancele a solicitação.");
    const claims = await verify(actor, token, "confirmation");
    if (typeof claims.itemId !== "string" || typeof claims.version !== "string" ||
        !Number.isFinite(Date.parse(claims.version)))
      fail(409, "INVALID_CONFIRMATION", "Confirmação inválida.");
    const change = transition(claims.intent);
    return db.$transaction(async (tx) => {
      await assertSession(tx, actor);
      const now = clock();
      const consumed = await tx.assistantConfirmation.updateMany({ where: {
        jti: claims.jti, userId: actor.userId, intent: claims.intent, usedAt: null,
        expiresAt: { gt: now },
      }, data: { usedAt: now } });
      if (consumed.count !== 1)
        fail(409, "CONFIRMATION_USED", "Solicitação já utilizada ou expirada. Recarregue seus anúncios antes de um novo pedido.");
      if (decision === "cancel") return { cancelled: true, itemId: claims.itemId };
      const updated = await tx.item.updateMany({ where: { id: claims.itemId,
        sellerId: actor.userId, status: change.from, updatedAt: new Date(claims.version) },
      data: { status: change.to, updatedAt: now } });
      if (updated.count !== 1)
        fail(409, "ITEM_CHANGED", "O anúncio mudou. Recarregue e faça uma nova confirmação.");
      const item = await tx.item.findFirst({ where: { id: claims.itemId, sellerId: actor.userId },
        select: { id: true, title: true, status: true, updatedAt: true } });
      return { cancelled: false, item: itemView(item) };
    });
  }
  return { propose, eligible, prepare, decide };
}
