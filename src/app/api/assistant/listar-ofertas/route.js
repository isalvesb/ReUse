import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TYPE_LABELS = { VENDA: "Venda", TROCA: "Troca", DOACAO: "Doação" };
const STATUS_LABELS = { ATIVO: "Ativo", RESERVADO: "Reservado", CONCLUIDO: "Concluído", INATIVO: "Pausado" };

export async function POST(request) {
    const apiKey = request.headers.get("x-api-key");

    if (!process.env.ASSISTANT_API_KEY || apiKey !== process.env.ASSISTANT_API_KEY) {
        return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { userId } = body;

    if (typeof userId !== "string" || userId.trim() === "") {
        return NextResponse.json({ message: "Usuário não identificado." }, { status: 400 });
    }

    try {
        const items = await prisma.item.findMany({
            where: { sellerId: userId },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: { title: true, type: true, status: true, price: true },
        });

        if (items.length === 0) {
            return NextResponse.json({ message: "Você ainda não publicou nenhum item." });
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

        return NextResponse.json({ message: linhas.join("\n") });
    } catch (error) {
        console.error("Erro ao listar ofertas:", error);
        return NextResponse.json(
            { message: "Não consegui concluir agora. Tente novamente em instantes." },
            { status: 500 }
        );
    }
}
