import { NextResponse } from "next/server";
import { authorizeAssistantToolRequest } from "@/lib/assistant-tool-request";
import { prepareOrConfirmAssistantMutation } from "@/lib/assistant-tool-confirmation.mjs";
import {
    createPersistentAssistantConfirmationToken,
    consumePersistentAssistantConfirmation,
} from "@/lib/assistant-confirmation-store.mjs";

const CONFIRMATION_MESSAGES = Object.freeze({
    PAUSAR: "Confirme para pausar todas as suas ofertas ativas.",
    RETOMAR: "Confirme para reativar todas as suas ofertas pausadas.",
    MARCAR_NOTIFICACOES_LIDAS: "Confirme para marcar suas notificações como lidas.",
});

export async function handleAssistantToolRequest(request, {
    action,
    errorMessage,
    intent = null,
    requiredScope,
    responseKey,
    secretEnvName,
}) {
    const authorization = await authorizeAssistantToolRequest(request, {
        secretEnvName,
        requiredScope,
    });

    if (!authorization.ok) {
        return NextResponse.json(
            { [responseKey]: authorization.error },
            { status: authorization.status }
        );
    }

    if (intent) {
        try {
            const confirmation = await prepareOrConfirmAssistantMutation({
                userId: authorization.userId,
                intent,
                confirmationToken: authorization.confirmationToken,
                createConfirmation: createPersistentAssistantConfirmationToken,
                consumeConfirmation: consumePersistentAssistantConfirmation,
            });

            if (!confirmation.confirmed) {
                return NextResponse.json({
                    [responseKey]: CONFIRMATION_MESSAGES[intent],
                    requiresConfirmation: true,
                    confirmationToken: confirmation.confirmationToken,
                });
            }
        } catch {
            return NextResponse.json(
                { [responseKey]: "A confirmação é inválida, expirou ou já foi usada." },
                { status: 400 }
            );
        }
    }

    try {
        return NextResponse.json({
            [responseKey]: await action(authorization.userId),
            requiresConfirmation: false,
        });
    } catch (error) {
        console.error("Erro em ferramenta do assistente:", error);
        return NextResponse.json(
            { [responseKey]: errorMessage },
            { status: 500 }
        );
    }
}
