"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import {
    FIELD_LIMITS,
    isValidEmail,
    normalizeEmail,
    validatePassword,
} from "@/lib/validation.mjs";
import { consumeRateLimit } from "@/lib/rate-limit";

export async function signUp(_prevState, formData) {
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = normalizeEmail(formData.get("email")?.toString());
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    if (!name || !email || !password) {
        return { error: "Preencha todos os campos." };
    }

    if (name.length > FIELD_LIMITS.name) {
        return { error: `O nome pode ter no máximo ${FIELD_LIMITS.name} caracteres.` };
    }

    if (!isValidEmail(email)) {
        return { error: "Informe um e-mail válido." };
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
        return { error: passwordError };
    }

    if (password !== confirmPassword) {
        return { error: "As senhas não coincidem." };
    }

    const rateLimit = await consumeRateLimit({
        scope: "cadastro",
        identifier: email,
        limit: 3,
        windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return { error: "Muitas tentativas de cadastro. Tente novamente mais tarde." };
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
