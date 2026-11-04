import { prisma } from "@/lib/prisma";
import { apiActor, apiError } from "@/lib/profile-api";
import { getSession } from "@/lib/session";
import { photoUrl } from "@/lib/item-storage.mjs";
export async function GET(request, { params }) {
  try {
    const id = (await params).id;
    const image = await prisma.itemImage.findUnique({
      where: { uploadId: id },
      include: { item: { select: { status: true, sellerId: true } } },
    });
    if (!image) return new Response(null, { status: 404 });
    if (image.item.status !== "ATIVO") {
      let actor;
      try {
        actor = request.headers.has("authorization")
          ? (await apiActor(request)).actor
          : await getSession();
      } catch {}
      if (actor?.userId !== image.item.sellerId)
        return new Response(null, { status: 404 });
    }
    const upload = await prisma.itemUpload.findUnique({ where: { id } });
    if (!upload?.storageKey) return new Response(null, { status: 404 });
    return new Response(null, {
      status: 302,
      headers: {
        Location: await photoUrl(upload.storageKey),
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
