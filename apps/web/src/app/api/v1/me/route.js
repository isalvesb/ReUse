import { prisma } from "@/lib/prisma";
import { apiActor, apiError, apiResponse } from "@/lib/profile-api";
import { IntegrationError, readOwnProfile, updateOwnProfile } from "@/lib/profile-domain.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request) {
    try {
        if (new URL(request.url).search) throw new IntegrationError(400, "INVALID_QUERY", "Este contrato consulta somente o próprio perfil, sem parâmetros.");
        const { actor } = await apiActor(request);
        return apiResponse(await readOwnProfile(prisma, actor));
    } catch (error) { return apiError(error); }
}
export async function PATCH(request) {
    try {
        const { actor } = await apiActor(request);
        if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
            throw new IntegrationError(415, "JSON_REQUIRED", "Envie JSON.");
        }
        const body = await request.text();
        if (body.length > 16000) throw new IntegrationError(413, "BODY_TOO_LARGE", "Conteúdo excede o limite.");
        let input;
        try { input = JSON.parse(body); } catch { throw new IntegrationError(400, "INVALID_JSON", "JSON inválido."); }
        return apiResponse(await updateOwnProfile(prisma, actor, input));
    } catch (error) { return apiError(error); }
}
