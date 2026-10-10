import { redirect } from "next/navigation";
import { consumeOAuthState, findOrCreateOAuthUser, resolveOAuthRequest } from "@/lib/oauth";
import { createSession } from "@/lib/session";

const CALLBACK_PATH = "/api/auth/google/callback";

function loginError(message) {
    return redirect(`/login?oauthError=${encodeURIComponent(message)}`);
}

export async function GET(request) {
    let oauthRequest;

    try {
        oauthRequest = resolveOAuthRequest(request, CALLBACK_PATH, {
            preserveSearch: true,
        });
    } catch (error) {
        console.error("[Google OAuth] Origem inválida no callback:", error.message);
        return new Response("Origem pública do Google OAuth não configurada.", { status: 500 });
    }

    if (oauthRequest.redirectUrl) {
        return Response.redirect(oauthRequest.redirectUrl, 307);
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
        loginError("Login com Google cancelado.");
    }

    const stateValid = await consumeOAuthState(state);

    if (!code || !stateValid) {
        loginError("Não foi possível validar a resposta do Google. Tente novamente.");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${oauthRequest.appUrl}${CALLBACK_PATH}`;

    if (!clientId || !clientSecret) {
        loginError("Login com Google não configurado.");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }),
    });

    if (!tokenResponse.ok) {
        console.error("[Google OAuth] Falha ao trocar o code por token:", await tokenResponse.text());
        loginError("Falha ao autenticar com o Google.");
    }

    const tokens = await tokenResponse.json();

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
        console.error("[Google OAuth] Falha ao buscar perfil:", await profileResponse.text());
        loginError("Falha ao obter seus dados do Google.");
    }

    const profile = await profileResponse.json();

    let user;

    try {
        user = await findOrCreateOAuthUser({
            provider: "google",
            providerAccountId: profile.sub,
            email: profile.email,
            emailVerified: profile.email_verified === true,
            requireVerifiedEmail: true,
            name: profile.name,
            avatarUrl: profile.picture,
        });
    } catch (error) {
        console.error("[Google OAuth] Falha ao vincular conta:", error.message);
        loginError("Não foi possível vincular esta conta Google.");
    }

    await createSession(user.id);

    redirect("/perfil");
}
