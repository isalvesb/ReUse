import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import ChatThread from "./ChatThread";

export const dynamic = "force-dynamic";

const conversationInclude = {
    item: { include: { images: { take: 1, orderBy: { position: "asc" } } } },
    buyer: true,
    seller: true,
    messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
};

export default async function ChatAnunciante({ searchParams }) {
    const params = await searchParams;
    const viewer = await getCurrentUser();

    if (!viewer) {
        redirect("/login");
    }

    const unreadCount = await getUnreadNotificationCount(viewer.id);

    let conversation = null;

    if (params.conversationId) {
        conversation = await prisma.conversation.findUnique({
            where: { id: params.conversationId },
            include: conversationInclude,
        });

        if (conversation && conversation.buyerId !== viewer.id && conversation.sellerId !== viewer.id) {
            conversation = null;
        }
    } else if (params.itemId) {
        const item = await prisma.item.findUnique({ where: { id: params.itemId } });

        if (item && item.sellerId !== viewer.id) {
            conversation = await prisma.conversation.upsert({
                where: { itemId_buyerId: { itemId: item.id, buyerId: viewer.id } },
                update: {},
                create: { itemId: item.id, buyerId: viewer.id, sellerId: item.sellerId },
                include: conversationInclude,
            });
        }
    }

    const conversations = await prisma.conversation.findMany({
        where: { OR: [{ buyerId: viewer.id }, { sellerId: viewer.id }] },
        include: conversationInclude,
        orderBy: { createdAt: "desc" },
    });

    return (
        <>
            <Header loggedIn avatarUrl={viewer.avatarUrl} unreadCount={unreadCount} />

            <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl gap-6 bg-reuse-cream px-6 py-10">

                {/* LISTA DE CONVERSAS */}
                <aside className="w-72 shrink-0 rounded-2xl border border-reuse-pink bg-reuse-white p-3">
                    <h2 className="mb-3 px-2 text-sm font-bold text-reuse-brown">
                        Conversas
                    </h2>

                    <div className="flex flex-col gap-1">
                        {conversations.map((conv) => {
                            const otherUser = conv.buyerId === viewer.id ? conv.seller : conv.buyer;
                            const active = conversation?.id === conv.id;
                            const lastMessage = conv.messages[conv.messages.length - 1];

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/chat-anunciante?conversationId=${conv.id}`}
                                    className={`rounded-xl px-3 py-2 text-sm transition ${active ? "bg-reuse-pink/40 font-medium" : "hover:bg-reuse-cream"
                                        }`}
                                >
                                    <p className="font-medium text-reuse-brown">
                                        {otherUser.name}
                                    </p>

                                    <p className="truncate text-xs text-reuse-brown-light">
                                        {conv.item.title}
                                    </p>

                                    {lastMessage && (
                                        <p className="truncate text-xs text-reuse-beige">
                                            {lastMessage.content}
                                        </p>
                                    )}
                                </Link>
                            );
                        })}

                        {conversations.length === 0 && (
                            <p className="px-3 py-2 text-xs text-reuse-brown-light">
                                Nenhuma conversa ainda. Acesse a página de um
                                produto e clique em &quot;Conversar&quot;.
                            </p>
                        )}
                    </div>
                </aside>

                {/* THREAD */}
                <section className="flex flex-1 flex-col rounded-2xl border border-reuse-pink bg-reuse-white">
                    {conversation ? (
                        <ChatThread key={conversation.id} conversation={conversation} viewerId={viewer.id} />
                    ) : (
                        <div className="flex flex-1 items-center justify-center p-10 text-center text-sm text-reuse-brown-light">
                            Selecione uma conversa ao lado ou acesse a partir
                            da página de um produto para começar a conversar
                            com o anunciante.
                        </div>
                    )}
                </section>

            </main>
        </>
    );
}
