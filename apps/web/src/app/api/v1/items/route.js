import { prisma } from "@/lib/prisma";
import { catalogQuery, listCatalog } from "@/lib/catalog-domain.mjs";
import { apiResponse, apiError } from "@/lib/profile-api";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    return apiResponse(
      await listCatalog(
        prisma,
        catalogQuery(new URL(request.url).searchParams),
      ),
    );
  } catch (error) {
    return apiError(error);
  }
}

import { apiActor } from "@/lib/profile-api";
import { readSmallJson } from "@/lib/item-http";
import { saveItem } from "@/lib/item-write-domain.mjs";
export async function POST(request) {
  try {
    const { actor } = await apiActor(request);
    return apiResponse(
      await saveItem(prisma, actor, await readSmallJson(request)),
    );
  } catch (e) {
    return apiError(e);
  }
}
