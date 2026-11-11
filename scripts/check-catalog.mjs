import assert from "node:assert/strict";
const base = "http://127.0.0.1:4330",
  checks = [];
async function json(path) {
  const r = await fetch(base + path);
  assert.equal(r.status, 200);
  return (await r.json()).data;
}
async function check(name, run) {
  await run();
  checks.push({ name, passed: true });
}
try {
  let all, categories;
  await check(
    "seis categorias centrais e 12 anúncios fictícios públicos",
    async () => {
      categories = await json("/api/v1/categories");
      assert.deepEqual(
        categories.map((c) => c.slug),
        ["eletronicos", "roupas", "moveis", "livros", "sapatos", "outros"],
      );
      all = await json("/api/v1/items");
      assert.equal(all.pagination.total, 12);
      assert.equal(all.items.length, 12);
      assert.ok(all.items.every((i) => i.status === "ATIVO"));
    },
  );
  await check(
    "IDs, detalhes, categorias, modalidades, condição, preços e imagens consistentes",
    async () => {
      for (const item of all.items) {
        const detail = await json("/api/v1/items/" + item.id);
        for (const key of [
          "id",
          "title",
          "description",
          "type",
          "condition",
          "price",
          "location",
          "createdAt",
        ])
          assert.equal(detail[key], item[key]);
        assert.deepEqual(detail.category, item.category);
        assert.ok(categories.some((c) => c.id === item.category.id));
        assert.equal(item.type === "VENDA", item.price !== null);
        assert.ok(
          !JSON.stringify(detail).match(
            /passwordHash|authSubject|sessionVersion|user_email|"email"|"street"|"cep"/,
          ),
        );
        for (const image of item.images) {
          const r = await fetch(base + image);
          assert.equal(r.status, 200);
          assert.match(r.headers.get("content-type"), /^image\//);
        }
      }
    },
  );
  await check(
    "filtros de categorias e modalidades combinam corretamente",
    async () => {
      for (const category of categories) {
        const page = await json("/api/v1/items?categoria=" + category.slug);
        assert.equal(page.pagination.total, 2);
        assert.ok(page.items.every((i) => i.category.id === category.id));
        for (const type of ["DOACAO", "TROCA", "VENDA"]) {
          const result = await json(
            `/api/v1/items?categoria=${category.slug}&tipo=${type}`,
          );
          assert.equal(
            result.pagination.total,
            all.items.filter(
              (i) => i.category.id === category.id && i.type === type,
            ).length,
          );
        }
      }
    },
  );
  await check(
    "busca case-insensitive e resultados vazios sem dados simulados de fallback",
    async () => {
      for (const q of ["LIVRO", "demonstração", "Bairro inexistente"]) {
        const result = await json("/api/v1/items?q=" + encodeURIComponent(q));
        const expected = all.items.filter((i) =>
          [i.title, i.description, i.category.name].some((v) =>
            v.toLowerCase().includes(q.toLowerCase()),
          ),
        );
        assert.deepEqual(
          result.items.map((i) => i.id),
          expected.map((i) => i.id),
        );
      }
      assert.equal(
        (await json("/api/v1/items?q=zzzznenhum")).pagination.total,
        0,
      );
    },
  );
  await check("paginação estável sem duplicação ou omissão", async () => {
    const a = await json("/api/v1/items?pageSize=6&page=1"),
      b = await json("/api/v1/items?pageSize=6&page=2");
    assert.deepEqual(
      [...a.items, ...b.items].map((i) => i.id),
      all.items.map((i) => i.id),
    );
    assert.equal(new Set([...a.items, ...b.items].map((i) => i.id)).size, 12);
  });
  await check(
    "RESERVADO, CONCLUIDO e INATIVO não aparecem nem por ID público",
    async () => {
      for (const id of ["13", "14", "15"]) {
        assert.equal(
          (await fetch(base + "/api/v1/items/lab15-item-" + id)).status,
          404,
        );
        const r = await fetch(base + "/produto/lab15-item-" + id);
        assert.equal(r.status, 404);
      }
    },
  );
  await check(
    "Web SSR contém os mesmos IDs da API e mantém os filtros",
    async () => {
      for (const query of [
        "",
        "?categoria=livros",
        "?tipo=DOACAO",
        "?q=Livro",
        "?categoria=livros&tipo=VENDA",
      ]) {
        const result = await json("/api/v1/items" + query),
          html = await (await fetch(base + "/vitrine" + query)).text();
        const ids = [
          ...new Set(
            [...html.matchAll(/href="\/produto\/(lab15-item-\d+)"/g)].map(
              (m) => m[1],
            ),
          ),
        ];
        assert.deepEqual(ids.sort(), result.items.map((i) => i.id).sort());
      }
      const html = await (await fetch(base + "/")).text();
      assert.ok(html.includes("lab15-item-01"));
    },
  );
  await check("parâmetros inválidos são recusados com 400", async () => {
    for (const q of [
      "categoria=infantil",
      "pageSize=1000",
      "tipo=aluguel",
      "sellerId=private",
      "page=-1",
      "q=a&q=b",
    ])
      assert.equal((await fetch(base + "/api/v1/items?" + q)).status, 400);
  });
  console.log(
    JSON.stringify(
      {
        mode: "HTTP real + SSR, banco novo, sem interface automatizada",
        checks,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.log(
    JSON.stringify(
      { completed: false, checks, error: error.name, message: error.message },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}
