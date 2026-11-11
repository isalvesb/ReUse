import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const getCurrentUser = cache(async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;
    // The verified actor already contains the selected database profile.
    return { ...session.profile, createdAt: new Date(session.profile.createdAt), updatedAt: new Date(session.profile.updatedAt) };
});

export async function getUnreadNotificationCount(userId) {
    if (!userId) {
        return 0;
    }

    return prisma.notification.count({ where: { userId, read: false } });
}
