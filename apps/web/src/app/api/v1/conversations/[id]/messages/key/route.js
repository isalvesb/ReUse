import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { chatHttp } from "@/lib/chat-http";
import { requireConversation } from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
export async function POST(req, { params }) {
  const { id } = await params;
  return chatHttp(
    req,
    async (actor) => {
      await requireConversation(prisma, actor, id);
      return { clientKey: randomUUID() };
    },
    "chat-write",
  );
}
