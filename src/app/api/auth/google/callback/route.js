import { redirect } from "next/navigation";
import { consumeOAuthState, findOrCreateOAuthUser, getAppUrl } from "@/lib/oauth";
import { createSession } from "@/lib/session";

function loginError(message) {
    return redirect(`/login?oauthError=${encodeURIComponent(message)}`);
}

export async function GET(request) {
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
    const redirectUri = `${getAppUrl()}/api/auth/google/callback`;

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

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
        console.error("[Google OAuth] Falha ao buscar perfil:", await profileResponse.text());
        loginError("Falha ao obter seus dados do Google.");
    }

    const profile = await profileResponse.json();

    const user = await findOrCreateOAuthUser({
        provider: "google",
        providerAccountId: profile.sub,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
    });

    await createSession(user.id);

    redirect("/perfil");
}
