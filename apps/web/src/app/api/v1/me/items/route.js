import { prisma } from "@/lib/prisma";
import { apiActor, apiResponse, apiError } from "@/lib/profile-api";
import { readSmallJson } from "@/lib/item-http";
import { ownItem } from "@/lib/item-write-domain.mjs";
import { photoUrl } from "@/lib/item-storage.mjs";
export async function GET(request) {
  try {
    const { actor } = await apiActor(request),
      id = new URL(request.url).searchParams.get("id");
    if (id) {
      const item = await ownItem(prisma, actor, id);
      return apiResponse({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        condition: item.condition,
        status: item.status,
        location: item.location,
        category: {
          id: item.category.id,
          slug: item.category.slug,
          name: item.category.name,
        },
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
        price: item.price?.toString() ?? null,
        photos: await Promise.all(
          item.images.map(async (image) => ({
            id: image.id,
            preview: image.uploadId
              ? await photoUrl(
                  (
                    await prisma.itemUpload.findUnique({
                      where: { id: image.uploadId },
                    })
                  ).storageKey,
                )
              : image.url,
          })),
        ),
      });
    }
    return apiResponse(
      await prisma.item.findMany({
        where: { sellerId: actor.userId },
        select: { id: true, title: true, status: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request) {
  try {
    await apiActor(request);
    const { randomUUID } = await import("node:crypto");
    return apiResponse({ creationKey: randomUUID() });
  } catch (e) {
    return apiError(e);
  }
}
