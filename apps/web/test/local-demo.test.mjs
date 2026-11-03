import test from "node:test";
import assert from "node:assert/strict";
import { assertLocalDatabase, isLocalDemo } from "../src/lib/local-demo.mjs";
import { readCatalog } from "../src/lib/catalog-availability.mjs";
test("demonstração recusa destinos remotos e hospedagem pública", () => {
    assert.throws(() => assertLocalDatabase("postgresql://user@db.example/db"));
    assert.throws(() => assertLocalDatabase("https://localhost/db"));
    const env = { REUSE_LOCAL_DEMO: "true", DATABASE_URL: "postgresql://user@127.0.0.1:55437/demo", NEXT_PUBLIC_APP_URL: "http://127.0.0.1:4317" };
    assert.equal(isLocalDemo(env), true);
    assert.throws(() => isLocalDemo({ ...env, VERCEL: "1" }));
    assert.throws(() => isLocalDemo({ ...env, NEXT_PUBLIC_APP_URL: "https://example.com" }));
    assert.equal(isLocalDemo({}), false);
});
test("catálogo distingue dados vazios, indisponibilidade e erro de programação", async () => {
    assert.deepEqual(await readCatalog(async () => []), { available: true, items: [] });
    const error = new Error("credential must never be logged"); error.name = "PrismaClientInitializationError";
    assert.deepEqual(await readCatalog(async () => { throw error; }), { available: false, items: [] });
    await assert.rejects(readCatalog(async () => { throw new TypeError("bug"); }), TypeError);
});

import { localUploadSegments } from "../src/lib/local-upload-path.mjs";
test("imagens locais recusam travessia, arquivos arbitrários e diretórios externos", () => {
    assert.equal(localUploadSegments(["..", "secret.jpg"]), null);
    assert.equal(localUploadSegments(["items", "../../.env"]), null);
    assert.equal(localUploadSegments(["avatars", "foto.svg"]), null);
    assert.equal(localUploadSegments(["items", "abc", "foto.jpg"]), null);
    assert.equal(localUploadSegments(["items", "79e6ef9b-9803-46a1-bbbd-a04a8c0f98dd.jpg"]).mime, "image/jpeg");
});
