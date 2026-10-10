
import { prisma } from "@/lib/prisma";

export function isToolAuthorized(request) {
    const secret = request.headers.get("x-api-key");
    return Boolean(secret) && secret === process.env.ORCHESTRATE_TOOLS_SECRET;
}

export async function pausarOfertas(userId) {
    const result = await prisma.item.updateMany({
        where: { sellerId: userId, status: "ATIVO" },
        data: { status: "INATIVO" },
    });

    return result.count === 0
        ? "Você não tem nenhuma oferta ativa pra pausar."
        : `Pausei ${result.count} oferta(s) ativa(s). Elas saem da vitrine até você reativar.`;
}

export async function reativarOfertas(userId) {
    const result = await prisma.item.updateMany({
        where: { sellerId: userId, status: "INATIVO" },
        data: { status: "ATIVO" },
    });

    return result.count === 0
        ? "Você não tem oferta pausada pra reativar."
        : `Reativei ${result.count} oferta(s). Já estão de volta na vitrine.`;
}

export async function listarOfertas(userId) {
    const items = await prisma.item.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { title: true, status: true },
    });

    if (items.length === 0) {
        return "Você ainda não publicou nenhum item na ReUse.";
    }

    const lista = items.map((item) => `- ${item.title} (${item.status})`).join("\n");
    return `Seus itens mais recentes:\n${lista}`;
}

export async function marcarNotificacoesLidas(userId) {
    const result = await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });

    return result.count === 0
        ? "Você não tem notificações não lidas."
        : `Marquei ${result.count} notificação(ões) como lida(s).`;
}
