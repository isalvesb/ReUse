import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { assertLabDatabaseUrl, LAB_AUTH_URL } from "../src/lib/lab-config.mjs";
import { CATALOG_CATEGORIES } from "../src/lib/catalog-domain.mjs";
const { PrismaClient } = createRequire(import.meta.url)("@prisma/client");
assertLabDatabaseUrl(process.env.DATABASE_URL);
assert.equal(process.env.SUPABASE_AUTH_URL, LAB_AUTH_URL);
assert.ok(
  process.argv.includes("--apply"),
  "Passe --apply para gravar apenas os fixtures do laboratório.",
);
const db = new PrismaClient();
try {
  const users = await db.user.findMany({
    select: {
      id: true,
      authSubject: true,
      name: true,
      bio: true,
      updatedAt: true,
    },
  });
  assert.equal(users.length, 2);
  const owners = [
    process.env.REUSE_TEST_SUBJECT_A,
    process.env.REUSE_TEST_SUBJECT_B,
  ].map((subject) => users.find((u) => u.authSubject === subject));
  assert.ok(owners.every(Boolean));
  const hash = () =>
    createHash("sha256").update(JSON.stringify(users)).digest("hex");
  const before = hash();
  const titles = [
    "Notebook de demonstração",
    "Jaqueta de demonstração",
    "Cadeira de demonstração",
    "Livro de demonstração",
    "Sapatos de demonstração",
    "Objeto de demonstração",
  ];
  const images = [
    "/images/categorias/notebook.png",
    "/images/itens/jaqueta.jpg",
    "/images/itens/cadeira.png",
    "/images/promo/livros.jpg",
    "/images/categorias/tenis.png",
    "/images/logo/ReUse-marrom.png",
  ];
  for (const image of images)
    assert.ok(
      createRequire(import.meta.url)("node:fs").existsSync(
        new URL("../public" + image, import.meta.url),
      ),
    );
  await db.$transaction(
    async (tx) => {
      for (const category of CATALOG_CATEGORIES)
        await tx.category.upsert({
          where: { slug: category.slug },
          create: category,
          update: { name: category.name },
        });
      for (let i = 0; i < 15; i++) {
        const id = `lab15-item-${String(i + 1).padStart(2, "0")}`,
          category = await tx.category.findUnique({
            where: { slug: CATALOG_CATEGORIES[i % 6].slug },
          });
        const sellerId = owners[i % 2].id,
          existing = await tx.item.findUnique({
            where: { id },
            select: { sellerId: true, description: true },
          });
        assert.ok(
          !existing ||
            (existing.sellerId === sellerId &&
              existing.description.startsWith("Anúncio fictício")),
          "ID fora do conjunto autorizado.",
        );
        const type = ["DOACAO", "TROCA", "VENDA"][i % 3];
        const data = {
          title: `${titles[i % 6]} ${i + 1}`,
          description:
            "Anúncio fictício para demonstração do ReUse Lab. Não corresponde a uma oferta real. Imagem ilustrativa existente no projeto Web.",
          categoryId: category.id,
          sellerId,
          type,
          condition: [
            "NOVO",
            "USADO_COMO_NOVO",
            "USADO_BOM_ESTADO",
            "USADO_ESTADO_REGULAR",
          ][i % 4],
          price: type === "VENDA" ? String(49.9 + i) : null,
          location: "Bairro fictício, São Paulo, SP",
          status:
            i < 12 ? "ATIVO" : ["RESERVADO", "CONCLUIDO", "INATIVO"][i - 12],
          createdAt: new Date(Date.UTC(2026, 10, 3, 12, 0, 15 - i)),
        };
        await tx.item.upsert({
          where: { id },
          create: { id, ...data },
          update: data,
        });
        await tx.itemImage.upsert({
          where: { id: `lab15-image-${i + 1}` },
          create: {
            id: `lab15-image-${i + 1}`,
            itemId: id,
            url: images[i % 6],
            position: 0,
          },
          update: { url: images[i % 6], position: 0 },
        });
      }
    },
    { timeout: 60000, maxWait: 15000 },
  );
  const after = await db.user.findMany({
    select: {
      id: true,
      authSubject: true,
      name: true,
      bio: true,
      updatedAt: true,
    },
  });
  assert.equal(
    createHash("sha256").update(JSON.stringify(after)).digest("hex"),
    before,
  );
  console.log(
    JSON.stringify({
      project: "reuse-lab",
      categories: 6,
      publicFictitiousItems: 12,
      nonPublicControls: 3,
      profilesUnchanged: true,
      migrations: false,
    }),
  );
} finally {
  await db.$disconnect();
}
