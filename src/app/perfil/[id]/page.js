import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { prisma } from "@/lib/prisma";
import {
    getCurrentUser,
    getUnreadNotificationCount,
} from "@/lib/current-user";

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

    /*
     * Transformamos os dados do Prisma para o formato
     * que o seu PerfilClient/ProfileItemCard já utiliza.
     */
    const items = user.items.map((item) => ({
        id: item.id,
        name: item.title,
        condition: item.condition,
        distance: item.location || "",
        type: item.type,
        negotiationType: item.type,
        price: item.price ? Number(item.price) : null,
        image:
            item.images[0]?.url ||
            "/images/itens/cadeira.png",
    }));

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
        })
        : null;

    const publicUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        bio: user.bio,
        memberSince,
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