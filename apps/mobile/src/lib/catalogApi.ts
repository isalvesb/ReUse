import { fetchWithTimeout } from "./fetchWithTimeout";
export type Category = { id: string; name: string; slug: string };
export type CatalogItem = {
  id: string;
  title: string;
  description: string;
  type: "DOACAO" | "TROCA" | "VENDA";
  condition: string;
  price: string | null;
  currency: "BRL";
  location: string | null;
  status: string;
  category: Category;
  images: string[];
  createdAt: string;
  updatedAt: string;
  seller?: {
    id: string;
    name: string;
    rating: number;
    activeItemsCount: number;
  };
};
export type CatalogPage = {
  items: CatalogItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
export const TYPE_LABELS = { DOACAO: "Doação", TROCA: "Troca", VENDA: "Venda" };
export const CONDITION_LABELS: Record<string, string> = {
  NOVO: "Novo",
  USADO_COMO_NOVO: "Usado • Como novo",
  USADO_BOM_ESTADO: "Usado • Bom estado",
  USADO_ESTADO_REGULAR: "Usado • Estado regular",
};
export const priceLabel = (item: CatalogItem) =>
  item.type === "VENDA" && item.price !== null
    ? Number(item.price).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : null;
function origin() {
  const url = new URL(process.env.EXPO_PUBLIC_REUSE_API_URL || "");
  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    (url.protocol !== "https:" && !(url.protocol === "http:" && __DEV__))
  )
    throw Error("Configure o endereço seguro da API.");
  return url.origin;
}
export function catalogImage(url: string) {
  return url.startsWith("/") ? origin() + url : url;
}
export class CatalogError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
async function read<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetchWithTimeout(`${origin()}/api/v1${path}`, {
    signal,
  });
  const result = await response.json();
  if (!response.ok)
    throw new CatalogError(
      response.status,
      result.error?.message || "Catálogo indisponível.",
    );
  return result.data;
}
export const readCategories = (signal?: AbortSignal) =>
  read<Category[]>("/categories", signal);
export const readItems = (
  query: Record<string, string>,
  signal?: AbortSignal,
) => read<CatalogPage>(`/items?${new URLSearchParams(query)}`, signal);
export const readItem = (id: string, signal?: AbortSignal) =>
  read<CatalogItem>(`/items/${encodeURIComponent(id)}`, signal);
