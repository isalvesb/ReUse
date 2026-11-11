const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  ts = require("typescript");
const scope = { exports: {}, Map };
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("src/lib/chatHistory.ts", "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  scope,
);
const message = (n) => ({
  id: String(n).padStart(3, "0"),
  content: "Fictício",
  createdAt: new Date(n * 1000).toISOString(),
  sender: "me",
});
test("histórico reúne páginas, preserva ordem e remove repetidas entre polls", () => {
  const result = scope.exports.mergeMessageWindow(
    [message(2), message(3)],
    [message(1), message(2)],
  );
  assert.deepEqual(
    Array.from(result.items, (m) => m.id),
    ["001", "002", "003"],
  );
  assert.equal(result.reset, false);
});
test("retorno após intervalo longo reinicia janela e paginação sem ocultar lacuna", () => {
  const incoming = Array.from({ length: 30 }, (_, i) => message(i + 10));
  const result = scope.exports.mergeMessageWindow([message(1)], incoming, true);
  assert.equal(result.reset, true);
  assert.equal(result.items.length, 30);
  assert.equal(result.items[0].id, "010");
  assert.equal(
    scope.exports.mergeMessageWindow([message(1)], incoming, false).items
      .length,
    31,
  );
});
