import { prisma } from "@/lib/prisma";
import { chatHttp } from "@/lib/chat-http";
import { chatQuery, listNotifications } from "@/lib/chat-domain.mjs";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(req) {
  return chatHttp(req, (actor) =>
    listNotifications(prisma, actor, chatQuery(new URL(req.url).searchParams)),
  );
}
