import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { sendOrchestrateMessage } from "@/lib/orchestrate";
import { createAssistantToolDelegationToken } from "@/lib/assistant-tool-auth.mjs";

export async function POST(request) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            { error: "Você precisa estar logado para falar com o assistente." },
            { status: 401 }
        );
    }

    const body = await request.json().catch(() => ({}));
    const text = body.text?.toString().trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!text) {
        return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
    }

    try {
        const delegationToken = await createAssistantToolDelegationToken({
            userId: user.id,
            sessionVersion: user.sessionVersion,
        });
        const reply = await sendOrchestrateMessage({
            history: [...history, { role: "user", content: text }],
            delegationToken,
        });

        return NextResponse.json({
            reply: reply || "Desculpe, não entendi. Pode reformular?",
        });
    } catch (error) {
        console.error("Erro ao conversar com o watsonx Orchestrate:", error);

        return NextResponse.json(
            { error: "O assistente virtual está indisponível no momento. Tente novamente mais tarde." },
            { status: 502 }
        );
    }
}
