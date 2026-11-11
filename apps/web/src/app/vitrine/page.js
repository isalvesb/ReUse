import Header from "@/components/Header";
import ProfileItemCard from "@/components/ProfileItemCard";
import { ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { formatItemForCard } from "@/lib/format";
import {
  catalogQuery,
  listCatalog,
  listCategories,
} from "@/lib/catalog-domain.mjs";
import Link from "next/link";

import { readCatalog } from "@/lib/catalog-availability.mjs";
import CatalogUnavailable from "@/components/CatalogUnavailable";

export const dynamic = "force-dynamic";

export default async function Vitrine({ searchParams }) {
  const userRead = getCurrentUser();
  const params = await searchParams;
  const raw = new URLSearchParams();
  for (const key of ["q", "categoria", "tipo", "page", "curadoria"]) {
    const value = Array.isArray(params?.[key]) ? params[key][0] : params?.[key];
    if (value) raw.set(key, String(value));
  }
  let filters;
  try {
    filters = catalogQuery(raw);
  } catch {
    filters = catalogQuery(new URLSearchParams());
  }
  const { q: query, categoria: category, tipo: type, curadoria } = filters;
  const isRarePiecesCuration = curadoria === "pecas-raras";
  const [user, catalogRead, categories, unreadCount] = await Promise.all([
    userRead,
    readCatalog(() => listCatalog(prisma, filters)),
    listCategories(prisma).catch(() => []),
    userRead.then((user) => user ? getUnreadNotificationCount(user.id) : 0),
  ]);
  const result = catalogRead.available
    ? catalogRead.items
    : { items: [], pagination: { page: 1, total: 0, totalPages: 0 } };
  const catalog = { available: catalogRead.available };
  const cards = result.items.map((item) =>
    formatItemForCard({ ...item, images: item.images.map((url) => ({ url })) }),
  );

  return (
    <>
      <Header
        loggedIn={!!user}
        avatarUrl={user?.avatarUrl}
        avatarKey={user?.id}
        unreadCount={unreadCount}
        catalogFilters={filters}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-reuse-brown">Vitrine</h1>
            <p className="mt-2 text-sm text-reuse-brown-light">
              {!catalog.available
                ? "A consulta dos anúncios está indisponível."
                : isRarePiecesCuration
                  ? `${result.pagination.total} peça(s) selecionada(s)`
                  : query
                    ? `${result.pagination.total} resultado(s) para “${query}”`
                    : `${result.pagination.total} item(ns) disponível(is)`}
            </p>
          </div>

          <form
            action="/vitrine"
            method="get"
            className="flex flex-wrap items-center gap-3"
          >
            {query && <input type="hidden" name="q" value={query} />}
            {isRarePiecesCuration && (
              <input type="hidden" name="curadoria" value="pecas-raras" />
            )}

            <div className="relative">
              <select
                name="categoria"
                defaultValue={category}
                aria-label="Filtrar por categoria"
                className="h-11 min-w-[180px] appearance-none rounded-xl border border-reuse-brown/25 bg-reuse-white py-0 pl-4 pr-10 text-sm text-reuse-brown shadow-sm transition hover:border-reuse-brown/45 focus-visible:border-reuse-brown"
              >
                <option value="">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown-light"
              />
            </div>

            <div className="relative">
              <select
                name="tipo"
                defaultValue={type}
                aria-label="Filtrar por modalidade"
                className="h-11 min-w-[194px] appearance-none rounded-xl border border-reuse-brown/25 bg-reuse-white py-0 pl-4 pr-10 text-sm text-reuse-brown shadow-sm transition hover:border-reuse-brown/45 focus-visible:border-reuse-brown"
              >
                <option value="">Todas as modalidades</option>
                <option value="DOACAO">Doação</option>
                <option value="TROCA">Troca</option>
                <option value="VENDA">Venda</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown-light"
              />
            </div>

            <button
              type="submit"
              className="h-11 rounded-xl bg-reuse-pink px-5 text-sm font-semibold text-reuse-brown transition hover:bg-reuse-pink/80"
            >
              Filtrar
            </button>
          </form>
        </div>

        {!catalog.available && <CatalogUnavailable />}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-6 [&>a]:min-w-0 [&>a]:w-full [&_article]:max-w-full">
          {cards.map((product, index) => (
            <ProfileItemCard
              key={product.id}
              {...product}
              eager={index === 0}
            />
          ))}
        </div>

        {catalog.available && result.pagination.totalPages > 1 && (
          <nav aria-label="Paginação" className="mt-6 flex gap-4">
            {Array.from(
              { length: result.pagination.totalPages },
              (_, i) => i + 1,
            ).map((page) => (
              <Link
                key={page}
                aria-current={page === filters.page ? "page" : undefined}
                href={`/vitrine?${new URLSearchParams({ ...Object.fromEntries(raw), page: String(page) })}`}
              >
                {page}
              </Link>
            ))}
          </nav>
        )}
        {catalog.available && cards.length === 0 && (
          <p className="text-sm text-reuse-brown-light">
            Nenhum item disponível na vitrine ainda.
          </p>
        )}
      </main>
    </>
  );
}
