import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { findOrCreateOAuthUserWithDatabase } from "@/lib/oauth-user.mjs";
import { resolveCanonicalRequest } from "@/lib/app-url.mjs";

const STATE_COOKIE = "oauth_state";
const STATE_MAX_AGE_SECONDS = 10 * 60; // 10 minutos

export function resolveOAuthRequest(request, canonicalPath, options = {}) {
    return resolveCanonicalRequest({
        requestUrl: request.url,
        canonicalPath,
        ...options,
    });
}

export async function createOAuthState() {
    const state = randomBytes(24).toString("hex");
    const cookieStore = await cookies();

    cookieStore.set(STATE_COOKIE, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: STATE_MAX_AGE_SECONDS,
    });

    return state;
}

export async function consumeOAuthState(receivedState) {
    const cookieStore = await cookies();
    const savedState = cookieStore.get(STATE_COOKIE)?.value;

    cookieStore.delete(STATE_COOKIE);

    return Boolean(savedState) && savedState === receivedState;
}

/**
 * Encontra o usuário já ligado a essa conta social; se não existir, tenta
 * ligar por e-mail a uma conta já existente; caso contrário cria um usuário
 * novo (sem senha, já que o login é feito via provedor social).
 */
export async function findOrCreateOAuthUser({
    provider,
    providerAccountId,
    email,
    emailVerified = false,
    requireVerifiedEmail = false,
    name,
    avatarUrl,
}) {
    return findOrCreateOAuthUserWithDatabase(prisma, {
        provider,
        providerAccountId,
        email,
        emailVerified,
        requireVerifiedEmail,
        name,
        avatarUrl,
    });
}
