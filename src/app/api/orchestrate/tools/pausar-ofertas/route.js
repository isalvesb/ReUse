import { ASSISTANT_INTENTS } from "@/lib/assistant-intents.mjs";
import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";
import { pausarOfertas } from "@/lib/orchestrate-actions";

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: pausarOfertas,
        errorMessage: "Algo deu errado ao pausar as ofertas.",
        intent: ASSISTANT_INTENTS.PAUSAR,
        requiredScope: ASSISTANT_TOOL_SCOPES.PAUSAR_OFERTAS,
        responseKey: "mensagem",
        secretEnvName: "ORCHESTRATE_TOOLS_SECRET",
    });
}
