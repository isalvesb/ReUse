"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export async function markAllAsRead() {
    const userId = await getCurrentUserId();

    if (!userId) {
        return;
    }

    await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });

    revalidatePath("/notificacoes");
}
