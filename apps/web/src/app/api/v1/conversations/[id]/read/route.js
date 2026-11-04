import { prisma } from "@/lib/prisma";
import { chatHttp } from "@/lib/chat-http";
import { readSmallJson } from "@/lib/item-http";
import { markConversationRead } from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req, { params }) {
  const { id } = await params;
  return chatHttp(
    req,
    async (actor) =>
      markConversationRead(prisma, actor, id, await readSmallJson(req)),
    "chat-write",
  );
}
