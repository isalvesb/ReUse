import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "reuse_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function getSecretKey() {
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
        throw new Error("SESSION_SECRET não configurada no .env");
    }

    return new TextEncoder().encode(secret);
}

export async function createSession(userId) {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
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
        const { payload } = await jwtVerify(token, getSecretKey());
        return { userId: payload.userId };
    } catch {
        return null;
    }
}

export async function getCurrentUserId() {
    const session = await getSession();
    return session?.userId ?? null;
}
