import { prisma } from "@/lib/prisma";
import { createRateLimitKey } from "@/lib/rate-limit-key.mjs";

function getRateLimitSecret() {
    const secret = process.env.SESSION_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error("SESSION_SECRET deve ter pelo menos 32 caracteres.");
    }

    return secret;
}

export async function consumeRateLimit({ scope, identifier, limit, windowMs }) {
    if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(windowMs) || windowMs < 1000) {
        throw new Error("Configuração inválida de rate limit.");
    }

    const now = Date.now();
    const windowId = Math.floor(now / windowMs);
    const expiresAt = new Date((windowId + 1) * windowMs);
    const key = createRateLimitKey({
        scope,
        identifier,
        windowId,
        secret: getRateLimitSecret(),
    });

    const [, bucket] = await prisma.$transaction([
        prisma.rateLimitBucket.deleteMany({
            where: { expiresAt: { lt: new Date(now) } },
        }),
        prisma.rateLimitBucket.upsert({
            where: { key },
            create: { key, count: 1, expiresAt },
            update: { count: { increment: 1 } },
            select: { count: true, expiresAt: true },
        }),
    ]);

    return {
        allowed: bucket.count <= limit,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: Math.max(
            1,
            Math.ceil((bucket.expiresAt.getTime() - now) / 1000)
        ),
    };
}
