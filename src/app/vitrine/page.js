import Header from "@/components/Header";
import ProfileItemCard from "@/components/ProfileItemCard";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { formatItemForCard } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Vitrine() {
    const user = await getCurrentUser();

    const items = await prisma.item.findMany({
        where: { status: "ATIVO" },
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
            <Header loggedIn={!!user} avatarUrl={user?.avatarUrl} unreadCount={unreadCount} />

            <main className="mx-auto max-w-7xl px-6 py-10">

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
                    {cards.map((product) => (
                        <ProfileItemCard
                            key={product.id}
                            {...product}
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
