import test from "node:test";
import assert from "node:assert/strict";
import { validateItem, ownItem } from "../src/lib/item-write-domain.mjs";
const valid = () => ({
  title: "Anúncio fictício",
  description: "Descrição fictícia suficiente para publicação.",
  category: "livros",
  type: "DOACAO",
  condition: "NOVO",
  price: null,
  location: "",
  photos: [{ uploadId: "fixture" }],
  creationKey: "01234567-0123-4123-8123-012345678901",
});
test("publicação mantém limites Web e nunca aceita propriedade cliente ou URL local", () => {
  assert.equal(validateItem(valid()).data.location, null);
  for (const patch of [
    { sellerId: "other" },
    { title: "x".repeat(121) },
    { description: "curta" },
    { location: "x".repeat(161) },
    { category: "infantil" },
    { condition: "regular" },
    { type: "aluguel" },
    { photos: [] },
    { photos: Array(6).fill({ uploadId: "x" }) },
    { photos: [{ url: "file:///local.jpg" }] },
    { status: "CONCLUIDO" },
  ])
    assert.throws(
      () => validateItem({ ...valid(), ...patch }),
      (e) => e.status === 400,
    );
});
test("venda valida precisão, limite e positivo; doação/troca não retêm preço", () => {
  for (const price of ["0", "-1", "NaN", "1.001", "100000000", "1e2"])
    assert.throws(() => validateItem({ ...valid(), type: "VENDA", price }));
  assert.equal(
    validateItem({ ...valid(), type: "VENDA", price: "42.9" }).data.price,
    "42.90",
  );
  assert.equal(validateItem({ ...valid(), price: "42.9" }).data.price, null);
});
test("edição exige versão e referências únicas de fotos", () => {
  assert.throws(() => validateItem(valid(), true));
  assert.throws(() =>
    validateItem({
      ...valid(),
      photos: [{ uploadId: "same" }, { uploadId: "same" }],
    }),
  );
  const input = { ...valid(), updatedAt: new Date().toISOString() };
  delete input.creationKey;
  assert.equal(validateItem(input, true).data.status, "ATIVO");
});
test("consulta própria sempre inclui dono autenticado; ausente e terceiro geram mesmo 404", async () => {
  let where;
  const db = {
    item: {
      findFirst: async (options) => {
        where = options.where;
        return null;
      },
    },
  };
  await assert.rejects(
    ownItem(db, { userId: "verified" }, "other"),
    (e) => e.status === 404,
  );
  assert.deepEqual(where, { id: "other", sellerId: "verified" });
});
