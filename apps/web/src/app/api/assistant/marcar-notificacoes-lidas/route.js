import { prisma } from "@/lib/prisma";
import { ASSISTANT_INTENTS } from "@/lib/assistant-intents.mjs";
import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: async (userId) => {
            const result = await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
            });

            return (
            result.count === 0
                ? "Você não tem notificações não lidas."
                : result.count === 1
                    ? "Marquei 1 notificação como lida."
                    : `Marquei ${result.count} notificações como lidas.`
            );
        },
        errorMessage: "Não consegui concluir agora. Tente novamente em instantes.",
        intent: ASSISTANT_INTENTS.MARCAR_NOTIFICACOES_LIDAS,
        requiredScope: ASSISTANT_TOOL_SCOPES.MARCAR_NOTIFICACOES_LIDAS,
        responseKey: "message",
        secretEnvName: "ASSISTANT_API_KEY",
    });
}
