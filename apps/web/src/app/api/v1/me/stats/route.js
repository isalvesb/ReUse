import { prisma } from "@/lib/prisma";
import { apiActor, apiError, apiResponse } from "@/lib/profile-api";
import {
  IntegrationError,
  readOwnItemStatistics,
} from "@/lib/profile-domain.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    if (new URL(request.url).search)
      throw new IntegrationError(
        400,
        "INVALID_QUERY",
        "Este contrato consulta somente os próprios anúncios, sem parâmetros.",
      );
    const { actor } = await apiActor(request);
    return apiResponse(await readOwnItemStatistics(prisma, actor));
  } catch (error) {
    return apiError(error);
  }
}
