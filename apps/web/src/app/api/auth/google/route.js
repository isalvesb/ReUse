import { createOAuthState, resolveOAuthRequest } from "@/lib/oauth";

const CALLBACK_PATH = "/api/auth/google/callback";
const START_PATH = "/api/auth/google";

export async function GET(request) {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        return new Response(
            "Login com Google não configurado. Defina GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.",
            { status: 500 },
        );
    }

    let oauthRequest;

    try {
        oauthRequest = resolveOAuthRequest(request, START_PATH);
    } catch (error) {
        console.error("[Google OAuth] Origem inválida:", error.message);
        return new Response("Origem pública do Google OAuth não configurada.", { status: 500 });
    }

    if (oauthRequest.redirectUrl) {
        return Response.redirect(oauthRequest.redirectUrl, 307);
    }

    const state = await createOAuthState();
    const redirectUri = `${oauthRequest.appUrl}${CALLBACK_PATH}`;

    const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "openid email profile");
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("prompt", "select_account");

    return Response.redirect(authorizeUrl.toString());
}
