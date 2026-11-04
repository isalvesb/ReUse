import { prisma } from "@/lib/prisma";
import { chatHttp } from "@/lib/chat-http";
import { readSmallJson } from "@/lib/item-http";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  chatQuery,
  listMessages,
  sendChatMessage,
} from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(req, { params }) {
  const { id } = await params;
  return chatHttp(req, (actor) =>
    listMessages(prisma, actor, id, chatQuery(new URL(req.url).searchParams)),
  );
}
export async function POST(req, { params }) {
  const { id } = await params;
  return chatHttp(
    req,
    async (actor) =>
      sendChatMessage(
        prisma,
        actor,
        id,
        await readSmallJson(req),
        consumeRateLimit,
      ),
    "chat-write",
  );
}
