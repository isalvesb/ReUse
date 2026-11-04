import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatClient from "./ChatClient";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import {
  listConversations,
  listMessages,
  getConversation,
  chatQuery,
} from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
const first = (v) => (Array.isArray(v) ? v[0] : v);
export default async function ChatPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const actor = { userId: user.id };
  const params = await searchParams;
  const cursor = first(params?.cursor);
  let query;
  try {
    query = chatQuery(new URLSearchParams(cursor ? { cursor } : {}));
  } catch {
    query = { limit: 30, cursor: null };
  }
  const [page, unreadCount] = await Promise.all([
    listConversations(prisma, actor, query),
    getUnreadNotificationCount(user.id),
  ]);
  const conversations = page.items;
  let selected = String(first(params?.conversationId) || "");
  if (selected && !conversations.some((c) => c.id === selected)) {
    try {
      conversations.unshift(await getConversation(prisma, actor, selected));
    } catch {
      selected = "";
    }
  }
  const itemId = String(first(params?.itemId) || "");
  if (itemId) {
    const existing = await prisma.conversation.findUnique({
      where: { itemId_buyerId: { itemId, buyerId: user.id } },
      select: { id: true },
    });
    if (existing) redirect(`/chat?conversationId=${existing.id}`);
    const item = await prisma.item.findFirst({
      where: { id: itemId, status: "ATIVO", NOT: { sellerId: user.id } },
      select: {
        id: true,
        title: true,
        seller: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
    if (item) {
      selected = `new:${item.id}`;
      conversations.unshift({
        id: selected,
        itemId: item.id,
        itemTitle: item.title,
        participant: item.seller,
        preview: `Inicie uma conversa sobre ${item.title}`,
        lastActivity: new Date().toISOString(),
        unreadCount: 0,
      });
    }
  }
  if (!selected && conversations.length) selected = conversations[0].id;
  let history = { items: [], nextCursor: null };
  if (selected && !selected.startsWith("new:"))
    history = await listMessages(prisma, actor, selected);
  const rows = conversations.map((c) => ({
    ...c,
    name: c.participant.name,
    image: c.participant.avatarUrl,
    avatarKey: c.participant.id,
    messages:
      c.id === selected
        ? history.items.map((m) => ({ ...m, text: m.content }))
        : [],
  }));
  return (
    <div className="min-h-screen bg-[#F9EEDC]">
      <Header
        loggedIn
        avatarUrl={user.avatarUrl}
        avatarKey={user.id}
        unreadCount={unreadCount}
      />
      <ChatClient
        initialClientKey={randomUUID()}
        conversations={rows}
        initialConversationId={selected}
        historyCursor={history.nextCursor}
        nextConversationCursor={page.nextCursor}
      />
      <Footer />
    </div>
  );
}
