import { createOAuthState, resolveOAuthRequest } from "@/lib/oauth";

const CALLBACK_PATH = "/api/auth/facebook/callback";
const START_PATH = "/api/auth/facebook";

export async function GET(request) {
    const clientId = process.env.FACEBOOK_CLIENT_ID;

    if (!clientId) {
        return new Response(
            "Login com Facebook não configurado. Defina FACEBOOK_CLIENT_ID e FACEBOOK_CLIENT_SECRET no .env.",
            { status: 500 },
        );
    }

    let oauthRequest;

    try {
        oauthRequest = resolveOAuthRequest(request, START_PATH);
    } catch (error) {
        console.error("[Facebook OAuth] Origem inválida:", error.message);
        return new Response("Origem pública do Facebook OAuth não configurada.", { status: 500 });
    }

    if (oauthRequest.redirectUrl) {
        return Response.redirect(oauthRequest.redirectUrl, 307);
    }

    const state = await createOAuthState();
    const redirectUri = `${oauthRequest.appUrl}${CALLBACK_PATH}`;

    const authorizeUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "email,public_profile");
    authorizeUrl.searchParams.set("state", state);

    return Response.redirect(authorizeUrl.toString());
}
