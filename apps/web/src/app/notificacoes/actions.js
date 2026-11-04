"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/chat-domain.mjs";
export async function markAllAsRead() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  await markAllNotificationsRead(prisma, { userId });
  revalidatePath("/notificacoes");
}
export async function openNotification(formData) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const id = String(formData.get("id") || "");
  const n = await prisma.notification.findFirst({
    where: { id, userId },
    select: { id: true, conversationId: true, itemId: true },
  });
  if (!n) return;
  await markNotificationRead(prisma, { userId }, n.id);
  revalidatePath("/notificacoes");
  redirect(
    n.conversationId
      ? `/chat?conversationId=${n.conversationId}`
      : n.itemId
        ? `/produto/${n.itemId}`
        : "/notificacoes",
  );
}
export async function unreadNotifications() {
  const userId = await getCurrentUserId();
  return userId
    ? prisma.notification.count({ where: { userId, read: false } })
    : 0;
}
