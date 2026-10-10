import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "reuse_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias
const SESSION_ISSUER = "reuse-web";
const SESSION_AUDIENCE = "reuse-session";

function getSecretKey() {
    const secret = process.env.SESSION_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("SESSION_SECRET deve ter pelo menos 32 caracteres.");
    }

    return new TextEncoder().encode(secret);
}

export async function createSession(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { sessionVersion: true },
    });

    if (!user) {
        throw new Error("Usuário da sessão não encontrado.");
    }

    const token = await new SignJWT({
        userId,
        sessionVersion: user.sessionVersion,
    })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuer(SESSION_ISSUER)
        .setAudience(SESSION_AUDIENCE)
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
        .sign(getSecretKey());

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_DURATION_SECONDS,
    });
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, getSecretKey(), {
            issuer: SESSION_ISSUER,
            audience: SESSION_AUDIENCE,
        });

        if (
            typeof payload.userId !== "string"
            || typeof payload.sessionVersion !== "number"
        ) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { sessionVersion: true },
        });

        if (!user || user.sessionVersion !== payload.sessionVersion) {
            return null;
        }

        return {
            userId: payload.userId,
            sessionVersion: payload.sessionVersion,
        };
    } catch {
        return null;
    }
}

export async function getCurrentUserId() {
    const session = await getSession();
    return session?.userId ?? null;
}
