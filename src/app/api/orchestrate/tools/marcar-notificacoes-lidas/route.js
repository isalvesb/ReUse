import { NextResponse } from "next/server";
import { isToolAuthorized, marcarNotificacoesLidas } from "@/lib/orchestrate-actions";

export async function POST(request) {
    if (!isToolAuthorized(request)) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json().catch(() => ({}));

    if (!userId) {
        return NextResponse.json({ mensagem: "Não consegui identificar o usuário." }, { status: 400 });
    }

    try {
        const mensagem = await marcarNotificacoesLidas(userId);
        return NextResponse.json({ mensagem });
    } catch (error) {
        console.error("Erro ao marcar notificações como lidas:", error);
        return NextResponse.json({ mensagem: "Algo deu errado ao marcar as notificações." }, { status: 500 });
    }
}
