import { prisma } from "@/lib/prisma";
import { ASSISTANT_INTENTS } from "@/lib/assistant-intents.mjs";
import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: async (userId) => {
            const result = await prisma.item.updateMany({
            where: { sellerId: userId, status: "INATIVO" },
            data: { status: "ATIVO" },
            });

            return (
            result.count === 0
                ? "Você não tem ofertas pausadas no momento."
                : result.count === 1
                    ? "Reativei 1 oferta sua."
                    : `Reativei ${result.count} ofertas suas.`
            );
        },
        errorMessage: "Não consegui concluir agora. Tente novamente em instantes.",
        intent: ASSISTANT_INTENTS.RETOMAR,
        requiredScope: ASSISTANT_TOOL_SCOPES.REATIVAR_OFERTAS,
        responseKey: "message",
        secretEnvName: "ASSISTANT_API_KEY",
    });
}
