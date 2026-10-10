import { NextResponse } from "next/server";
import { isToolAuthorized, reativarOfertas } from "@/lib/orchestrate-actions";

export async function POST(request) {
    if (!isToolAuthorized(request)) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json().catch(() => ({}));

    if (!userId) {
        return NextResponse.json({ mensagem: "Não consegui identificar o usuário." }, { status: 400 });
    }

    try {
        const mensagem = await reativarOfertas(userId);
        return NextResponse.json({ mensagem });
    } catch (error) {
        console.error("Erro ao reativar ofertas:", error);
        return NextResponse.json({ mensagem: "Algo deu errado ao reativar as ofertas." }, { status: 500 });
    }
}
