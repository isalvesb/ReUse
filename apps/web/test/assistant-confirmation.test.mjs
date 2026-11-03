import test from "node:test";
import assert from "node:assert/strict";
import {
    createAssistantConfirmationToken,
    verifyAssistantConfirmationToken,
} from "../src/lib/assistant-confirmation.mjs";
import { ASSISTANT_INTENTS } from "../src/lib/assistant-intents.mjs";

process.env.ASSISTANT_CONFIRMATION_SECRET = "teste-confirmacao-reuse-com-mais-de-32-caracteres";

test("confirma uma intenção mutável para o mesmo usuário", async () => {
    const token = await createAssistantConfirmationToken({
        userId: "usuario-1",
        intent: ASSISTANT_INTENTS.PAUSAR,
    });

    assert.equal(
        await verifyAssistantConfirmationToken(token, "usuario-1"),
        ASSISTANT_INTENTS.PAUSAR
    );
});

test("rejeita confirmação usada por outro usuário", async () => {
    const token = await createAssistantConfirmationToken({
        userId: "usuario-1",
        intent: ASSISTANT_INTENTS.RETOMAR,
    });

    await assert.rejects(
        verifyAssistantConfirmationToken(token, "usuario-2"),
        /outro usuário/
    );
});

test("não assina intenções sem mutação", async () => {
    await assert.rejects(
        createAssistantConfirmationToken({
            userId: "usuario-1",
            intent: ASSISTANT_INTENTS.RESUMIR,
        }),
        /inválida/
    );
});
