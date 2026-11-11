import { redirect } from "next/navigation";
import NotificationRefresh from "@/components/NotificationRefresh";
import { listNotifications, chatQuery } from "@/lib/chat-domain.mjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
export const dynamic = "force-dynamic";
export default async function Notificacoes({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const params = await searchParams;
  let query;
  let cursor = params?.cursor ? String(params.cursor) : null;
  try {
    query = chatQuery(
      new URLSearchParams(
        cursor ? { cursor } : {},
      ),
    );
  } catch {
    query = {};
    cursor = null;
  }
  const snapshot = await listNotifications(prisma, { userId: user.id }, query);
  return <NotificationRefresh user={{ id: user.id, avatarUrl: user.avatarUrl }} initial={snapshot} cursor={cursor} />;
}
