import test from "node:test";
import assert from "node:assert/strict";
import {
  catalogQuery,
  publicCatalogWhere,
  catalogItemDto,
  catalogDetail,
  listCategories,
} from "../src/lib/catalog-domain.mjs";
test("contrato recusa filtros antigos, parâmetros duplicados e paginação abusiva", () => {
  for (const text of [
    "categoria=infantil",
    "tipo=aluguel",
    "q=" + "x".repeat(81),
    "page=0",
    "page=1.2",
    "pageSize=1000",
    "categoria=livros&categoria=roupas",
    "sellerId=other",
    "curadoria=unknown",
  ])
    assert.throws(
      () => catalogQuery(new URLSearchParams(text)),
      (e) => e.status === 400,
    );
  assert.equal(
    catalogQuery(new URLSearchParams("q=  Livro  &tipo=doacao")).q,
    "Livro",
  );
});
test("busca mantém a regra Web: trecho completo em título, descrição ou categoria, sempre ATIVO", () => {
  const query = catalogQuery(
    new URLSearchParams("q=Livro de&categoria=livros&tipo=TROCA"),
  );
  const where = publicCatalogWhere(query);
  assert.equal(where.status, "ATIVO");
  assert.equal(where.category.slug, "livros");
  assert.equal(where.type, "TROCA");
  assert.equal(where.OR.length, 3);
  assert.equal(where.OR[0].title.contains, "Livro de");
});
test("DTO usa projeção explícita, moeda decimal e datas UTC sem dados privados", () => {
  const item = {
    id: "fixture",
    title: "Fictício",
    description: "Demo",
    type: "VENDA",
    condition: "NOVO",
    price: { toString: () => "49.9" },
    status: "ATIVO",
    location: "Bairro fictício",
    category: { id: "c", name: "Livros", slug: "livros" },
    images: [{ url: "/images/demo.png", position: 0 }],
    createdAt: new Date(0),
    updatedAt: new Date(0),
    sellerId: "private",
    email: "private",
    passwordHash: "secret",
    street: "private",
  };
  const dto = catalogItemDto(item);
  assert.equal(dto.price, "49.90");
  assert.equal(dto.createdAt, "1970-01-01T00:00:00.000Z");
  for (const field of ["sellerId", "email", "passwordHash", "street"])
    assert.ok(!Object.hasOwn(dto, field));
  assert.equal(catalogItemDto({ ...item, type: "DOACAO" }).price, null);
});
test("detalhe público não oferece exceção de proprietário; preview Web é explícito", async () => {
  const calls = [];
  const db = {
    item: {
      findFirst: async (args) => {
        calls.push(args);
        return null;
      },
    },
  };
  await assert.rejects(catalogDetail(db, "hidden"), (e) => e.status === 404);
  assert.deepEqual(calls[0].where, { id: "hidden", status: "ATIVO" });
  await assert.rejects(
    catalogDetail(db, "hidden", "verified-owner"),
    (e) => e.status === 404,
  );
  assert.deepEqual(calls[1].where.OR, [
    { status: "ATIVO" },
    { sellerId: "verified-owner" },
  ]);
});
test("categorias centrais preservam a ordem Web mesmo quando o banco retorna outra ordem", async () => {
  const db = {
    category: {
      findMany: async () => [
        { id: "2", slug: "livros", name: "Livros" },
        { id: "1", slug: "eletronicos", name: "Eletrônicos" },
      ],
    },
  };
  assert.deepEqual(
    (await listCategories(db)).map((c) => c.slug),
    ["eletronicos", "livros"],
  );
});
