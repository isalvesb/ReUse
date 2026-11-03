import { FIELD_LIMITS } from "./validation.mjs";

export class IntegrationError extends Error {
    constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

export const PROFILE_SELECT = Object.freeze({
    id: true, name: true, email: true, location: true, bio: true,
    avatarUrl: true, rating: true, createdAt: true, updatedAt: true,
});
export const DOMAIN_SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function profileDto(user) {
    return { id: user.id, name: user.name, email: user.email, location: user.location,
        bio: user.bio, avatarUrl: user.avatarUrl, rating: user.rating,
        createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() };
}

export function validateProfilePatch(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)
        || !Object.keys(input).length || Object.keys(input).some(key => !["name", "bio"].includes(key))) {
        throw new IntegrationError(400, "INVALID_PROFILE", "Envie somente nome e/ou biografia.");
    }
    const result = {};
    if (Object.hasOwn(input, "name")) {
        if (typeof input.name !== "string" || !input.name.trim() || input.name.trim().length > FIELD_LIMITS.name) {
            throw new IntegrationError(400, "INVALID_NAME", `Informe um nome de até ${FIELD_LIMITS.name} caracteres.`);
        }
        result.name = input.name.trim();
    }
    if (Object.hasOwn(input, "bio")) {
        if (input.bio !== null && (typeof input.bio !== "string" || input.bio.length > FIELD_LIMITS.bio)) {
            throw new IntegrationError(400, "INVALID_BIO", `A biografia aceita até ${FIELD_LIMITS.bio} caracteres.`);
        }
        result.bio = input.bio?.trim() || null;
    }
    return result;
}

export async function provisionActor(db, identity, now = new Date()) {
    if (!identity?.subject || !identity.sessionId || !identity.email) {
        throw new IntegrationError(401, "UNAUTHENTICATED", "Entre novamente.");
    }
    const user = await db.user.upsert({
        where: { authSubject: identity.subject }, update: {},
        create: { authSubject: identity.subject, email: identity.email.toLowerCase(),
            name: typeof identity.name === "string" && identity.name.trim()
                ? identity.name.trim().slice(0, FIELD_LIMITS.name) : "Conta de teste" },
        select: PROFILE_SELECT,
    });
    const session = await db.domainAuthSession.upsert({
        where: { id: identity.sessionId }, update: {},
        create: { id: identity.sessionId, userId: user.id, createdAt: now },
    });
    if (session.userId !== user.id || session.revokedAt || now - session.createdAt >= DOMAIN_SESSION_MAX_AGE_MS) {
        throw new IntegrationError(401, "SESSION_ENDED", "Sessão encerrada. Entre novamente.");
    }
    return { userId: user.id, subject: identity.subject, sessionId: identity.sessionId, profile: profileDto(user) };
}

export async function readOwnProfile(db, actor) {
    const user = await db.user.findUnique({ where: { id: actor.userId }, select: PROFILE_SELECT });
    if (!user) throw new IntegrationError(401, "UNAUTHENTICATED", "Entre novamente.");
    return profileDto(user);
}
export async function updateOwnProfile(db, actor, input) {
    const data = validateProfilePatch(input);
    return profileDto(await db.user.update({ where: { id: actor.userId }, data, select: PROFILE_SELECT }));
}
export async function revokeOwnSession(db, actor, now = new Date()) {
    await db.domainAuthSession.updateMany({ where: { id: actor.sessionId, userId: actor.userId, revokedAt: null }, data: { revokedAt: now } });
}
