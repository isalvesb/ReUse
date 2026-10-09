import { redirect } from "next/navigation";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import Header from "@/components/Header";
import EditarPerfilClient from "./EditarPerfilClient";

export const dynamic = "force-dynamic";

export default async function EditarPerfilPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const unreadCount = await getUnreadNotificationCount(user.id);

    return (
        <main className="min-h-screen bg-reuse-cream">
            <Header loggedIn avatarUrl={user.avatarUrl} avatarKey={user.id} unreadCount={unreadCount} />

            <EditarPerfilClient
                user={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    location: user.location,
                    bio: user.bio,
                    avatarUrl: user.avatarUrl,
                }}
            />
        </main>
    );
}
