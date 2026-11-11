import { prisma } from "@/lib/prisma";
import { chatHttp } from "@/lib/chat-http";
import { markNotificationRead } from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req, { params }) {
  const { id } = await params;
  return chatHttp(
    req,
    (actor) => markNotificationRead(prisma, actor, id),
    "chat-write",
  );
}
