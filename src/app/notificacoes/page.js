import { redirect } from "next/navigation";
import Header from "@/components/Header";
import NotificationCard from "@/components/NotificationCard";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { markAllAsRead } from "./actions";

export const dynamic = "force-dynamic";

export default async function Notificacoes() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return (
        <>
            <Header loggedIn avatarUrl={user.avatarUrl} unreadCount={unreadCount} />

            <main className="mx-auto min-h-screen w-full max-w-2xl bg-reuse-cream px-6 py-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-reuse-brown">
                        Notificações
                    </h1>

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
                            message={notification.message}
                            read={notification.read}
                            createdAt={notification.createdAt}
                            itemId={notification.itemId}
                        />
                    ))}

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
