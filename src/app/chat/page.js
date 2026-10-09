import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatClient from "./ChatClient";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";

export const dynamic = "force-dynamic";

function firstValue(value) {
    return Array.isArray(value) ? value[0] : value;
}

function serializeConversation(conversation, userId) {
    const otherUser = conversation.buyerId === userId
        ? conversation.seller
        : conversation.buyer;
    const orderedMessages = [...conversation.messages].reverse();
    const lastMessage = orderedMessages.at(-1);

    return {
        id: conversation.id,
        itemId: conversation.itemId,
        itemTitle: conversation.item.title,
        name: otherUser.name,
        image: otherUser.avatarUrl,
        avatarKey: otherUser.id,
        preview: lastMessage?.content || `Conversa sobre ${conversation.item.title}`,
        messages: orderedMessages.map((message) => ({
            id: message.id,
            text: message.content,
            createdAt: message.createdAt.toISOString(),
            sender: message.senderId === userId ? "me" : "other",
        })),
        lastActivity: (lastMessage?.createdAt || conversation.createdAt).toISOString(),
    };
}

export default async function ChatPage({ searchParams }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const params = await searchParams;
    const requestedConversationId = String(firstValue(params?.conversationId) || "");
    const requestedItemId = String(firstValue(params?.itemId) || "");

    const [rows, unreadCount] = await Promise.all([
        prisma.conversation.findMany({
            where: {
                OR: [
                    { buyerId: user.id },
                    { sellerId: user.id },
                ],
            },
            include: {
                buyer: { select: { id: true, name: true, avatarUrl: true } },
                seller: { select: { id: true, name: true, avatarUrl: true } },
                item: { select: { id: true, title: true, status: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 100,
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        getUnreadNotificationCount(user.id),
    ]);

    const conversations = rows.map((row) => serializeConversation(row, user.id));
    let selectedConversationId = conversations.some(
        (conversation) => conversation.id === requestedConversationId
    )
        ? requestedConversationId
        : "";

    if (requestedItemId) {
        const existing = conversations.find(
            (conversation) => conversation.itemId === requestedItemId
        );

        if (existing) {
            selectedConversationId = existing.id;
        } else {
            const item = await prisma.item.findFirst({
                where: {
                    id: requestedItemId,
                    status: "ATIVO",
                    NOT: { sellerId: user.id },
                },
                select: {
                    id: true,
                    title: true,
                    seller: {
                        select: { id: true, name: true, avatarUrl: true },
                    },
                },
            });

            if (item) {
                const draftId = `new:${item.id}`;
                conversations.unshift({
                    id: draftId,
                    itemId: item.id,
                    itemTitle: item.title,
                    name: item.seller.name,
                    image: item.seller.avatarUrl,
                    avatarKey: item.seller.id,
                    preview: `Inicie uma conversa sobre ${item.title}`,
                    messages: [],
                    lastActivity: new Date().toISOString(),
                });
                selectedConversationId = draftId;
            }
        }
    }

    conversations.sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));

    if (!selectedConversationId && conversations.length > 0) {
        selectedConversationId = conversations[0].id;
    }

    return (
        <div className="min-h-screen bg-[#F9EEDC]">
            <Header
                loggedIn
                avatarUrl={user.avatarUrl}
                avatarKey={user.id}
                unreadCount={unreadCount}
            />

            <ChatClient
                key={selectedConversationId || "empty"}
                conversations={conversations}
                initialConversationId={selectedConversationId}
            />

            <Footer />
        </div>
    );
}
