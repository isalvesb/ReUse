import test from "node:test";
import assert from "node:assert/strict";
import {
    ASSISTANT_INTENTS,
    detectLocalIntent,
    mapWatsonIntent,
    normalizeAssistantText,
} from "../src/lib/assistant-intents.mjs";

test("normaliza acentos, caixa e pontuação", () => {
    assert.equal(normalizeAssistantText("  Situação da VITRINE?  "), "situacao da vitrine");
});

test("reconhece as quatro intenções locais permitidas", () => {
    assert.equal(detectLocalIntent("Pause minhas ofertas"), ASSISTANT_INTENTS.PAUSAR);
    assert.equal(detectLocalIntent("Reative meus anúncios"), ASSISTANT_INTENTS.RETOMAR);
    assert.equal(detectLocalIntent("Resuma minha vitrine"), ASSISTANT_INTENTS.RESUMIR);
    assert.equal(detectLocalIntent("Como publicar um item?"), ASSISTANT_INTENTS.ORIENTAR_PUBLICACAO);
});

test("não transforma texto desconhecido em ação", () => {
    assert.equal(detectLocalIntent("Boa tarde"), ASSISTANT_INTENTS.DESCONHECIDO);
    assert.equal(mapWatsonIntent("apagar_conta"), ASSISTANT_INTENTS.DESCONHECIDO);
});

test("mapeia somente intenções Watson previstas", () => {
    assert.equal(mapWatsonIntent("pausar-ofertas"), ASSISTANT_INTENTS.PAUSAR);
    assert.equal(mapWatsonIntent("RETOMAR_OFERTAS"), ASSISTANT_INTENTS.RETOMAR);
    assert.equal(mapWatsonIntent("orientar publicação"), ASSISTANT_INTENTS.ORIENTAR_PUBLICACAO);
});
