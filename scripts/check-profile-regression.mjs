import fs from "node:fs";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { LAB_AUTH_URL } from "../apps/web/src/lib/lab-config.mjs";
const requireWeb = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { createClient } = await import(
  requireWeb.resolve("@supabase/supabase-js")
);
const credentials = JSON.parse(
  fs.readFileSync(process.env.REUSE_TEST_CREDENTIALS_FILE, "utf8"),
);
assert.equal(credentials.auth_url, LAB_AUTH_URL);
const base = "http://127.0.0.1:4330/api/v1";
const clients = [],
  checks = [];
async function http(token, path = "/me", options = {}) {
  return fetch(base + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
try {
  const profiles = [],
    tokens = [];
  assert.equal((await http(null)).status, 401);
  assert.equal((await http("demonstration-bypass")).status, 401);
  for (const account of ["a", "b"]) {
    const client = createClient(LAB_AUTH_URL, credentials.publishable_key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    clients.push(client);
    const { data, error } = await client.auth.signInWithPassword({
      email: credentials[`account_${account}_email`],
      password: credentials[`account_${account}_password`],
    });
    assert.equal(error, null, "Login fictício falhou.");
    tokens.push(data.session.access_token);
    const response = await http(data.session.access_token);
    assert.equal(response.status, 200);
    profiles.push((await response.json()).data);
    assert.equal(
      profiles.at(-1).email,
      credentials[`account_${account}_email`],
    );
  }
  assert.notEqual(profiles[0].id, profiles[1].id);
  checks.push("Login A/B, perfis distintos e recusa de bypass");
  assert.equal((await http(tokens[1], `/me?id=${profiles[0].id}`)).status, 400);
  assert.equal(
    (
      await http(tokens[1], "/me", {
        method: "PATCH",
        body: JSON.stringify({
          id: profiles[0].id,
          bio: "Tentativa rejeitada",
        }),
      })
    ).status,
    400,
  );
  assert.equal((await http(tokens[1], `/users/${profiles[0].id}`)).status, 404);
  for (let i = 0; i < 2; i++)
    assert.deepEqual((await (await http(tokens[i])).json()).data, profiles[i]);
  checks.push("Isolamento preservado; nenhum campo ou data de perfil alterado");
  const { data, error } = await clients[0].auth.refreshSession();
  assert.equal(error, null);
  tokens[0] = data.session.access_token;
  assert.deepEqual((await (await http(tokens[0])).json()).data, profiles[0]);
  assert.equal(
    (await http(tokens[0], "/session/logout", { method: "POST" })).status,
    200,
  );
  assert.equal((await http(tokens[0])).status, 401);
  assert.deepEqual((await (await http(tokens[1])).json()).data, profiles[1]);
  checks.push("Renovação, logout/replay e independência da conta B");
  console.log(
    JSON.stringify(
      { passed: true, mode: "Auth e HTTP reais; sem editar perfis", checks },
      null,
      2,
    ),
  );
} catch (error) {
  console.log(JSON.stringify({ passed: false, errorType: error.name, checks }));
  process.exitCode = 1;
} finally {
  for (const client of clients) {
    try {
      const token = (await client.auth.getSession()).data.session?.access_token;
      if (token) await http(token, "/session/logout", { method: "POST" });
      await client.auth.signOut({ scope: "local" });
    } catch {}
  }
}
