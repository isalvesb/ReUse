const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, globals = {}) {
  const scope = { exports: {}, console, Date, Math, Map, Set, Promise, URL, AbortSignal, __DEV__: true, ...globals };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, scope);
  return scope.exports;
}
const { createSecureSessionStorage } = load("src/lib/secureSessionStorage.ts");
function store() {
  const values = new Map(); let fail = false;
  return { values, failNextChunk: () => { fail = true; },
    getItemAsync: async key => values.get(key) ?? null,
    setItemAsync: async (key, value) => {
      assert.ok(Buffer.byteLength(value) < 2048);
      if (fail && key.includes(".chunk.")) { fail = false; throw Error("Fictitious storage failure"); }
      values.set(key, value);
    },
    deleteItemAsync: async key => { values.delete(key); },
  };
}
test("sessão longa com Unicode retorna inteira após recriar o adaptador e logout remove os dados", async () => {
  const disk = store(), first = createSecureSessionStorage(disk);
  const session = JSON.stringify({ access_token: "x".repeat(6000), refresh_token: "r".repeat(200), name: "a".repeat(399) + "🌱".repeat(2000) });
  await first.setItem("session", session);
  const restarted = createSecureSessionStorage(disk);
  assert.equal(await restarted.getItem("session"), session);
  await restarted.removeItem("session");
  assert.equal(await createSecureSessionStorage(disk).getItem("session"), null); assert.equal(disk.values.size, 0);
});
test("gravação interrompida preserva sessão anterior; fragmento ausente nunca vira sessão parcial", async () => {
  const disk = store(), storage = createSecureSessionStorage(disk);
  await storage.setItem("s", "previous-session"); disk.failNextChunk();
  await assert.rejects(storage.setItem("s", "replacement-session"));
  assert.equal(await storage.getItem("s"), "previous-session");
  disk.values.delete([...disk.values.keys()].find(k => k.includes(".chunk.")));
  assert.equal(await storage.getItem("s"), null);
});
test("gravações concorrentes são ordenadas e uma nova sessão substitui a anterior", async () => {
  const disk = store(), storage = createSecureSessionStorage(disk);
  await Promise.all([storage.setItem("s", "A".repeat(3000)), storage.setItem("s", "B".repeat(5000))]);
  assert.equal(await storage.getItem("s"), "B".repeat(5000));
  assert.equal(disk.values.size, 14);
});
function api({ statuses = [200], session = { access_token: "verified-access" }, refreshError = false } = {}) {
  const calls = []; let refreshed = 0, signedOut = 0;
  const supabase = { auth: {
    getSession: async () => ({ data: { session } }),
    refreshSession: async () => { refreshed++; session = refreshError ? null : { access_token: "renewed-access" }; return { error: refreshError, data: { session } }; },
  } };
  const scope = load("src/lib/profileApi.ts", {
    process: { env: { EXPO_PUBLIC_REUSE_API_URL: "http://127.0.0.1:4330" } },
    require: () => ({ supabase, signOutLocally: async () => { signedOut++; session = null; } }),
    fetch: async (url, init) => { calls.push({ url, init }); const status = statuses.shift() ?? 200; return { status, ok: status === 200, json: async () => ({ data: { name: "Conta A" }, error: { message: "Fictitious error" } }) }; },
  });
  return { scope, calls, refreshed: () => refreshed, signedOut: () => signedOut };
}
test("API envia somente o token Bearer e nome/biografia, sem usar email/UID para autorização", async () => {
  const { scope, calls } = api(); await scope.editMyProfile({ name: "Conta", bio: "Bio" });
  assert.equal(calls[0].url, "http://127.0.0.1:4330/api/v1/me");
  assert.equal(calls[0].init.headers.Authorization, "Bearer verified-access");
  assert.deepEqual(JSON.parse(calls[0].init.body), { name: "Conta", bio: "Bio" });
});
test("401 renova e repete uma única vez; persistindo 401 encerra a sessão local", async () => {
  const ok = api({ statuses: [401, 200] }); await ok.scope.readMyProfile();
  assert.equal(ok.refreshed(), 1); assert.equal(ok.calls[1].init.headers.Authorization, "Bearer renewed-access");
  const denied = api({ statuses: [401, 401] }); await assert.rejects(denied.scope.readMyProfile(), e => e.status === 401);
  assert.equal(denied.refreshed(), 1); assert.equal(denied.signedOut(), 1); assert.equal(denied.calls.length, 2);
});
test("sem sessão não faz HTTP; indisponibilidade não apaga sessão; logout tenta revogar e sempre limpa localmente", async () => {
  const missing = api({ session: null }); await assert.rejects(missing.scope.readMyProfile(), e => e.status === 401); assert.equal(missing.calls.length, 0);
  const unavailable = api({ statuses: [503] }); await assert.rejects(unavailable.scope.readMyProfile(), e => e.status === 503); assert.equal(unavailable.signedOut(), 0);
  const logout = api({ statuses: [503] }); await assert.rejects(logout.scope.endSharedSession()); assert.equal(logout.signedOut(), 1);
});
