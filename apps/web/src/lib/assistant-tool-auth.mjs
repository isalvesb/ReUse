import { SignJWT, jwtVerify } from "jose";

const ISSUER = "reuse-web";
const AUDIENCE = "assistant-tools";

export const ASSISTANT_TOOL_SCOPES = Object.freeze({
    LISTAR_OFERTAS: "listar-ofertas",
    PAUSAR_OFERTAS: "pausar-ofertas",
    REATIVAR_OFERTAS: "reativar-ofertas",
    MARCAR_NOTIFICACOES_LIDAS: "marcar-notificacoes-lidas",
});

const ALLOWED_SCOPES = new Set(Object.values(ASSISTANT_TOOL_SCOPES));

function getDelegationKey() {
    const secret = process.env.ASSISTANT_CONFIRMATION_SECRET
        || process.env.SESSION_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("Configure uma chave de delegação com pelo menos 32 caracteres.");
    }

    return new TextEncoder().encode(secret);
}

function normalizeScopes(scopes) {
    const normalized = Array.isArray(scopes) ? [...new Set(scopes)] : [];

    if (
        normalized.length === 0
        || normalized.some((scope) => !ALLOWED_SCOPES.has(scope))
    ) {
        throw new Error("Escopos de delegação inválidos.");
    }

    return normalized;
}

export async function createAssistantToolDelegationToken({
    userId,
    sessionVersion,
    scopes = Object.values(ASSISTANT_TOOL_SCOPES),
    expiresIn = "5m",
}) {
    if (!userId || !Number.isInteger(sessionVersion)) {
        throw new Error("Sessão inválida para delegação.");
    }

    return new SignJWT({
        sessionVersion,
        scopes: normalizeScopes(scopes),
    })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setSubject(userId)
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(getDelegationKey());
}

export async function verifyAssistantToolDelegationToken(token, requiredScope) {
    if (typeof token !== "string" || !ALLOWED_SCOPES.has(requiredScope)) {
        throw new Error("Delegação inválida.");
    }

    const { payload } = await jwtVerify(token, getDelegationKey(), {
        issuer: ISSUER,
        audience: AUDIENCE,
    });

    if (
        typeof payload.sub !== "string"
        || !Number.isInteger(payload.sessionVersion)
        || !Array.isArray(payload.scopes)
        || !payload.scopes.includes(requiredScope)
    ) {
        throw new Error("Delegação inválida ou sem permissão para esta ferramenta.");
    }

    return {
        userId: payload.sub,
        sessionVersion: payload.sessionVersion,
        scopes: payload.scopes,
    };
}

export function parseDelegatedToolBody(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new Error("Requisição inválida.");
    }

    if (Object.hasOwn(body, "userId")) {
        throw new Error("userId não é aceito pelas ferramentas delegadas.");
    }

    if (typeof body.delegationToken !== "string" || !body.delegationToken) {
        throw new Error("Delegação ausente.");
    }

    if (
        body.confirmationToken !== undefined
        && typeof body.confirmationToken !== "string"
    ) {
        throw new Error("Confirmação inválida.");
    }

    return {
        delegationToken: body.delegationToken,
        confirmationToken: body.confirmationToken || null,
    };
}
