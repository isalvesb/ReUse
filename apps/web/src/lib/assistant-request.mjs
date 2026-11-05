import { IntegrationError } from "./profile-domain.mjs";

export function validateAssistantInput(input, operation) {
  const fields = { messages: ["message"], selection: ["proposalToken", "itemId"], confirm: ["confirmationToken", "decision"] }[operation];
  if (!fields || !input || Array.isArray(input) || typeof input !== "object" ||
      Object.keys(input).length !== fields.length || fields.some(k => typeof input[k] !== "string") ||
      Object.keys(input).some(k => !fields.includes(k)) || fields.some(k => !input[k] || input[k].length > 4096))
    throw new IntegrationError(400, "INVALID_REQUEST", "Confira os dados da solicitação.");
  return input;
}

export function assertAssistantCookieOrigin(request, configuredOrigin = process.env.NEXT_PUBLIC_APP_URL) {
  // Next may represent loopback requests internally as localhost instead of 127.0.0.1.
  // Use the configured application origin, never a client-supplied forwarded host.
  const expected = new URL(configuredOrigin || request.url).origin;
  if (request.headers.get("origin") !== expected)
    throw new IntegrationError(403, "INVALID_ORIGIN", "Origem da solicitação inválida.");
}
