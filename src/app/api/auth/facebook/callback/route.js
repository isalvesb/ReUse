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
        loginError("Login com Facebook cancelado.");
    }

    const stateValid = await consumeOAuthState(state);

    if (!code || !stateValid) {
        loginError("Não foi possível validar a resposta do Facebook. Tente novamente.");
    }

    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri = `${getAppUrl()}/api/auth/facebook/callback`;

    if (!clientId || !clientSecret) {
        loginError("Login com Facebook não configurado.");
    }

    const tokenUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenResponse = await fetch(tokenUrl.toString());

    if (!tokenResponse.ok) {
        console.error("[Facebook OAuth] Falha ao trocar o code por token:", await tokenResponse.text());
        loginError("Falha ao autenticar com o Facebook.");
    }

    const tokens = await tokenResponse.json();

    const profileUrl = new URL("https://graph.facebook.com/v21.0/me");
    profileUrl.searchParams.set("fields", "id,name,email,picture.type(large)");
    profileUrl.searchParams.set("access_token", tokens.access_token);

    const profileResponse = await fetch(profileUrl.toString());

    if (!profileResponse.ok) {
        console.error("[Facebook OAuth] Falha ao buscar perfil:", await profileResponse.text());
        loginError("Falha ao obter seus dados do Facebook.");
    }

    const profile = await profileResponse.json();

    if (!profile.email) {
        loginError("O Facebook não forneceu um e-mail para esta conta. Use outro método de login.");
    }

    let user;

    try {
        user = await findOrCreateOAuthUser({
            provider: "facebook",
            providerAccountId: profile.id,
            email: profile.email,
            emailVerified: false,
            name: profile.name,
            avatarUrl: profile.picture?.data?.url,
        });
    } catch (error) {
        console.error("[Facebook OAuth] Falha ao vincular conta:", error.message);
        loginError("Entre com sua senha antes de vincular o Facebook a uma conta existente.");
    }

    await createSession(user.id);

    redirect("/perfil");
}
