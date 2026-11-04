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
