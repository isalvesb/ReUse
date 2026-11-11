import { prisma } from "@/lib/prisma";
import { apiActor, apiError } from "@/lib/profile-api";
import { getSession } from "@/lib/session";
import { photoUrl } from "@/lib/item-storage.mjs";
import { authorizedPhotoUrl } from "@/lib/image-access.mjs";
export const dynamic = "force-dynamic";
export async function GET(request, { params }) {
  try {
    const id = (await params).id;
    const location = await authorizedPhotoUrl(prisma, id, async () =>
      request.headers.has("authorization") ? (await apiActor(request)).actor : getSession(), photoUrl);
    if (!location) return new Response(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
    return new Response(null, {
      status: 302,
      headers: {
        Location: location,
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
