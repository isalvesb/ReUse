import { redirect } from "next/navigation";
import Header from "@/components/Header";
import NotificationCard from "@/components/NotificationCard";
import Link from "next/link";
import NotificationRefresh from "@/components/NotificationRefresh";
import { listNotifications, chatQuery } from "@/lib/chat-domain.mjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { markAllAsRead } from "./actions";
export const dynamic = "force-dynamic";
export default async function Notificacoes({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const params = await searchParams;
  let query;
  try {
    query = chatQuery(
      new URLSearchParams(
        params?.cursor ? { cursor: String(params.cursor) } : {},
      ),
    );
  } catch {
    query = {};
  }
  const {
    items: notifications,
    unreadCount,
    nextCursor,
  } = await listNotifications(prisma, { userId: user.id }, query);
  return (
    <>
      <NotificationRefresh />
      <Header
        loggedIn
        avatarUrl={user.avatarUrl}
        avatarKey={user.id}
        unreadCount={unreadCount}
      />

      <main className="mx-auto min-h-screen w-full max-w-2xl bg-reuse-cream px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-reuse-brown">Notificações</h1>

          {unreadCount > 0 && (
            <form action={markAllAsRead}>
              <button
                type="submit"
                className="text-sm font-medium text-reuse-brown underline"
              >
                Marcar todas como lidas
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              id={notification.id}
              conversationId={notification.conversationId}
              message={notification.message}
              read={notification.read}
              createdAt={notification.createdAt}
              itemId={notification.itemId}
            />
          ))}

          {nextCursor && (
            <Link
              href={`/notificacoes?cursor=${encodeURIComponent(nextCursor)}`}
              className="underline"
            >
              Mais notificações
            </Link>
          )}
          {notifications.length === 0 && (
            <p className="text-sm text-reuse-brown-light">
              Você ainda não tem notificações.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
