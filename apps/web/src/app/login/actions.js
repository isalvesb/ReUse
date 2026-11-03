"use server";

import { redirect } from "next/navigation";
import { authClient } from "@/lib/supabase-auth.mjs";
import { createSession, destroySession, } from "@/lib/session";
import {
    isValidEmail,
    normalizeEmail,
    FIELD_LIMITS,
} from "@/lib/validation.mjs";
import { consumeRateLimit } from "@/lib/rate-limit";


export async function signIn(_prevState, formData) {
    const email = normalizeEmail(formData.get("email")?.toString());
    const password = formData.get("password")?.toString() ?? "";

    if (
        !isValidEmail(email)
        || !password
        || password.length > FIELD_LIMITS.password
    ) {
        return { error: "Informe e-mail e senha." };
    }

    const rateLimit = await consumeRateLimit({
        scope: "login",
        identifier: email,
        limit: 5,
        windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return { error: "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente." };
    }

    const { data, error } = await authClient().auth.signInWithPassword({ email, password });
    if (error || !data.session) return { error: "E-mail ou senha inválidos, ou serviço indisponível." };
    try { await createSession(data.session); }
    catch { return { error: "Não foi possível iniciar a sessão. Tente novamente." }; }

    redirect("/perfil");
}

export async function signOut() {
    await destroySession();
    redirect("/login");
}
