import { ASSISTANT_INTENTS } from "@/lib/assistant-intents.mjs";
import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";
import { reativarOfertas } from "@/lib/orchestrate-actions";

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: reativarOfertas,
        errorMessage: "Algo deu errado ao reativar as ofertas.",
        intent: ASSISTANT_INTENTS.RETOMAR,
        requiredScope: ASSISTANT_TOOL_SCOPES.REATIVAR_OFERTAS,
        responseKey: "mensagem",
        secretEnvName: "ORCHESTRATE_TOOLS_SECRET",
    });
}
