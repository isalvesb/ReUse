import { actorForToken } from "./authenticated-profile";
import { IntegrationError } from "./profile-domain.mjs";
export async function apiActor(request) {
    const token = /^Bearer ([^\s]+)$/i.exec(request.headers.get("authorization") ?? "")?.[1];
    if (!token) throw new IntegrationError(401, "UNAUTHENTICATED", "Envie uma sessão válida.");
    return { actor: await actorForToken(token), token };
}
export function apiResponse(data) {
    return Response.json({ data }, { headers: { "Cache-Control": "private, no-store" } });
}
export function apiError(error) {
    return Response.json({ error: { code: error instanceof IntegrationError ? error.code : "SERVICE_UNAVAILABLE",
        message: error instanceof IntegrationError ? error.message : "Serviço temporariamente indisponível." } },
    { status: error instanceof IntegrationError ? error.status : 503, headers: { "Cache-Control": "private, no-store" } });
}
