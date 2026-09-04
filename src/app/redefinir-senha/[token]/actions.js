"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function resetPassword(_prevState, formData) {
    const token = formData.get("token")?.toString();
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    if (!token) {
        return { error: "Token inválido." };
    }

    if (password.length < 6) {
        return { error: "A senha deve ter no mínimo 6 caracteres." };
    }

    if (password !== confirmPassword) {
        return { error: "As senhas não coincidem." };
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
        return { error: "Link inválido ou expirado. Solicite um novo link." };
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
        prisma.user.update({
            where: { id: resetToken.userId },
            data: { passwordHash },
        }),
        prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { usedAt: new Date() },
        }),
    ]);

    redirect("/login?reset=success");
}
