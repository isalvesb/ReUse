import test from "node:test";
import assert from "node:assert/strict";
import { hasValidImageSignature } from "../src/lib/image-signatures.mjs";
import {
    getImageExtension,
    getItemPhotoValidationError,
    ITEM_PHOTO_LIMITS,
} from "../src/lib/upload-constraints.mjs";

function image(type = "image/jpeg", size = 1024) {
    return { type, size };
}

test("aceita assinaturas coerentes com o MIME informado", () => {
    assert.equal(
        hasValidImageSignature(
            Buffer.from([0xff, 0xd8, 0xff, 0x00]),
            "image/jpeg"
        ),
        true
    );
    assert.equal(
        hasValidImageSignature(Buffer.from("GIF89a", "ascii"), "image/gif"),
        true
    );
});

test("rejeita arquivo disfarçado de imagem", () => {
    assert.equal(
        hasValidImageSignature(Buffer.from("<script>alert(1)</script>"), "image/png"),
        false
    );
});

test("mantém extensões e tipos de imagem em uma única regra", () => {
    assert.equal(getImageExtension("image/jpeg"), "jpg");
    assert.equal(getImageExtension("image/webp"), "webp");
    assert.equal(getImageExtension("image/svg+xml"), null);
});

test("valida quantidade, tipo e tamanho das fotos do item", () => {
    assert.equal(
        getItemPhotoValidationError(
            Array.from({ length: ITEM_PHOTO_LIMITS.maxFiles + 1 }, () => image())
        ),
        "Adicione no máximo 5 imagens."
    );
    assert.equal(
        getItemPhotoValidationError([image("image/svg+xml")]),
        "Use imagens JPG, PNG, WebP ou GIF."
    );
    assert.equal(
        getItemPhotoValidationError([
            image("image/png", ITEM_PHOTO_LIMITS.maxFileSize + 1),
        ]),
        "Cada imagem pode ter no máximo 5 MB."
    );
    assert.equal(
        getItemPhotoValidationError([
            image("image/png", 4 * 1024 * 1024 + 1),
            image("image/jpeg", 4 * 1024 * 1024),
            image("image/webp", 4 * 1024 * 1024),
        ]),
        "As imagens podem somar no máximo 12 MB."
    );
    assert.equal(getItemPhotoValidationError([image()]), null);
});
