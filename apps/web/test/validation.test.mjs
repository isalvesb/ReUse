import assert from "node:assert/strict";
import test from "node:test";
import {
    isValidEmail,
    normalizeEmail,
    validatePassword,
} from "../src/lib/validation.mjs";

test("normaliza e valida um e-mail comum", () => {
    assert.equal(normalizeEmail("  Gui@Example.COM "), "gui@example.com");
    assert.equal(isValidEmail("gui@example.com"), true);
});

test("rejeita e-mails incompletos", () => {
    assert.equal(isValidEmail("gui@localhost"), false);
    assert.equal(isValidEmail("gui example.com"), false);
});

test("limita o tamanho das senhas antes do hash", () => {
    assert.match(validatePassword("curta"), /mínimo/);
    assert.equal(validatePassword("uma-senha-segura"), null);
    assert.match(validatePassword("x".repeat(129)), /máximo/);
});
