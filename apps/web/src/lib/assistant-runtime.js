import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { getSession } from "./session";
import { apiActor, apiError, apiResponse } from "./profile-api";
import { IntegrationError } from "./profile-domain.mjs";
import { readSmallJson } from "./item-http";
import { consumeRateLimit } from "./rate-limit";
import { createAssistantItemDomain } from "./assistant-item-domain.mjs";
import { createIbmReuseProvider } from "./ibm-reuse-provider.mjs";
import { assertAssistantCookieOrigin, validateAssistantInput } from "./assistant-request.mjs";

const provider = createIbmReuseProvider();
export async function assistantRequest(request, operation) {
  try {
    let actor;
    if (request.headers.has("authorization")) ({ actor } = await apiActor(request));
    else {
      assertAssistantCookieOrigin(request);
      actor = await getSession();
      if (!actor) throw new IntegrationError(401, "UNAUTHENTICATED", "Entre novamente para continuar.");
    }
    const input = validateAssistantInput(await readSmallJson(request), operation);
    const rate = await consumeRateLimit({ scope: `assistant-v1-${operation}`, identifier: actor.userId,
      limit: operation === "messages" ? 10 : 30, windowMs: 60000 });
    if (!rate.allowed) throw new IntegrationError(429, "RATE_LIMITED", "Aguarde um minuto antes de tentar novamente.");
    const domain = createAssistantItemDomain({ db: prisma, secret: process.env.ASSISTANT_CONFIRMATION_SECRET });
    if (operation === "messages") {
      const answer = await provider.message(input.message);
      const proposal = ["PAUSAR", "RETOMAR"].includes(answer.intent) ? await domain.propose(actor, answer.intent) : null;
      return apiResponse({ ...answer, proposal });
    }
    if (operation === "selection") return apiResponse(await domain.prepare(actor, input.proposalToken, input.itemId));
    const result = await domain.decide(actor, input.confirmationToken, input.decision);
    if (!result.cancelled) {
      revalidatePath("/perfil");
      revalidatePath("/vitrine");
      revalidatePath("/");
    }
    return apiResponse(result);
  } catch (error) { return apiError(error); }
}
