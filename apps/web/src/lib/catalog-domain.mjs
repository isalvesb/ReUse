import { IntegrationError } from "./profile-domain.mjs";
import { getItemImage } from "./item-image.mjs";
import { RARE_PIECES_DEMO_ITEMS, demoItemFilter } from "./demo-curations.js";
export const CATALOG_CATEGORIES = [
  { name: "Eletrônicos", slug: "eletronicos" },
  { name: "Roupas", slug: "roupas" },
  { name: "Móveis", slug: "moveis" },
  { name: "Livros", slug: "livros" },
  { name: "Sapatos", slug: "sapatos" },
  { name: "Outros", slug: "outros" },
];
export function catalogQuery(params) {
  const allowed = ["q", "categoria", "tipo", "page", "pageSize", "curadoria"];
  for (const key of params.keys())
    if (!allowed.includes(key) || params.getAll(key).length !== 1)
      throw new IntegrationError(
        400,
        "INVALID_QUERY",
        "Parâmetros de catálogo inválidos.",
      );
  const q = (params.get("q") || "").trim(),
    categoria = params.get("categoria") || "",
    tipo = (params.get("tipo") || "").toUpperCase(),
    curadoria = params.get("curadoria") || "";
  const page = Number(params.get("page") || 1),
    pageSize = Number(params.get("pageSize") || 12);
  if (
    q.length > 80 ||
    (categoria && !CATALOG_CATEGORIES.some((c) => c.slug === categoria)) ||
    (tipo && !["VENDA", "TROCA", "DOACAO"].includes(tipo)) ||
    (curadoria && curadoria !== "pecas-raras") ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 10000 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 24
  )
    throw new IntegrationError(
      400,
      "INVALID_QUERY",
      "Busca ou filtros inválidos.",
    );
  return { q, categoria, tipo, page, pageSize, curadoria };
}
export function publicCatalogWhere({
  q = "",
  categoria = "",
  tipo = "",
  curadoria = "",
} = {}) {
  return {
    status: "ATIVO",
    ...(categoria ? { category: { slug: categoria } } : {}),
    ...(tipo ? { type: tipo } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(curadoria
      ? { AND: [{ OR: RARE_PIECES_DEMO_ITEMS.map(demoItemFilter) }] }
      : {}),
  };
}
export const CATALOG_SELECT = {
  id: true,
  title: true,
  description: true,
  type: true,
  condition: true,
  price: true,
  location: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    select: { url: true, position: true },
    orderBy: { position: "asc" },
  },
};
export function catalogItemDto(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.type,
    condition: item.condition,
    price:
      item.type === "VENDA" && item.price != null
        ? Number(item.price.toString()).toFixed(2)
        : null,
    currency: "BRL",
    location: item.location,
    status: item.status,
    category: item.category,
    images: item.images.length
      ? item.images.map((i) => i.url)
      : [getItemImage(item)],
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}
export async function listCategories(db) {
  const found = await db.category.findMany({
    where: { slug: { in: CATALOG_CATEGORIES.map((c) => c.slug) } },
    select: { id: true, name: true, slug: true },
  });
  return CATALOG_CATEGORIES.flatMap((c) =>
    found.filter((row) => row.slug === c.slug),
  );
}
export async function listCatalog(db, query) {
  const where = publicCatalogWhere(query);
  const [items, total] = await db.$transaction([
    db.item.findMany({
      where,
      select: CATALOG_SELECT,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    db.item.count({ where }),
  ]);
  return {
    items: items.map(catalogItemDto),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    },
  };
}
export async function catalogDetail(db, id, ownerId = null) {
  if (typeof id !== "string" || !id || id.length > 128)
    throw new IntegrationError(
      404,
      "ITEM_NOT_FOUND",
      "Anúncio não encontrado.",
    );
  const item = await db.item.findFirst({
    where: {
      id,
      ...(ownerId
        ? { OR: [{ status: "ATIVO" }, { sellerId: ownerId }] }
        : { status: "ATIVO" }),
    },
    select: {
      ...CATALOG_SELECT,
      seller: {
        select: { id: true, name: true, avatarUrl: true, rating: true },
      },
    },
  });
  if (!item)
    throw new IntegrationError(
      404,
      "ITEM_NOT_FOUND",
      "Anúncio não encontrado.",
    );
  const count = await db.item.count({
    where: { sellerId: item.seller.id, status: "ATIVO" },
  });
  return {
    ...catalogItemDto(item),
    seller: { ...item.seller, activeItemsCount: count },
  };
}
