import test from "node:test";
import assert from "node:assert/strict";
import { prepareOrConfirmAssistantMutation } from "../src/lib/assistant-tool-confirmation.mjs";

function createMemoryConfirmationStore() {
    const available = new Map();
    let sequence = 0;

    return {
        async create({ userId, intent }) {
            const token = `confirmacao-${++sequence}`;
            available.set(token, { userId, intent });
            return token;
        },
        async consume(token, userId, expectedIntent) {
            const confirmation = available.get(token);

            if (
                !confirmation
                || confirmation.userId !== userId
                || confirmation.intent !== expectedIntent
            ) {
                throw new Error("Confirmação inválida, usada ou pertencente a outro usuário.");
            }

            available.delete(token);
            return confirmation.intent;
        },
    };
}

test("uma mutação só avança após confirmação emitida pelo servidor", async () => {
    const store = createMemoryConfirmationStore();
    const prepared = await prepareOrConfirmAssistantMutation({
        userId: "usuario-1",
        intent: "PAUSAR",
        confirmationToken: null,
        createConfirmation: store.create,
        consumeConfirmation: store.consume,
    });

    assert.equal(prepared.confirmed, false);
    assert.ok(prepared.confirmationToken);

    const confirmed = await prepareOrConfirmAssistantMutation({
        userId: "usuario-1",
        intent: "PAUSAR",
        confirmationToken: prepared.confirmationToken,
        createConfirmation: store.create,
        consumeConfirmation: store.consume,
    });

    assert.equal(confirmed.confirmed, true);
});

test("a confirmação é de uso único", async () => {
    const store = createMemoryConfirmationStore();
    const prepared = await prepareOrConfirmAssistantMutation({
        userId: "usuario-1",
        intent: "RETOMAR",
        confirmationToken: null,
        createConfirmation: store.create,
        consumeConfirmation: store.consume,
    });

    await prepareOrConfirmAssistantMutation({
        userId: "usuario-1",
        intent: "RETOMAR",
        confirmationToken: prepared.confirmationToken,
        createConfirmation: store.create,
        consumeConfirmation: store.consume,
    });

    await assert.rejects(
        prepareOrConfirmAssistantMutation({
            userId: "usuario-1",
            intent: "RETOMAR",
            confirmationToken: prepared.confirmationToken,
            createConfirmation: store.create,
            consumeConfirmation: store.consume,
        }),
        /usada/
    );
});

test("a confirmação de um usuário não autoriza outro", async () => {
    const store = createMemoryConfirmationStore();
    const prepared = await prepareOrConfirmAssistantMutation({
        userId: "usuario-1",
        intent: "MARCAR_NOTIFICACOES_LIDAS",
        confirmationToken: null,
        createConfirmation: store.create,
        consumeConfirmation: store.consume,
    });

    await assert.rejects(
        prepareOrConfirmAssistantMutation({
            userId: "usuario-2",
            intent: "MARCAR_NOTIFICACOES_LIDAS",
            confirmationToken: prepared.confirmationToken,
            createConfirmation: store.create,
            consumeConfirmation: store.consume,
        }),
        /outro usuário/
    );
});
