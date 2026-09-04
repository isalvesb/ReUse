"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function signUp(_prevState, formData) {
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    if (!name || !email || !password) {
        return { error: "Preencha todos os campos." };
    }

    if (password.length < 6) {
        return { error: "A senha deve ter no mínimo 6 caracteres." };
    }

    if (password !== confirmPassword) {
        return { error: "As senhas não coincidem." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return { error: "Já existe uma conta com este e-mail." };
    }

    const passwordHash = await hashPassword(password);

    let user;

    try {
        user = await prisma.user.create({
            data: { name, email, passwordHash },
        });
    } catch (error) {
        if (error.code === "P2002") {
            return { error: "Já existe uma conta com este e-mail." };
        }

        throw error;
    }

    await createSession(user.id);

    redirect("/perfil");
}
