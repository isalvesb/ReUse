import { IntegrationError } from "./profile-domain.mjs";
export async function readSmallJson(request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json")
    throw new IntegrationError(415, "JSON_REQUIRED", "Envie JSON.");
  const reader = request.body?.getReader();
  let bytes = 0,
    text = "";
  const decoder = new TextDecoder();
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 16000) {
        await reader.cancel();
        throw new IntegrationError(
          413,
          "BODY_TOO_LARGE",
          "Conteúdo excede o limite.",
        );
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  }
  if (bytes > 16000)
    throw new IntegrationError(
      413,
      "BODY_TOO_LARGE",
      "Conteúdo excede o limite.",
    );
  try {
    return JSON.parse(text);
  } catch {
    throw new IntegrationError(400, "INVALID_JSON", "JSON inválido.");
  }
}
