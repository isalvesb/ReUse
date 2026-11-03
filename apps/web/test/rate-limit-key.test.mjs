import assert from "node:assert/strict";
import test from "node:test";
import { createRateLimitKey } from "../src/lib/rate-limit-key.mjs";

test("gera uma chave estável sem expor o identificador", () => {
    const input = {
        scope: "login",
        identifier: "gui@example.com",
        windowId: 123,
        secret: "uma-chave-de-teste-com-mais-de-32-caracteres",
    };
    const first = createRateLimitKey(input);
    const second = createRateLimitKey(input);

    assert.equal(first, second);
    assert.equal(first.length, 64);
    assert.equal(first.includes(input.identifier), false);
});

test("separa escopos e janelas diferentes", () => {
    const base = {
        identifier: "gui@example.com",
        secret: "uma-chave-de-teste-com-mais-de-32-caracteres",
    };

    assert.notEqual(
        createRateLimitKey({ ...base, scope: "login", windowId: 1 }),
        createRateLimitKey({ ...base, scope: "cadastro", windowId: 1 })
    );
    assert.notEqual(
        createRateLimitKey({ ...base, scope: "login", windowId: 1 }),
        createRateLimitKey({ ...base, scope: "login", windowId: 2 })
    );
});
