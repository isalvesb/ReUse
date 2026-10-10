import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import {
    parseDelegatedToolBody,
    verifyAssistantToolDelegationToken,
} from "@/lib/assistant-tool-auth.mjs";

function secretsMatch(received, expected) {
    if (!received || !expected) return false;

    const receivedBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);

    return receivedBuffer.length === expectedBuffer.length
        && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function authorizeAssistantToolRequest(request, {
    secretEnvName,
    requiredScope,
}) {
    const providedSecret = request.headers.get("x-api-key");
    const configuredSecret = process.env[secretEnvName];

    if (!secretsMatch(providedSecret, configuredSecret)) {
        return { ok: false, status: 401, error: "Não autorizado." };
    }

    let body;

    try {
        body = parseDelegatedToolBody(await request.json());
    } catch (error) {
        return { ok: false, status: 400, error: error.message };
    }

    try {
        const delegation = await verifyAssistantToolDelegationToken(
            body.delegationToken,
            requiredScope
        );
        const user = await prisma.user.findUnique({
            where: { id: delegation.userId },
            select: { sessionVersion: true },
        });

        if (!user || user.sessionVersion !== delegation.sessionVersion) {
            return { ok: false, status: 401, error: "A sessão delegada não é mais válida." };
        }

        return {
            ok: true,
            userId: delegation.userId,
            confirmationToken: body.confirmationToken,
        };
    } catch {
        return { ok: false, status: 401, error: "Delegação inválida ou expirada." };
    }
}
