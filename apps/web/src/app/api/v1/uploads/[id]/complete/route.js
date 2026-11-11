import { prisma } from "@/lib/prisma";
import { apiActor, apiResponse, apiError } from "@/lib/profile-api";
import { readSmallJson } from "@/lib/item-http";
import { verifyPhoto } from "@/lib/item-storage.mjs";
export async function POST(request, { params }) {
  try {
    const { actor } = await apiActor(request);
    return apiResponse(await verifyPhoto(prisma, actor, (await params).id));
  } catch (e) {
    return apiError(e);
  }
}
