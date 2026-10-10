import { NextResponse } from "next/server";
import { isToolAuthorized, listarOfertas } from "@/lib/orchestrate-actions";

export async function POST(request) {
    if (!isToolAuthorized(request)) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json().catch(() => ({}));

    if (!userId) {
        return NextResponse.json({ mensagem: "Não consegui identificar o usuário." }, { status: 400 });
    }

    try {
        const mensagem = await listarOfertas(userId);
        return NextResponse.json({ mensagem });
    } catch (error) {
        console.error("Erro ao listar ofertas:", error);
        return NextResponse.json({ mensagem: "Algo deu errado ao listar os itens." }, { status: 500 });
    }
}
