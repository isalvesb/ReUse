import { randomBytes } from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

export async function POST(request) {
    const { email } = await request.json();

    if (!email) {
        return Response.json({ error: "Informe um e-mail." }, { status: 400 });
    }

    const normalizedEmail = email.toString().trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    // Sempre responde com sucesso genérico, mesmo se o e-mail não existir,
    // para não revelar quais e-mails estão cadastrados na plataforma.
    if (!user) {
        return Response.json({ success: true });
    }

    const token = randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
        data: {
            token,
            userId: user.id,
            expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetLink = `${appUrl}/redefinir-senha/${token}`;

    if (process.env.NODE_ENV !== "production") {
        console.log("[Recuperar senha] Link de redefinição:", resetLink);
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn("[Recuperar senha] RESEND_API_KEY não configurada; e-mail não enviado.");
        return Response.json({ success: true });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [user.email],
            subject: "Redefina sua senha - ReUse!",
            html: `
                <p>Olá, ${user.name}!</p>
                <p>Recebemos uma solicitação para redefinir sua senha na ReUse!.</p>
                <p><a href="${resetLink}">Clique aqui para criar uma nova senha</a></p>
                <p>Este link expira em 1 hora. Se você não solicitou, ignore este e-mail.</p>
            `,
        });

        if (error) {
            console.error("[Resend API Error]:", error);
        }
    } catch (error) {
        console.error("[Server Error ao enviar e-mail]:", error);
    }

    return Response.json({ success: true });
}
