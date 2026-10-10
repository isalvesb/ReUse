import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";
import { listarOfertas } from "@/lib/orchestrate-actions";

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: listarOfertas,
        errorMessage: "Algo deu errado ao listar os itens.",
        requiredScope: ASSISTANT_TOOL_SCOPES.LISTAR_OFERTAS,
        responseKey: "mensagem",
        secretEnvName: "ORCHESTRATE_TOOLS_SECRET",
    });
}
