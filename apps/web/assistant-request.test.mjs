import test from "node:test";
import assert from "node:assert/strict";
import { validateAssistantInput, assertAssistantCookieOrigin } from "./src/lib/assistant-request.mjs";

test("assistant contracts never accept client owner, session or intention claims", () => {
  for (const [operation, input] of [["messages", { message: "Ajuda", userId: "other" }],
    ["selection", { proposalToken: "signed", itemId: "chosen", intent: "PAUSAR" }],
    ["confirm", { confirmationToken: "signed", decision: "confirm", sessionId: "other" }],
    ["messages", []], ["messages", { message: { sql: "untrusted" } }]])
    assert.throws(() => validateAssistantInput(input, operation), e => e.status === 400);
  assert.deepEqual(validateAssistantInput({ message: "Ajuda" }, "messages"), { message: "Ajuda" });
});
test("cookie requests require the exact application origin", () => {
  for (const origin of [null, "https://foreign.invalid", "http://localhost:4330"])
    assert.throws(() => assertAssistantCookieOrigin(new Request("http://127.0.0.1:4330/api/v1/assistant/confirm", {
      method: "POST", headers: origin ? { origin } : {},
    })), e => e.status === 403);
  assert.doesNotThrow(() => assertAssistantCookieOrigin(new Request("http://127.0.0.1:4330/api/v1/assistant/messages", {
    method: "POST", headers: { origin: "http://127.0.0.1:4330" },
  })));
});
test("canonical origin works when Next represents loopback by another local host name", () => {
  const request = new Request("http://localhost:4330/api/v1/assistant/messages", {
    method: "POST", headers: { origin: "http://127.0.0.1:4330", "x-forwarded-host": "untrusted.invalid" },
  });
  assert.doesNotThrow(() => assertAssistantCookieOrigin(request, "http://127.0.0.1:4330"));
  assert.throws(() => assertAssistantCookieOrigin(request, "https://other.invalid"), e => e.status === 403);
});
