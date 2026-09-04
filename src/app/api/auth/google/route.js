import { createOAuthState, getAppUrl } from "@/lib/oauth";

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        return new Response(
            "Login com Google não configurado. Defina GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.",
            { status: 500 },
        );
    }

    const state = await createOAuthState();
    const redirectUri = `${getAppUrl()}/api/auth/google/callback`;

    const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "openid email profile");
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("prompt", "select_account");

    return Response.redirect(authorizeUrl.toString());
}
