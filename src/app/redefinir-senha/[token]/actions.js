"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { hashPasswordResetToken } from "@/lib/password-reset.mjs";
import { validatePassword } from "@/lib/validation.mjs";

export async function resetPassword(_prevState, formData) {
    const token = formData.get("token")?.toString();
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    if (!token) {
        return { error: "Token inválido." };
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
        return { error: passwordError };
    }

    if (password !== confirmPassword) {
        return { error: "As senhas não coincidem." };
    }

    const tokenHash = hashPasswordResetToken(token);
    const resetToken = tokenHash
        ? await prisma.passwordResetToken.findUnique({
            where: { token: tokenHash },
        })
        : null;

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
        return { error: "Link inválido ou expirado. Solicite um novo link." };
    }

    const passwordHash = await hashPassword(password);

    const now = new Date();

    const completed = await prisma.$transaction(async (transaction) => {
        const consumed = await transaction.passwordResetToken.updateMany({
            where: {
                id: resetToken.id,
                usedAt: null,
                expiresAt: { gt: now },
            },
            data: { usedAt: now },
        });

        if (consumed.count !== 1) {
            return false;
        }

        await transaction.user.update({
            where: { id: resetToken.userId },
            data: {
                passwordHash,
                sessionVersion: { increment: 1 },
            },
        });

        await transaction.passwordResetToken.updateMany({
            where: {
                userId: resetToken.userId,
                usedAt: null,
            },
            data: { usedAt: now },
        });

        return true;
    });

    if (!completed) {
        return { error: "Link inválido ou expirado. Solicite um novo link." };
    }

    redirect("/login?reset=success");
}
