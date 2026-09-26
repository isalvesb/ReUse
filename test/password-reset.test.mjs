import test from "node:test";
import assert from "node:assert/strict";
import {
    createPasswordResetToken,
    escapeHtml,
    hashPasswordResetToken,
} from "../src/lib/password-reset.mjs";

test("armazena apenas o hash do token de redefinição", () => {
    const { rawToken, tokenHash } = createPasswordResetToken();

    assert.equal(rawToken.length, 64);
    assert.equal(tokenHash, hashPasswordResetToken(rawToken));
    assert.notEqual(rawToken, tokenHash);
});

test("rejeita tokens curtos ou ausentes", () => {
    assert.equal(hashPasswordResetToken("curto"), null);
    assert.equal(hashPasswordResetToken(null), null);
});

test("escapa conteúdo usado no e-mail HTML", () => {
    assert.equal(
        escapeHtml('<img src=x onerror="alert(1)">'),
        "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
    );
});
