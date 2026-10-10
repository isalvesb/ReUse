import { prisma } from "@/lib/prisma";
import { ASSISTANT_INTENTS } from "@/lib/assistant-intents.mjs";
import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: async (userId) => {
            const result = await prisma.item.updateMany({
            where: { sellerId: userId, status: "ATIVO" },
            data: { status: "INATIVO" },
            });

            return (
            result.count === 0
                ? "Você não tem ofertas ativas no momento."
                : result.count === 1
                    ? "Pausei 1 oferta sua."
                    : `Pausei ${result.count} ofertas suas.`
            );
        },
        errorMessage: "Não consegui concluir agora. Tente novamente em instantes.",
        intent: ASSISTANT_INTENTS.PAUSAR,
        requiredScope: ASSISTANT_TOOL_SCOPES.PAUSAR_OFERTAS,
        responseKey: "message",
        secretEnvName: "ASSISTANT_API_KEY",
    });
}
