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
        const result = await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });

        const message =
            result.count === 0
                ? "Você não tem notificações não lidas."
                : result.count === 1
                    ? "Marquei 1 notificação como lida."
                    : `Marquei ${result.count} notificações como lidas.`;

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Erro ao marcar notificações como lidas:", error);
        return NextResponse.json(
            { message: "Não consegui concluir agora. Tente novamente em instantes." },
            { status: 500 }
        );
    }
}
