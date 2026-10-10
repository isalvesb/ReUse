import { prisma } from "@/lib/prisma";
import { ASSISTANT_TOOL_SCOPES } from "@/lib/assistant-tool-auth.mjs";
import { handleAssistantToolRequest } from "@/lib/assistant-tool-handler";

const TYPE_LABELS = { VENDA: "Venda", TROCA: "Troca", DOACAO: "Doação" };
const STATUS_LABELS = { ATIVO: "Ativo", RESERVADO: "Reservado", CONCLUIDO: "Concluído", INATIVO: "Pausado" };

export async function POST(request) {
    return handleAssistantToolRequest(request, {
        action: async (userId) => {
            const items = await prisma.item.findMany({
            where: { sellerId: userId },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: { title: true, type: true, status: true, price: true },
            });

            if (items.length === 0) {
                return "Você ainda não publicou nenhum item.";
            }

            const linhas = items.map((item) => {
                const tipo = TYPE_LABELS[item.type] ?? item.type;
                const status = STATUS_LABELS[item.status] ?? item.status;
                const preco =
                    item.price != null
                        ? ` — R$ ${Number(item.price).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`
                        : "";

                return `• ${item.title} — ${tipo}${preco} — ${status}`;
            });

            return linhas.join("\n");
        },
        errorMessage: "Não consegui concluir agora. Tente novamente em instantes.",
        requiredScope: ASSISTANT_TOOL_SCOPES.LISTAR_OFERTAS,
        responseKey: "message",
        secretEnvName: "ASSISTANT_API_KEY",
    });
}
