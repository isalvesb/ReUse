"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
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

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return { error: "E-mail ou senha inválidos." };
    }

    if (!user.passwordHash) {
        return { error: "Esta conta foi criada com Google/Facebook. Entre por um desses botões abaixo." };
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
        return { error: "E-mail ou senha inválidos." };
    }

    await createSession(user.id);

    redirect("/perfil");
}

export async function signOut() {
    await destroySession();
    redirect("/login");
}
