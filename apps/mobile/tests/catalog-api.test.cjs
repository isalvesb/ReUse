const test = require("node:test"),
  assert = require("node:assert/strict"),
  ts = require("typescript"),
  fs = require("node:fs"),
  vm = require("node:vm");
function api(status = 200) {
  const calls = [];
  const scope = {
    exports: {},
    URL,
    URLSearchParams,
    __DEV__: true,
    process: { env: { EXPO_PUBLIC_REUSE_API_URL: "http://127.0.0.1:4330" } },
    require: () => ({
      fetchWithTimeout: async (url, init) => {
        calls.push({ url, init });
        return {
          ok: status === 200,
          status,
          json: async () => ({ data: [], error: { message: "Indisponível" } }),
        };
      },
    }),
  };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync("src/lib/catalogApi.ts", "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    scope,
  );
  return { ...scope.exports, calls };
}
test("leitura pública usa os contratos centrais e nunca envia email/UID como autorização", async () => {
  const a = api();
  await a.readCategories();
  await a.readItems({
    q: "Livro",
    categoria: "livros",
    tipo: "TROCA",
    page: "2",
  });
  await a.readItem("lab15-item-01");
  assert.match(a.calls[1].url, /q=Livro&categoria=livros&tipo=TROCA&page=2/);
  assert.equal(
    a.calls[2].url,
    "http://127.0.0.1:4330/api/v1/items/lab15-item-01",
  );
  assert.ok(a.calls.every((c) => !c.init.headers));
});
test("404 e indisponibilidade preservam erro tipado e não se tornam catálogo vazio", async () => {
  await assert.rejects(api(404).readItem("hidden"), (e) => e.status === 404);
  await assert.rejects(api(503).readItems({}), (e) => e.status === 503);
});
test("imagens públicas locais apontam para o mesmo backend e preços são exclusivos de venda", () => {
  const a = api();
  assert.equal(
    a.catalogImage("/images/demo.jpg"),
    "http://127.0.0.1:4330/images/demo.jpg",
  );
  assert.equal(a.priceLabel({ type: "DOACAO", price: "99.90" }), null);
  assert.match(a.priceLabel({ type: "VENDA", price: "49.90" }), /49,90/);
});
