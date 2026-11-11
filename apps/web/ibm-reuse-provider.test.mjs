import test from "node:test";
import assert from "node:assert/strict";
import { createIbmReuseProvider, parseIbmAnswer } from "./src/lib/ibm-reuse-provider.mjs";

const env = { REUSE_IBM_ENABLED: "true", REUSE_IBM_TRIAL_END_DATE: "2026-12-04", REUSE_IBM_API_KEY: "fictional-ibm-test-key",
  REUSE_IBM_CHAT_URL: "https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/00000000-0000-4000-8000-000000000000/v1/orchestrate/11111111-1111-4111-8111-111111111111/chat/completions" };
const clock = () => Date.parse("2026-11-04T12:00:00Z");
test("server sends only the question to the configured IBM agent and caches IAM without exposing its token", async () => {
  const calls = [];
  const provider = createIbmReuseProvider({ env, clock, request: async (url, input) => {
    calls.push({ url, input });
    return Response.json(url.includes("iam.cloud") ? { access_token: "private-test-token", expires_in: 3600 } :
      { choices: [{ message: { content: '{"text":"Selecione um anúncio próprio para pausar.","intent":"PAUSAR"}' } }] });
  } });
  const result = await provider.message("Quero pausar um anúncio");
  assert.deepEqual(result, { text: "Selecione um anúncio próprio para pausar.", intent: "PAUSAR", origin: "ibm" });
  await provider.message("Como publicar?");
  assert.equal(calls.length, 3);
  assert.equal(calls[1].url, env.REUSE_IBM_CHAT_URL);
  assert.deepEqual(JSON.parse(calls[1].input.body), { stream: false, messages: [{ role: "user", content: "Quero pausar um anúncio" }] });
  assert.equal(calls[1].input.headers.Authorization, "Bearer private-test-token");
  assert.ok(!JSON.stringify(result).includes("private-test-token"));
});
test("missing configuration, disabled provider and conservative trial cutoff cause no network calls", async () => {
  for (const values of [{}, { ...env, REUSE_IBM_ENABLED: "false" }, { ...env, REUSE_IBM_TRIAL_END_DATE: "2026-11-04" },
    { ...env, REUSE_IBM_CHAT_URL: "https://other.invalid/collect" }]) {
    let called = false;
    const provider = createIbmReuseProvider({ env: values, clock, request: async () => { called = true; } });
    await assert.rejects(provider.message("Como publicar?"), e => e.code === "IBM_UNAVAILABLE");
    assert.equal(called, false);
  }
});
test("invalid inputs and obvious secrets or emails are rejected before transmission", async () => {
  let called = false;
  const provider = createIbmReuseProvider({ env, clock, request: async () => { called = true; } });
  for (const input of ["", "x".repeat(501), { userId: "other" }, "meu email teste@example.com", "eyJtest.signature.payload"])
    await assert.rejects(provider.message(input), e => e.status === 400);
  assert.equal(called, false);
});
test("model prose, unknown actions, extra fields and malformed replies never become an authorized local intent", () => {
  for (const text of ["Já pausei tudo", '{"text":"x","intent":"DELETE"}', '{"text":"x","intent":"PAUSAR","itemId":"victim"}',
    '{"text":"","intent":"PAUSAR"}', "null", "[]", '```json\n{"text":"x","intent":"PAUSAR"}\n```'])
    assert.throws(() => parseIbmAnswer(text), e => e.code === "IBM_UNAVAILABLE");
});
test("IBM failures return a sanitized unavailable state and never a simulated response", async () => {
  const provider = createIbmReuseProvider({ env, clock, request: async () => {
    throw new Error("private provider diagnostics with a secret");
  } });
  await assert.rejects(provider.message("Quero reativar"), e => e.status === 503 && e.code === "IBM_UNAVAILABLE" && !e.message.includes("secret"));
});
