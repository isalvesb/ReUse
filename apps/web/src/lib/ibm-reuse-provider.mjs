import { IntegrationError } from "./profile-domain.mjs";

const IAM_URL = "https://iam.cloud.ibm.com/identity/token";
const unavailable = () => new IntegrationError(503, "IBM_UNAVAILABLE", "O assistente IBM está indisponível. Nenhum anúncio foi alterado. Tente novamente mais tarde.");

export function parseIbmAnswer(content) {
  if (typeof content !== "string" || content.length > 12000) throw unavailable();
  let answer;
  try { answer = JSON.parse(content); } catch { throw unavailable(); }
  if (!answer || Array.isArray(answer) ||
      Object.keys(answer).some(k => !["text", "intent"].includes(k)) ||
      !["ORIENTAR", "PAUSAR", "RETOMAR", "DESCONHECIDO"].includes(answer.intent) ||
      typeof answer.text !== "string" || !answer.text.trim() || answer.text.length > 4000)
    throw unavailable();
  return { text: answer.text.trim(), intent: answer.intent, origin: "ibm" };
}

export function createIbmReuseProvider({ env = process.env, request = fetch, clock = Date.now } = {}) {
  let accessToken = null, tokenExpiresAt = 0;
  function configuration() {
    const deadline = Date.parse(env.REUSE_IBM_TRIAL_END_DATE || "");
    if (env.REUSE_IBM_ENABLED !== "true" || !Number.isFinite(deadline) || clock() >= deadline ||
        !env.REUSE_IBM_API_KEY) throw unavailable();
    let url;
    try { url = new URL(env.REUSE_IBM_CHAT_URL); } catch { throw unavailable(); }
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
        !/^api\.[a-z-]+\.watson-orchestrate\.cloud\.ibm\.com$/.test(url.hostname) ||
        !/^\/instances\/[a-f\d-]{36}\/v1\/orchestrate\/[a-f\d-]{36}\/chat\/completions$/.test(url.pathname))
      throw unavailable();
    return url.href;
  }
  async function iam(signal) {
    if (accessToken && clock() < tokenExpiresAt) return accessToken;
    const response = await request(IAM_URL, { method: "POST", signal, redirect: "error", cache: "no-store",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({ grant_type: "urn:ibm:params:oauth:grant-type:apikey", apikey: env.REUSE_IBM_API_KEY }),
    });
    if (!response.ok) throw unavailable();
    const data = await response.json();
    if (typeof data.access_token !== "string" || !Number.isFinite(data.expires_in) || data.expires_in <= 60)
      throw unavailable();
    accessToken = data.access_token;
    tokenExpiresAt = clock() + (Math.min(data.expires_in, 3600) - 60) * 1000;
    return accessToken;
  }
  async function message(text) {
    if (typeof text !== "string" || !text.trim() || text.trim().length > 500)
      throw new IntegrationError(400, "INVALID_MESSAGE", "Escreva uma pergunta de até 500 caracteres.");
    // Trial excludes personal data. The UI also warns against personal information.
    if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}|-----BEGIN .*PRIVATE KEY-----|\beyJ[\w-]+\.[\w-]+\.[\w-]+/i.test(text))
      throw new IntegrationError(400, "PRIVATE_INPUT", "Use somente dados fictícios, sem e-mails, senhas ou tokens.");
    const url = configuration();
    const signal = AbortSignal.timeout(35000);
    try {
      const token = await iam(signal);
      const response = await request(url, { method: "POST", signal, redirect: "error", cache: "no-store",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ stream: false, messages: [{ role: "user", content: text.trim() }] }),
      });
      if (!response.ok) {
        if (response.status === 401) { accessToken = null; tokenExpiresAt = 0; }
        throw unavailable();
      }
      const data = await response.json();
      const result = data.choices?.[0]?.message;
      if (result?.tool_calls?.length) throw unavailable();
      return parseIbmAnswer(result?.content);
    } catch { throw unavailable(); }
  }
  return { message };
}
