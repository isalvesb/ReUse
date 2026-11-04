import { prisma } from "@/lib/prisma";
import { listCategories } from "@/lib/catalog-domain.mjs";
import { apiResponse, apiError } from "@/lib/profile-api";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return apiResponse(await listCategories(prisma));
  } catch (error) {
    return apiError(error);
  }
}
