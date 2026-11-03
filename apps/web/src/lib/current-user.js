import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export async function getCurrentUser() {
    const userId = await getCurrentUserId();

    if (!userId) {
        return null;
    }

    return prisma.user.findUnique({ where: { id: userId } });
}

export async function getUnreadNotificationCount(userId) {
    if (!userId) {
        return 0;
    }

    return prisma.notification.count({ where: { userId, read: false } });
}
