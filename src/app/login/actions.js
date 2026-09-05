"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession, destroySession, } from "@/lib/session";


export async function signIn(_prevState, formData) {
    const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (!email || !password) {
        return { error: "Informe e-mail e senha." };
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
