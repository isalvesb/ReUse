import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { actorForToken, endTokenSession } from "./authenticated-profile";
import { ACCESS_COOKIE, REFRESH_COOKIE, clearAuthCookies, writeAuthCookies, refreshProviderSession } from "./web-auth-cookies.mjs";
export async function createSession(session) {
    if (!session?.access_token || !session.refresh_token) throw new Error("Uma sessão Supabase válida é necessária.");
    await actorForToken(session.access_token);
    writeAuthCookies(await cookies(), session);
}
// React scopes this memoization to one server render, never to another request.
export const getSession = cache(async function getSession() {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (!token) return null;
    try { return { ...await actorForToken(token), sessionVersion: 0 }; }
    catch (error) { if (error.status === 401) return null; throw error; }
});
export async function destroySession() {
    const store = await cookies();
    let token = store.get(ACCESS_COOKIE)?.value;
    try {
        if (!token && store.get(REFRESH_COOKIE)?.value) {
            const { data } = await refreshProviderSession(store.get(REFRESH_COOKIE).value);
            token = data.session?.access_token;
        }
        if (token) {
            try { await endTokenSession(token, await actorForToken(token)); }
            catch (error) { if (error.status !== 401) throw error; }
        }
    } finally { clearAuthCookies(store); }
}
export async function getCurrentUserId() { return (await getSession())?.userId ?? null; }
