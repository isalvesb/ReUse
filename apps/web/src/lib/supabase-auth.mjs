import { createClient } from "@supabase/supabase-js";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { authConfiguration } from "./lab-config.mjs";
import { IntegrationError } from "./profile-domain.mjs";

export function authClient() {
    const { url, key } = authConfiguration();
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000) }) },
    });
}
let remoteKeys;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function verifiedIdentity(token, options = {}) {
    if (typeof token !== "string" || !token || token.length > 12000) {
        throw new IntegrationError(401, "UNAUTHENTICATED", "Sessão inválida. Entre novamente.");
    }
    const { url } = authConfiguration();
    remoteKeys ??= createRemoteJWKSet(new URL(`${url}/auth/v1/.well-known/jwks.json`));
    try {
        const { payload } = await jwtVerify(token, options.keys ?? remoteKeys, {
            issuer: `${url}/auth/v1`, audience: "authenticated", algorithms: ["ES256", "RS256"],
            ...(options.now ? { currentDate: options.now } : {}),
        });
        if (!uuid.test(payload.sub ?? "") || !uuid.test(payload.session_id ?? "")
            || payload.role !== "authenticated" || payload.is_anonymous) throw new Error("Invalid claims");
        const { data, error } = await (options.client ?? authClient()).auth.getUser(token);
        if (error && (!error.status || error.status >= 500)) {
            throw new IntegrationError(503, "AUTH_UNAVAILABLE", "Autenticação temporariamente indisponível.");
        }
        const user = data?.user;
        if (error || user?.id !== payload.sub || !user.email || !user.email_confirmed_at) throw new Error("Invalid user");
        return { subject: payload.sub, sessionId: payload.session_id, email: user.email, name: user.user_metadata?.name };
    } catch (error) {
        if (error instanceof IntegrationError) throw error;
        if (["TimeoutError", "AbortError"].includes(error.name) || error.code === "ERR_JWKS_TIMEOUT" || error instanceof TypeError) {
            throw new IntegrationError(503, "AUTH_UNAVAILABLE", "Autenticação temporariamente indisponível.");
        }
        throw new IntegrationError(401, "UNAUTHENTICATED", "Sessão inválida ou expirada. Entre novamente.");
    }
}

export async function providerSignOut(token) {
    const { url, key } = authConfiguration();
    const response = await fetch(`${url}/auth/v1/logout?scope=local`, {
        method: "POST", headers: { apikey: key, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000),
    });
    return response.ok || response.status === 401;
}
