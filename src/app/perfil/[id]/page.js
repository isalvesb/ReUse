import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { prisma } from "@/lib/prisma";
import {
    getCurrentUser,
    getUnreadNotificationCount,
} from "@/lib/current-user";
import { formatItemForCard } from "@/lib/format";

import PerfilPublicoClient from "./PerfilPublicoClient";

export const dynamic = "force-dynamic";

export default async function PerfilUsuario({ params }) {
    const { id } = await params;

    const [user, viewer] = await Promise.all([
        prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                items: {
                    where: {
                        status: "ATIVO",
                    },
                    include: {
                        images: {
                            orderBy: {
                                position: "asc",
                            },
                            take: 1,
                        },
                        category: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        }),

        getCurrentUser(),
    ]);

    if (!user) {
        notFound();
    }

    const unreadCount = viewer
        ? await getUnreadNotificationCount(viewer.id)
        : 0;

    const items = user.items.map((item) => ({
        ...formatItemForCard(item),
        negotiationType: item.type,
    }));

    const publicUser = {
        id: user.id,
        name: user.name,
        location: user.location,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        bio: user.bio,
        memberSince: user.createdAt,
    };

    return (
        <>
            <Header
                loggedIn={!!viewer}
                avatarUrl={viewer?.avatarUrl}
                unreadCount={unreadCount}
            />

            <PerfilPublicoClient
                user={publicUser}
                items={items}
            />

            <Footer />
        </>
    );
}
