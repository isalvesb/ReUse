"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import NotificationCard from "./NotificationCard";
import Link from "next/link";
import useNotificationPolling from "./useNotificationPolling";
import { markAllAsRead, readNotificationSnapshot } from "@/app/notificacoes/actions";

export default function NotificationRefresh({ user, initial, cursor }) {
  const router = useRouter();
  const read = useCallback(async () => {
    const snapshot = await readNotificationSnapshot(user.id, cursor, true);
    if (!snapshot) {
      router.refresh(); // Reconcile changed/ended identity, not routine polling.
      return { items: [], unreadCount: 0, nextCursor: null };
    }
    return snapshot;
  }, [user.id, cursor, router]);
  const { items: notifications, unreadCount, nextCursor } = useNotificationPolling({ userId: user.id, initial, read });
  return (
    <>
      <Header
        loggedIn
        pollNotifications={false}
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
