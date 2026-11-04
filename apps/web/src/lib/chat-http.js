import { apiActor, apiError, apiResponse } from "./profile-api";
import { consumeRateLimit } from "./rate-limit";
import { IntegrationError } from "./profile-domain.mjs";
export async function chatHttp(request, run, scope = "chat-read") {
  try {
    const { actor } = await apiActor(request);
    const rate = await consumeRateLimit({
      scope,
      identifier: actor.userId,
      limit: scope === "chat-read" ? 180 : 60,
      windowMs: 60000,
    });
    if (!rate.allowed)
      throw new IntegrationError(
        429,
        "RATE_LIMIT",
        "Muitas solicitações. Aguarde um momento.",
      );
    return apiResponse(await run(actor));
  } catch (e) {
    return apiError(e);
  }
}
