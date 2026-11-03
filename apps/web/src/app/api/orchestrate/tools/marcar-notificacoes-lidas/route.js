import { ASSISTANT_INTENTS } from "@/lib/assistant-intents.mjs";
import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";
import { marcarNotificacoesLidas } from "@/lib/orchestrate-actions";

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: marcarNotificacoesLidas,
        errorMessage: "Algo deu errado ao marcar as notificações.",
        intent: ASSISTANT_INTENTS.MARCAR_NOTIFICACOES_LIDAS,
        requiredScope: ASSISTANT_TOOL_SCOPES.MARCAR_NOTIFICACOES_LIDAS,
        responseKey: "mensagem",
        secretEnvName: "ORCHESTRATE_TOOLS_SECRET",
    });
}
