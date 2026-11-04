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
