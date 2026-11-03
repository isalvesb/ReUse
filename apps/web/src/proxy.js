import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, accessNeedsRefresh, clearAuthCookies, writeAuthCookies, refreshProviderSession } from "./lib/web-auth-cookies.mjs";
export async function proxy(request) {
    const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
    if (!refresh || !accessNeedsRefresh(request.cookies.get(ACCESS_COOKIE)?.value)) return NextResponse.next();
    try {
        const { data, error } = await refreshProviderSession(refresh);
        if (error || !data.session) {
            if (!error?.status || error.status >= 500) return NextResponse.next();
            clearAuthCookies(request.cookies);
            const response = NextResponse.next({ request: { headers: request.headers } });
            clearAuthCookies(response.cookies);
            response.headers.set("Cache-Control", "private, no-store");
            return response;
        }
        request.cookies.set(ACCESS_COOKIE, data.session.access_token);
        request.cookies.set(REFRESH_COOKIE, data.session.refresh_token);
        const response = NextResponse.next({ request: { headers: request.headers } });
        writeAuthCookies(response.cookies, data.session);
        response.headers.set("Cache-Control", "private, no-store");
        return response;
    } catch { return NextResponse.next(); }
}
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"] };
