import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const STATE_COOKIE = "oauth_state";
const STATE_MAX_AGE_SECONDS = 10 * 60; // 10 minutos

export function getAppUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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
export async function findOrCreateOAuthUser({ provider, providerAccountId, email, name, avatarUrl }) {
    const existingAccount = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
    });

    if (existingAccount) {
        return existingAccount.user;
    }

    if (!email) {
        throw new Error(`Não foi possível obter o e-mail da conta ${provider}.`);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existingUser) {
        await prisma.account.create({
            data: { provider, providerAccountId, userId: existingUser.id },
        });

        return existingUser;
    }

    return prisma.user.create({
        data: {
            name: name || normalizedEmail,
            email: normalizedEmail,
            avatarUrl: avatarUrl || null,
            accounts: {
                create: { provider, providerAccountId },
            },
        },
    });
}
