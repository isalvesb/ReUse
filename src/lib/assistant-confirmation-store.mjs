import { decodeJwt } from "jose";
import { prisma } from "@/lib/prisma";
import {
    createAssistantConfirmationToken,
    verifyAssistantConfirmationToken,
} from "@/lib/assistant-confirmation.mjs";

function getTokenClaims(token) {
    const claims = decodeJwt(token);

    if (
        typeof claims.jti !== "string"
        || typeof claims.exp !== "number"
    ) {
        throw new Error("Confirmação inválida.");
    }

    return claims;
}

export async function createPersistentAssistantConfirmationToken({ userId, intent }) {
    const token = await createAssistantConfirmationToken({ userId, intent });
    const claims = getTokenClaims(token);
    const now = new Date();

    await prisma.$transaction([
        prisma.assistantConfirmation.deleteMany({
            where: { expiresAt: { lt: now } },
        }),
        prisma.assistantConfirmation.create({
            data: {
                jti: claims.jti,
                intent,
                userId,
                expiresAt: new Date(claims.exp * 1000),
            },
        }),
    ]);

    return token;
}

export async function consumePersistentAssistantConfirmation(token, userId, expectedIntent = null) {
    const intent = await verifyAssistantConfirmationToken(token, userId, expectedIntent);
    const claims = getTokenClaims(token);
    const now = new Date();

    const result = await prisma.assistantConfirmation.updateMany({
        where: {
            jti: claims.jti,
            userId,
            intent,
            usedAt: null,
            expiresAt: { gt: now },
        },
        data: { usedAt: now },
    });

    if (result.count !== 1) {
        throw new Error("A confirmação já foi usada ou expirou.");
    }

    return intent;
}
