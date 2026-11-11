import { consumeRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { chatHttp } from "@/lib/chat-http";
import { readSmallJson } from "@/lib/item-http";
import {
  chatQuery,
  listConversations,
  startConversation,
} from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(req) {
  return chatHttp(req, (actor) =>
    listConversations(prisma, actor, chatQuery(new URL(req.url).searchParams)),
  );
}
export async function POST(req) {
  return chatHttp(
    req,
    async (actor) =>
      startConversation(
        prisma,
        actor,
        await readSmallJson(req),
        consumeRateLimit,
      ),
    "chat-write",
  );
}
