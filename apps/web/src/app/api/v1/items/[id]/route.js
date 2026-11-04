import { prisma } from "@/lib/prisma";
import { catalogDetail } from "@/lib/catalog-domain.mjs";
import { apiResponse, apiError } from "@/lib/profile-api";
export const dynamic = "force-dynamic";
export async function GET(_request, { params }) {
  try {
    return apiResponse(await catalogDetail(prisma, (await params).id));
  } catch (error) {
    return apiError(error);
  }
}

import { apiActor } from "@/lib/profile-api";
import { readSmallJson } from "@/lib/item-http";
import { saveItem } from "@/lib/item-write-domain.mjs";
export async function PATCH(request, { params }) {
  try {
    const { actor } = await apiActor(request);
    return apiResponse(
      await saveItem(
        prisma,
        actor,
        await readSmallJson(request),
        (await params).id,
      ),
    );
  } catch (e) {
    return apiError(e);
  }
}
