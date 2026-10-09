import Header from "@/components/Header";
import ProfileItemCard from "@/components/ProfileItemCard";
import { ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { formatItemForCard } from "@/lib/format";
import { RARE_PIECES_DEMO_ITEMS, demoItemFilter, demoItemOrderEntries } from "@/lib/demo-curations";

export const dynamic = "force-dynamic";

const CATEGORY_SLUGS = new Set([
    "eletronicos",
    "roupas",
    "moveis",
    "livros",
    "sapatos",
    "outros",
]);

const ITEM_TYPES = new Set(["VENDA", "TROCA", "DOACAO"]);

function firstValue(value) {
    return Array.isArray(value) ? value[0] : value;
}

export default async function Vitrine({ searchParams }) {
    const user = await getCurrentUser();
    const params = await searchParams;
    const query = String(firstValue(params?.q) ?? "").trim().slice(0, 80);
    const requestedCategory = String(firstValue(params?.categoria) ?? "");
    const requestedType = String(firstValue(params?.tipo) ?? "").toUpperCase();
    const curation = String(firstValue(params?.curadoria) ?? "");
    const isRarePiecesCuration = curation === "pecas-raras";
    const category = CATEGORY_SLUGS.has(requestedCategory) ? requestedCategory : "";
    const type = ITEM_TYPES.has(requestedType) ? requestedType : "";

    const where = {
        status: "ATIVO",
        ...(category ? { category: { slug: category } } : {}),
        ...(type ? { type } : {}),
        ...(isRarePiecesCuration ? { AND: [{ OR: RARE_PIECES_DEMO_ITEMS.map(demoItemFilter) }] } : {}),
        ...(query
            ? {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { category: { name: { contains: query, mode: "insensitive" } } },
                ],
            }
            : {}),
    };

    const items = await prisma.item.findMany({
        where,
        include: {
            images: { orderBy: { position: "asc" }, take: 1 },
            category: true,
            seller: { select: { email: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const rareOrder = new Map(demoItemOrderEntries(RARE_PIECES_DEMO_ITEMS));
    const orderedItems = isRarePiecesCuration
        ? items.sort((left, right) => {
            const leftKey = `${left.seller?.email}:${left.title}`;
            const rightKey = `${right.seller?.email}:${right.title}`;
            return rareOrder.get(leftKey) - rareOrder.get(rightKey);
        })
        : items;
    const cards = orderedItems.map(formatItemForCard);

    const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

    return (
        <>
            <Header loggedIn={!!user} avatarUrl={user?.avatarUrl} avatarKey={user?.id} unreadCount={unreadCount} />

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-reuse-brown">Vitrine</h1>
                        <p className="mt-2 text-sm text-reuse-brown-light">
                            {isRarePiecesCuration
                                ? `${cards.length} peça(s) selecionada(s)`
                                : query
                                ? `${cards.length} resultado(s) para “${query}”`
                                : `${cards.length} item(ns) disponível(is)`}
                        </p>
                    </div>

                    <form action="/vitrine" method="get" className="flex flex-wrap items-center gap-3">
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
                                <option value="eletronicos">Eletrônicos</option>
                                <option value="roupas">Roupas</option>
                                <option value="moveis">Móveis</option>
                                <option value="livros">Livros</option>
                                <option value="sapatos">Sapatos</option>
                                <option value="outros">Outros</option>
                            </select>
                            <ChevronDown aria-hidden="true" size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown-light" />
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
                            <ChevronDown aria-hidden="true" size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown-light" />
                        </div>

                        <button
                            type="submit"
                            className="h-11 rounded-xl bg-reuse-pink px-5 text-sm font-semibold text-reuse-brown transition hover:bg-reuse-pink/80"
                        >
                            Filtrar
                        </button>
                    </form>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-6">
                    {cards.map((product, index) => (
                        <ProfileItemCard
                            key={product.id}
                            {...product}
                            eager={index === 0}
                        />
                    ))}
                </div>

                {cards.length === 0 && (
                    <p className="text-sm text-reuse-brown-light">
                        Nenhum item disponível na vitrine ainda.
                    </p>
                )}
            </main>
        </>
    );
}
