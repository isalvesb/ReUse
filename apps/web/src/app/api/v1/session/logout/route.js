import { apiActor, apiError, apiResponse } from "@/lib/profile-api";
import { endTokenSession } from "@/lib/authenticated-profile";
export const runtime = "nodejs";
export async function POST(request) {
    try {
        const { actor, token } = await apiActor(request);
        await endTokenSession(token, actor);
        return apiResponse({ signedOut: true });
    } catch (error) { return apiError(error); }
}
