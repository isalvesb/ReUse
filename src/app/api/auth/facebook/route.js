import { createOAuthState, getAppUrl } from "@/lib/oauth";

export async function GET() {
    const clientId = process.env.FACEBOOK_CLIENT_ID;

    if (!clientId) {
        return new Response(
            "Login com Facebook não configurado. Defina FACEBOOK_CLIENT_ID e FACEBOOK_CLIENT_SECRET no .env.",
            { status: 500 },
        );
    }

    const state = await createOAuthState();
    const redirectUri = `${getAppUrl()}/api/auth/facebook/callback`;

    const authorizeUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("scope", "email,public_profile");
    authorizeUrl.searchParams.set("state", state);

    return Response.redirect(authorizeUrl.toString());
}
