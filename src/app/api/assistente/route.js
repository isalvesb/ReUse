import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import {
    ASSISTANT_INTENTS,
    detectLocalIntent,
} from "@/lib/assistant-intents.mjs";
import {
    isWatsonConfigured,
    sendMessageToWatson,
} from "@/lib/watson";
import {
    createPersistentAssistantConfirmationToken,
    consumePersistentAssistantConfirmation,
} from "@/lib/assistant-confirmation-store.mjs";
import { consumeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 500;

function invalidMessage(message) {
    return typeof message !== "string"
        || message.trim().length === 0
        || message.trim().length > MAX_MESSAGE_LENGTH;
}

async function classifyMessage(message) {
    if (!isWatsonConfigured()) {
        return {
            intent: detectLocalIntent(message),
            origin: "demonstracao",
            watsonText: null,
        };
    }

    const watson = await sendMessageToWatson(message);
    return {
        intent: watson.intent,
        origin: "watson",
        watsonText: watson.text,
    };
}

async function summarizeShowcase(userId) {
    const [active, paused, reserved, completed] = await Promise.all([
        prisma.item.count({ where: { sellerId: userId, status: "ATIVO" } }),
        prisma.item.count({ where: { sellerId: userId, status: "INATIVO" } }),
        prisma.item.count({ where: { sellerId: userId, status: "RESERVADO" } }),
        prisma.item.count({ where: { sellerId: userId, status: "CONCLUIDO" } }),
    ]);

    return {
        response: `Sua vitrine tem ${active} oferta(s) ativa(s), ${paused} pausada(s), ${reserved} reservada(s) e ${completed} concluída(s).`,
        summary: { active, paused, reserved, completed },
    };
}

async function runAllowedIntent({ intent, userId, confirmed, origin, watsonText }) {
    if (intent === ASSISTANT_INTENTS.PAUSAR && !confirmed) {
        return {
            response: "Quer mesmo pausar todas as suas ofertas ativas? Nenhuma oferta será alterada sem sua confirmação.",
            requiresConfirmation: true,
            intent,
            confirmationToken: await createPersistentAssistantConfirmationToken({ userId, intent }),
            origin,
        };
    }

    if (intent === ASSISTANT_INTENTS.RETOMAR && !confirmed) {
        return {
            response: "Quer mesmo retomar todas as suas ofertas pausadas? Nenhuma oferta será alterada sem sua confirmação.",
            requiresConfirmation: true,
            intent,
            confirmationToken: await createPersistentAssistantConfirmationToken({ userId, intent }),
            origin,
        };
    }

    if (intent === ASSISTANT_INTENTS.PAUSAR) {
        const result = await prisma.item.updateMany({
            where: { sellerId: userId, status: "ATIVO" },
            data: { status: "INATIVO" },
        });

        return {
            response: `Pronto: ${result.count} oferta(s) ativa(s) foram pausadas.`,
            action: "PAUSAR",
            updated: result.count,
            origin,
        };
    }

    if (intent === ASSISTANT_INTENTS.RETOMAR) {
        const result = await prisma.item.updateMany({
            where: { sellerId: userId, status: "INATIVO" },
            data: { status: "ATIVO" },
        });

        return {
            response: `Concluído: ${result.count} oferta(s) pausada(s) foram retomadas.`,
            action: "RETOMAR",
            updated: result.count,
            origin,
        };
    }

    if (intent === ASSISTANT_INTENTS.RESUMIR) {
        return {
            ...(await summarizeShowcase(userId)),
            origin,
        };
    }

    if (intent === ASSISTANT_INTENTS.ORIENTAR_PUBLICACAO) {
        return {
            response: "Para publicar: selecione “Publicar Novo Item”, adicione até cinco fotos, preencha título, categoria, condição, modalidade e uma descrição com pelo menos 20 caracteres. Depois, revise os dados e pressione “Publicar Item”.",
            origin,
        };
    }

    return {
        response: watsonText
            || "Posso resumir sua vitrine, explicar como publicar e, com sua confirmação, pausar ou retomar suas ofertas.",
        origin,
    };
}

export async function POST(request) {
    const userId = await getCurrentUserId();

    if (!userId) {
        return NextResponse.json(
            { error: "Faça login para usar o assistente." },
            { status: 401 }
        );
    }

    const rateLimit = await consumeRateLimit({
        scope: "assistente",
        identifier: userId,
        limit: 30,
        windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: "Muitas solicitações ao assistente. Aguarde um momento." },
            {
                status: 429,
                headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
            }
        );
    }

    const body = await request.json().catch(() => null);
    const confirmationToken = body?.confirmationToken;
    const message = body?.message;

    if (!confirmationToken && invalidMessage(message)) {
        return NextResponse.json(
            { error: `Envie uma mensagem entre 1 e ${MAX_MESSAGE_LENGTH} caracteres.` },
            { status: 400 }
        );
    }

    try {
        if (typeof confirmationToken === "string") {
            let intent;

            try {
                intent = await consumePersistentAssistantConfirmation(
                    confirmationToken,
                    userId
                );
            } catch {
                return NextResponse.json(
                    { error: "A confirmação expirou ou é inválida. Faça o pedido novamente." },
                    { status: 400 }
                );
            }

            return NextResponse.json(await runAllowedIntent({
                intent,
                userId,
                confirmed: true,
                origin: "confirmacao-assinada",
                watsonText: null,
            }));
        }

        const classification = await classifyMessage(message.trim());
        const result = await runAllowedIntent({
            ...classification,
            userId,
            confirmed: false,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Falha no assistente ReUse", error);
        return NextResponse.json(
            { error: "O assistente está temporariamente indisponível. Tente novamente." },
            { status: 503 }
        );
    }
}
