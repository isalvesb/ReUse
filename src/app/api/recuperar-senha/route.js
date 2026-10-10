import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
    createPasswordResetToken,
    escapeHtml,
    PASSWORD_RESET_TTL_MS,
} from "@/lib/password-reset.mjs";
import { isValidEmail, normalizeEmail } from "@/lib/validation.mjs";
import { consumeRateLimit } from "@/lib/rate-limit";
import { resolveAppUrl } from "@/lib/app-url.mjs";

export async function POST(request) {
    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email);

    if (!isValidEmail(email)) {
        return Response.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const rateLimit = await consumeRateLimit({
        scope: "recuperar-senha",
        identifier: email,
        limit: 3,
        windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return Response.json(
            { error: "Muitas solicitações. Tente novamente mais tarde." },
            {
                status: 429,
                headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
            }
        );
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

    const { rawToken, tokenHash } = createPasswordResetToken();
    const now = new Date();

    await prisma.$transaction([
        prisma.passwordResetToken.updateMany({
            where: { userId: user.id, usedAt: null },
            data: { usedAt: now },
        }),
        prisma.passwordResetToken.create({
            data: {
                token: tokenHash,
                userId: user.id,
                expiresAt: new Date(now.getTime() + PASSWORD_RESET_TTL_MS),
            },
        }),
    ]);

    const appUrl = resolveAppUrl({ requestUrl: request.url });
    const resetLink = `${appUrl}/redefinir-senha/${rawToken}`;

    if (process.env.NODE_ENV !== "production") {
        console.log("[Recuperar senha] Link de redefinição:", resetLink);
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn("[Recuperar senha] RESEND_API_KEY não configurada; e-mail não enviado.");
        return Response.json({ success: true });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()
            || "ReUse <onboarding@resend.dev>";

        const { error } = await resend.emails.send({
            from: fromEmail,
            to: [user.email],
            subject: "Redefina sua senha - ReUse!",
            html: `
                <p>Olá, ${escapeHtml(user.name)}!</p>
                <p>Recebemos uma solicitação para redefinir sua senha na ReUse!.</p>
                <p><a href="${escapeHtml(resetLink)}">Clique aqui para criar uma nova senha</a></p>
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
