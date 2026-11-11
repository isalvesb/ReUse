import test from "node:test";
import assert from "node:assert/strict";
import { createAssistantItemDomain } from "./src/lib/assistant-item-domain.mjs";

const A = { userId: "fictional-a", sessionId: "session-a" };
const B = { userId: "fictional-b", sessionId: "session-b" };
function fixture() {
  let now = new Date("2026-11-04T12:00:00Z");
  let state = {
    items: [
      { id: "a-active", title: "Livro fictício", sellerId: A.userId, status: "ATIVO", updatedAt: new Date(now) },
      { id: "a-paused", title: "Mesa fictícia", sellerId: A.userId, status: "INATIVO", updatedAt: new Date(now) },
      { id: "b-active", title: "Cadeira fictícia", sellerId: B.userId, status: "ATIVO", updatedAt: new Date(now) },
      { id: "a-reserved", title: "Controle reservado", sellerId: A.userId, status: "RESERVADO", updatedAt: new Date(now) },
    ],
    sessions: [A, B].map(a => ({ id: a.sessionId, userId: a.userId, revokedAt: null, createdAt: new Date(now) })),
    confirmations: [],
  };
  function matches(row, where) {
    return Object.entries(where).every(([k,v]) => {
      if (v instanceof Date) return row[k]?.getTime() === v.getTime();
      if (v && typeof v === "object") return v.gt ? row[k] > v.gt : false;
      return row[k] === v;
    });
  }
  const client = {
    item: {
      async findMany({ where, take }) { return structuredClone(state.items.filter(x => matches(x, where)).slice(0, take)); },
      async findFirst({ where }) { return structuredClone(state.items.find(x => matches(x, where)) || null); },
      async updateMany({ where, data }) {
        const rows = state.items.filter(x => matches(x, where));
        for (const row of rows) Object.assign(row, data);
        return { count: rows.length };
      },
    },
    domainAuthSession: { async findFirst({ where }) { return state.sessions.find(x => matches(x, where)) || null; } },
    assistantConfirmation: {
      async create({ data }) { state.confirmations.push({ ...data, usedAt: null }); },
      async updateMany({ where, data }) {
        const rows = state.confirmations.filter(x => matches(x, where));
        for (const row of rows) Object.assign(row, data);
        return { count: rows.length };
      },
    },
  };
  // Serialize isolated transactions and roll back their writes on error.
  let pending = Promise.resolve();
  client.$transaction = (fn) => {
    const next = pending.then(async () => {
      const before = structuredClone(state);
      try { return await fn(client); } catch (e) { state = before; throw e; }
    });
    pending = next.catch(() => {});
    return next;
  };
  const domain = createAssistantItemDomain({ db: client, secret: "test-only-assistant-secret-do-not-use-in-deployment", clock: () => now });
  return { domain, get state() { return state; }, advance(ms) { now = new Date(+now + ms); } };
}
async function preparation(f, intent = "PAUSAR", id = "a-active") {
  const p = await f.domain.propose(A, intent);
  return f.domain.prepare(A, p.proposalToken, id);
}
const rejectsCode = code => e => e.code === code;

test("IBM proposal lists only the actor's eligible listings without mutating them", async () => {
  const f = fixture(), before = structuredClone(f.state.items);
  const p = await f.domain.propose(A, "PAUSAR");
  assert.deepEqual(p.items.map(x => x.id), ["a-active"]);
  assert.deepEqual(f.state.items, before);
  await assert.rejects(f.domain.propose(A, "PAUSAR_TODOS"), rejectsCode("INVALID_ACTION"));
});
test("selection requires a server proof and rejects another account, session or listing", async () => {
  const f = fixture(), p = await f.domain.propose(A, "PAUSAR");
  await assert.rejects(f.domain.prepare(A, "client-invented-intent", "a-active"), rejectsCode("INVALID_CONFIRMATION"));
  await assert.rejects(f.domain.prepare(B, p.proposalToken, "b-active"), rejectsCode("INVALID_CONFIRMATION"));
  await assert.rejects(f.domain.prepare({ ...A, sessionId: "another-session" }, p.proposalToken, "a-active"), rejectsCode("INVALID_CONFIRMATION"));
  await assert.rejects(f.domain.prepare(A, p.proposalToken, "b-active"), rejectsCode("ITEM_NOT_FOUND"));
  await assert.rejects(f.domain.prepare(A, p.proposalToken, "a-reserved"), rejectsCode("ITEM_NOT_FOUND"));
});
test("explicit pause updates only the selected record and a new confirmation can reactivate it", async () => {
  const f = fixture(), c = await preparation(f), others = structuredClone(f.state.items.slice(1));
  assert.equal(c.item.title, "Livro fictício");
  assert.equal(c.targetStatus, "INATIVO");
  f.advance(1000);
  const result = await f.domain.decide(A, c.confirmationToken, "confirm");
  assert.equal(result.item.status, "INATIVO");
  assert.deepEqual(f.state.items.slice(1), others);
  const resume = await preparation(f, "RETOMAR", "a-active");
  assert.equal((await f.domain.decide(A, resume.confirmationToken, "confirm")).item.status, "ATIVO");
});
test("cancelling consumes the confirmation without changing a listing", async () => {
  const f = fixture(), c = await preparation(f), before = structuredClone(f.state.items);
  assert.equal((await f.domain.decide(A, c.confirmationToken, "cancel")).cancelled, true);
  assert.deepEqual(f.state.items, before);
  await assert.rejects(f.domain.decide(A, c.confirmationToken, "confirm"), rejectsCode("CONFIRMATION_USED"));
});
test("double submission commits only once", async () => {
  const f = fixture(), c = await preparation(f);
  const results = await Promise.allSettled([1,2].map(() => f.domain.decide(A, c.confirmationToken, "confirm")));
  assert.equal(results.filter(x => x.status === "fulfilled").length, 1);
  assert.equal(results.find(x => x.status === "rejected").reason.code, "CONFIRMATION_USED");
});
test("another account or session cannot consume an owner's confirmation", async () => {
  const f = fixture(), c = await preparation(f);
  for (const actor of [B, { ...A, sessionId: "another-session" }])
    await assert.rejects(f.domain.decide(actor, c.confirmationToken, "confirm"), rejectsCode("INVALID_CONFIRMATION"));
  assert.equal(f.state.confirmations[0].usedAt, null);
  assert.equal(f.state.items[0].status, "ATIVO");
});
test("expired and tampered confirmations cannot execute", async () => {
  const f = fixture(), c = await preparation(f);
  const parts = c.confirmationToken.split('.');
  parts[1] = Buffer.from(JSON.stringify({ sub: A.userId, intent: "RETOMAR" })).toString("base64url");
  await assert.rejects(f.domain.decide(A, parts.join('.'), "confirm"), rejectsCode("INVALID_CONFIRMATION"));
  f.advance(300_000);
  await assert.rejects(f.domain.decide(A, c.confirmationToken, "confirm"), rejectsCode("INVALID_CONFIRMATION"));
  assert.equal(f.state.items[0].status, "ATIVO");
});
test("logout after preparation blocks confirmation and leaves it unused", async () => {
  const f = fixture(), c = await preparation(f);
  f.state.sessions[0].revokedAt = new Date();
  await assert.rejects(f.domain.decide(A, c.confirmationToken, "confirm"), rejectsCode("UNAUTHENTICATED"));
  assert.equal(f.state.confirmations[0].usedAt, null);
});
test("concurrent edit or status transition rolls back consumption and never overwrites new data", async () => {
  for (const edit of [{ updatedAt: new Date("2026-11-04T12:01:00Z") }, { status: "RESERVADO" }, { sellerId: B.userId }]) {
    const f = fixture(), c = await preparation(f);
    Object.assign(f.state.items[0], edit);
    const before = structuredClone(f.state.items[0]);
    await assert.rejects(f.domain.decide(A, c.confirmationToken, "confirm"), rejectsCode("ITEM_CHANGED"));
    assert.deepEqual(f.state.items[0], before);
    assert.equal(f.state.confirmations[0].usedAt, null);
  }
});
test("mutation failure rolls back confirmation so a safe explicit retry remains possible", async () => {
  const f = fixture(), c = await preparation(f);
  await assert.rejects(f.domain.decide(A, c.confirmationToken, "yes"), rejectsCode("INVALID_DECISION"));
  assert.equal(f.state.confirmations[0].usedAt, null);
  const before = structuredClone(f.state.items[0]);
  f.state.items[0].updatedAt = new Date("2026-11-04T12:01:00Z");
  await assert.rejects(f.domain.decide(A, c.confirmationToken, "confirm"), rejectsCode("ITEM_CHANGED"));
  Object.assign(f.state.items[0], before);
  assert.equal((await f.domain.decide(A, c.confirmationToken, "confirm")).item.status, "INATIVO");
});
