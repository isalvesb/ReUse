import { prisma } from "@/lib/prisma";
import { chatHttp } from "@/lib/chat-http";
import { markAllNotificationsRead } from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req) {
  return chatHttp(
    req,
    (actor) => markAllNotificationsRead(prisma, actor),
    "chat-write",
  );
}
