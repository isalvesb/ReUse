import { prisma } from "@/lib/prisma";
import { apiActor, apiResponse, apiError } from "@/lib/profile-api";
import { readSmallJson } from "@/lib/item-http";
import { signPhoto, cleanupPhotos } from "@/lib/item-storage.mjs";
export async function POST(request) {
  try {
    const { actor } = await apiActor(request);
    await cleanupPhotos(prisma, actor);
    return apiResponse(
      await signPhoto(prisma, actor, await readSmallJson(request)),
    );
  } catch (e) {
    return apiError(e);
  }
}
