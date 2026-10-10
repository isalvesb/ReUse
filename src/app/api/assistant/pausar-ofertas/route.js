import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        const result = await prisma.item.updateMany({
            where: { sellerId: userId, status: "ATIVO" },
            data: { status: "INATIVO" },
        });

        const message =
            result.count === 0
                ? "Você não tem ofertas ativas no momento."
                : result.count === 1
                    ? "Pausei 1 oferta sua."
                    : `Pausei ${result.count} ofertas suas.`;

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Erro ao pausar ofertas:", error);
        return NextResponse.json(
            { message: "Não consegui concluir agora. Tente novamente em instantes." },
            { status: 500 }
        );
    }
}
