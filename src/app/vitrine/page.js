import Header from "@/components/Header";
import ProfileItemCard from "@/components/ProfileItemCard";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { formatItemForCard } from "@/lib/format";

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
    const category = CATEGORY_SLUGS.has(requestedCategory) ? requestedCategory : "";
    const type = ITEM_TYPES.has(requestedType) ? requestedType : "";

    const where = {
        status: "ATIVO",
        ...(category ? { category: { slug: category } } : {}),
        ...(type ? { type } : {}),
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
        },
        orderBy: { createdAt: "desc" },
    });

    const cards = items.map(formatItemForCard);

    const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

    return (
        <>
            <Header loggedIn={!!user} avatarUrl={user?.avatarUrl} avatarKey={user?.id} unreadCount={unreadCount} />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-reuse-brown">Vitrine</h1>
                        <p className="mt-2 text-sm text-reuse-brown-light">
                            {query
                                ? `${cards.length} resultado(s) para “${query}”`
                                : `${cards.length} item(ns) disponível(is)`}
                        </p>
                    </div>

                    <form action="/vitrine" method="get" className="flex flex-wrap gap-3">
                        {query && <input type="hidden" name="q" value={query} />}

                        <select
                            name="categoria"
                            defaultValue={category}
                            aria-label="Filtrar por categoria"
                            className="rounded-xl border border-reuse-brown/20 bg-reuse-white px-4 py-2 text-sm text-reuse-brown"
                        >
                            <option value="">Todas as categorias</option>
                            <option value="eletronicos">Eletrônicos</option>
                            <option value="roupas">Roupas</option>
                            <option value="moveis">Móveis</option>
                            <option value="livros">Livros</option>
                            <option value="sapatos">Sapatos</option>
                            <option value="outros">Outros</option>
                        </select>

                        <select
                            name="tipo"
                            defaultValue={type}
                            aria-label="Filtrar por modalidade"
                            className="rounded-xl border border-reuse-brown/20 bg-reuse-white px-4 py-2 text-sm text-reuse-brown"
                        >
                            <option value="">Todas as modalidades</option>
                            <option value="DOACAO">Doação</option>
                            <option value="TROCA">Troca</option>
                            <option value="VENDA">Venda</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-reuse-pink px-5 py-2 text-sm font-semibold text-reuse-brown"
                        >
                            Filtrar
                        </button>
                    </form>
                </div>

                <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 sm:justify-items-start lg:grid-cols-6">
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
