import { decodeJwt } from "jose";
import { authClient } from "./supabase-auth.mjs";
export const ACCESS_COOKIE = "reuse_lab_access";
export const REFRESH_COOKIE = "reuse_lab_refresh";
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
export function writeAuthCookies(store, session) {
    store.set(ACCESS_COOKIE, session.access_token, { ...cookieOptions(), maxAge: Math.max(0, session.expires_at - Math.floor(Date.now() / 1000)) });
    store.set(REFRESH_COOKIE, session.refresh_token, { ...cookieOptions(), maxAge: 7 * 86400 });
    store.delete("reuse_session");
}
export function clearAuthCookies(store) {
    for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, "reuse_session"]) store.delete(name);
}
export function accessNeedsRefresh(token, now = Date.now()) {
    if (!token) return true;
    try { return typeof decodeJwt(token).exp !== "number" || decodeJwt(token).exp * 1000 <= now + 30000; }
    catch { return true; }
}
const refreshes = new Map();
export function refreshProviderSession(refreshToken) {
    if (!refreshes.has(refreshToken)) {
        const request = authClient().auth.refreshSession({ refresh_token: refreshToken });
        refreshes.set(refreshToken, request);
        const cleanUp = () => { const timer = setTimeout(() => refreshes.delete(refreshToken), 5000); timer.unref?.(); };
        request.then(cleanUp, cleanUp);
    }
    return refreshes.get(refreshToken);
}
