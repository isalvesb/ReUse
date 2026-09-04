import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { formatItemForCard } from "@/lib/format";
import PerfilClient from "./PerfilClient";

export const dynamic = "force-dynamic";

export default async function Perfil() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const items = await prisma.item.findMany({
        where: { sellerId: user.id },
        include: {
            images: { orderBy: { position: "asc" }, take: 1 },
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const cards = items.map((item) => ({
        ...formatItemForCard(item),
        negotiationType: item.type,
    }));

    const unreadCount = await getUnreadNotificationCount(user.id);

    return (
        <>
            <Header loggedIn avatarUrl={user.avatarUrl} unreadCount={unreadCount} />

            <PerfilClient
                user={{
                    name: user.name,
                    email: user.email,
                    location: user.location,
                    bio: user.bio,
                    avatarUrl: user.avatarUrl,
                    rating: user.rating,
                    memberSince: user.createdAt,
                }}
                items={cards}
            />
        </>
    );
}
