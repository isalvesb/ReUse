import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, SignJWT } from "jose";
import { LAB_AUTH_URL, assertLabDatabaseUrl } from "../src/lib/lab-config.mjs";
import { verifiedIdentity } from "../src/lib/supabase-auth.mjs";
import { provisionActor, readOwnProfile, updateOwnProfile, revokeOwnSession, validateProfilePatch, DOMAIN_SESSION_MAX_AGE_MS } from "../src/lib/profile-domain.mjs";
import { accessNeedsRefresh, writeAuthCookies, clearAuthCookies } from "../src/lib/web-auth-cookies.mjs";
process.env.SUPABASE_AUTH_URL = LAB_AUTH_URL;
process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_unit_test";
const subjectA = "00000000-0000-4000-8000-000000000001";
const subjectB = "00000000-0000-4000-8000-000000000002";
const sessionA = "00000000-0000-4000-8000-000000000003";
const now = new Date("2026-11-03T12:00:00Z");
const pair = await generateKeyPair("ES256");
const identity = { subject: subjectA, sessionId: sessionA, email: "a@example.com", name: "Conta A" };
const client = { auth: { getUser: async () => ({ data: { user: { id: subjectA, email: identity.email, email_confirmed_at: now.toISOString() } } }) } };
async function token({ issuer = `${LAB_AUTH_URL}/auth/v1`, audience = "authenticated", subject = subjectA, expires = "2026-11-03T13:00:00Z", role = "authenticated", anonymous = false, session = sessionA, key = pair.privateKey } = {}) {
    return new SignJWT({ role, session_id: session, is_anonymous: anonymous }).setProtectedHeader({ alg: "ES256" })
        .setSubject(subject).setIssuer(issuer).setAudience(audience).setExpirationTime(new Date(expires)).sign(key);
}
function database() {
    const users = new Map(), sessions = new Map();
    let updates = 0;
    return { users, sessions, get updates() { return updates; },
        user: {
            upsert: async ({ where, create }) => {
                let user = [...users.values()].find(u => u.authSubject === where.authSubject);
                if (!user) { user = { id: `domain-${users.size + 1}`, ...create, location: null, bio: null, avatarUrl: null, rating: 0, createdAt: now, updatedAt: now, passwordHash: "must-never-leak" }; users.set(user.id, user); }
                return user;
            },
            findUnique: async ({ where }) => users.get(where.id),
            update: async ({ where, data }) => { updates++; const user = users.get(where.id); Object.assign(user, data); return user; },
        },
        domainAuthSession: {
            findUnique: async ({ where }) => sessions.get(where.id) ?? null,
            upsert: async ({ where, create }) => { if (!sessions.has(where.id)) sessions.set(where.id, { ...create, revokedAt: null }); return sessions.get(where.id); },
            updateMany: async ({ where, data }) => { const session = sessions.get(where.id); if (session?.userId === where.userId && !session.revokedAt) Object.assign(session, data); },
        },
    };
}
const rejects401 = promise => assert.rejects(promise, error => error.status === 401);
test("JWT assinado: identidade e sessão verificadas com issuer/audience do novo projeto", async () => {
    assert.deepEqual(await verifiedIdentity(await token(), { keys: pair.publicKey, client, now }), { ...identity, name: undefined });
});
test("recusa expiração, assinatura falsa, outro issuer/audience, anônimo, função privilegiada e identidade divergente", async () => {
    const other = await generateKeyPair("ES256");
    for (const change of [{ expires: "2026-11-03T11:59:59Z" }, { key: other.privateKey }, { issuer: "https://old.example.com/auth/v1" }, { audience: "other" }, { role: "service_role" }, { anonymous: true }, { session: "bypass" }, { subject: subjectB }]) {
        await rejects401(verifiedIdentity(await token(change), { keys: pair.publicKey, client, now }));
    }
    await rejects401(verifiedIdentity("email-or-demo-bypass", { keys: pair.publicKey, client, now }));
});
test("indisponibilidade do provedor não é confundida com credenciais inválidas", async () => {
    await assert.rejects(verifiedIdentity(await token(), { keys: pair.publicKey, now, client: { auth: { getUser: async () => ({ error: { status: 503 } }) } } }), e => e.status === 503);
});
test("provisionamento é idempotente e usa o subject, sem substituir o perfil por metadata do cliente", async () => {
    const db = database(); const actor = await provisionActor(db, identity, now);
    await updateOwnProfile(db, actor, { name: "Nome persistido" });
    const again = await provisionActor(db, { ...identity, name: "Metadata diferente" }, now);
    assert.equal(again.userId, actor.userId); assert.equal(again.profile.name, "Nome persistido");
    assert.equal(db.users.size, 1); assert.equal(db.sessions.size, 1);
});
test("requisições iniciais concorrentes reutilizam a sessão vencedora sem duplicar", async () => {
    const db = database();
    db.domainAuthSession.upsert = async ({ where, create }) => {
        await Promise.resolve();
        if (db.sessions.has(where.id)) throw Object.assign(new Error("duplicate"), { code: "P2002" });
        const session = { ...create, revokedAt: null };
        db.sessions.set(where.id, session);
        return session;
    };
    const actors = await Promise.all(Array.from({ length: 8 }, () => provisionActor(db, identity, now)));
    assert.equal(db.sessions.size, 1);
    assert.ok(actors.every(actor => actor.sessionId === sessionA && actor.userId === actors[0].userId));
    assert.equal(db.sessions.get(sessionA).createdAt, now);
});
test("conflito de criação não reativa sessão revogada, expirada ou pertencente a terceiro", async () => {
    for (const patch of [{ revokedAt: now }, { createdAt: new Date(+now - DOMAIN_SESSION_MAX_AGE_MS) }, { userId: "other-user" }]) {
        const db = database();
        await provisionActor(db, identity, now);
        Object.assign(db.sessions.get(sessionA), patch);
        const before = { ...db.sessions.get(sessionA) };
        db.domainAuthSession.upsert = async () => { throw Object.assign(new Error("duplicate"), { code: "P2002" }); };
        await rejects401(provisionActor(db, identity, now));
        assert.deepEqual(db.sessions.get(sessionA), before);
    }
});
test("erros diferentes de conflito e conflito sem registro vencedor continuam sendo falhas", async () => {
    for (const code of ["P2002", "P1001"]) {
        const db = database();
        const failure = Object.assign(new Error("isolated failure"), { code });
        let reads = 0;
        db.domainAuthSession.upsert = async () => { throw failure; };
        db.domainAuthSession.findUnique = async () => { reads++; return null; };
        await assert.rejects(provisionActor(db, identity, now), error => error === failure);
        assert.equal(reads, code === "P2002" ? 1 : 0);
    }
});
test("B altera apenas B; tentativa de enviar identificador/email de A é recusada antes da escrita", async () => {
    const db = database(); const a = await provisionActor(db, identity, now);
    const b = await provisionActor(db, { ...identity, subject: subjectB, sessionId: subjectB, email: "b@example.com" }, now);
    await updateOwnProfile(db, a, { name: "Somente A", bio: "Privado A" });
    await updateOwnProfile(db, b, { name: "Somente B" });
    for (const bad of [{ id: a.userId, name: "Ataque" }, { userId: a.userId }, { email: identity.email }, { avatarUrl: "file:///private" }, { authSubject: subjectA }]) {
        await assert.rejects(updateOwnProfile(db, b, bad), e => e.status === 400);
    }
    assert.equal((await readOwnProfile(db, a)).name, "Somente A");
    assert.equal((await readOwnProfile(db, b)).name, "Somente B"); assert.equal(db.updates, 2);
});
test("contrato valida limites e remove campos internos da resposta", async () => {
    for (const bad of [null, [], {}, { name: " " }, { name: "x".repeat(101) }, { bio: "x".repeat(1001) }, { bio: 0 }]) assert.throws(() => validateProfilePatch(bad), e => e.status === 400);
    assert.deepEqual(validateProfilePatch({ name: " Nome ", bio: " " }), { name: "Nome", bio: null });
    const db = database(), actor = await provisionActor(db, identity, now);
    assert.deepEqual(Object.keys(await readOwnProfile(db, actor)).sort(), ["id", "name", "email", "bio", "location", "avatarUrl", "rating", "createdAt", "updatedAt"].sort());
});
test("logout revoga a sessão do domínio; replay/refresh não reativam, outras sessões continuam", async () => {
    const db = database(), actor = await provisionActor(db, identity, now);
    const second = { ...identity, sessionId: subjectB };
    await provisionActor(db, second, now);
    await revokeOwnSession(db, actor, now);
    await rejects401(provisionActor(db, identity, now));
    assert.equal((await provisionActor(db, second, now)).userId, actor.userId);
});
test("sessão do domínio expira em sete dias mesmo com JWT renovado", async () => {
    const db = database(); await provisionActor(db, identity, now);
    await rejects401(provisionActor(db, identity, new Date(+now + DOMAIN_SESSION_MAX_AGE_MS)));
});
test("cookies são HttpOnly/SameSite, renovação consulta apenas expiração e logout limpa os dois tokens", async () => {
    const values = new Map(), removed = [];
    const store = { set: (name, value, options) => values.set(name, { value, options }), delete: name => removed.push(name) };
    writeAuthCookies(store, { access_token: "private", refresh_token: "private", expires_at: Date.now() / 1000 + 300 });
    for (const item of values.values()) { assert.equal(item.options.httpOnly, true); assert.equal(item.options.sameSite, "lax"); }
    assert.equal(accessNeedsRefresh(null), true);
    assert.equal(accessNeedsRefresh(await token(), +now), false);
    assert.equal(accessNeedsRefresh(await token({ expires: "2026-11-03T12:00:01Z" }), +now), true);
    clearAuthCookies(store); assert.ok(removed.includes("reuse_lab_access")); assert.ok(removed.includes("reuse_lab_refresh"));
});
test("guarda de destino recusa banco histórico/local antes de qualquer conexão", () => {
    for (const url of [undefined, "postgresql://user:secret@old.example.com/postgres", "postgresql://user:secret@127.0.0.1/postgres", "postgresql://postgres.other@aws-0-us-east-1.pooler.supabase.com/postgres"]) assert.throws(() => assertLabDatabaseUrl(url));
    assert.ok(assertLabDatabaseUrl("postgresql://reuse_lab_runtime.mqvlgrxwuirgjutqltpv:example@aws-0-us-east-1.pooler.supabase.com/postgres"));
});
