import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { ASSISTANT_INTENTS } from "./assistant-intents.mjs";

const ISSUER = "reuse-web";
const AUDIENCE = "assistant-confirmation";
const MUTATING_INTENTS = new Set([
    ASSISTANT_INTENTS.PAUSAR,
    ASSISTANT_INTENTS.RETOMAR,
]);

function getConfirmationKey() {
    const secret = process.env.ASSISTANT_CONFIRMATION_SECRET
        || process.env.SESSION_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("Configure uma chave de confirmação com pelo menos 32 caracteres.");
    }

    return new TextEncoder().encode(secret);
}

export async function createAssistantConfirmationToken({ userId, intent }) {
    if (!userId || !MUTATING_INTENTS.has(intent)) {
        throw new Error("Confirmação inválida.");
    }

    return new SignJWT({ intent })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setSubject(userId)
        .setJti(randomUUID())
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(getConfirmationKey());
}

export async function verifyAssistantConfirmationToken(token, userId) {
    const { payload } = await jwtVerify(token, getConfirmationKey(), {
        issuer: ISSUER,
        audience: AUDIENCE,
    });

    if (payload.sub !== userId || !MUTATING_INTENTS.has(payload.intent)) {
        throw new Error("Confirmação inválida ou pertencente a outro usuário.");
    }

    return payload.intent;
}
