const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  ts = require("typescript");
const scope = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("src/lib/publishDraft.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  scope,
);
const { publishDraftKey, draftPhotoReference } = scope.exports;
test("rascunhos de contas distintas nunca usam mesma chave ou chaves históricas globais", () => {
  assert.notEqual(publishDraftKey("A"), publishDraftKey("B"));
  assert.throws(() => publishDraftKey(""));
  assert.ok(!publishDraftKey("A").startsWith("draft_"));
});
test("URI local nunca é referência de imagem publicada", () => {
  assert.throws(() =>
    draftPhotoReference({ uri: "file:///private/photo.jpg" }),
  );
  assert.equal(
    draftPhotoReference({ uploadId: "verified" }).uploadId,
    "verified",
  );
  assert.equal(
    draftPhotoReference({ imageId: "retained" }).imageId,
    "retained",
  );
});
