const test = require("node:test"),
  assert = require("node:assert/strict"),
  vm = require("node:vm"),
  fs = require("node:fs"),
  ts = require("typescript");
function load(statuses = [200], fail = false) {
  let session = { access_token: "session" },
    refresh = 0,
    out = 0;
  const calls = [];
  const scope = {
    exports: {},
    process: { env: { EXPO_PUBLIC_REUSE_API_URL: "http://127.0.0.1:4330" } },
    require: (name) =>
      name === "./fetchWithTimeout"
        ? {
            fetchWithTimeout: async (url, init) => {
              calls.push({ url, init });
              if (fail) throw Error("Network");
              const status = statuses.shift() ?? 200;
              return {
                status,
                ok: status === 200,
                json: async () => ({
                  data: { id: "m" },
                  error: { message: "Erro fictício" },
                }),
              };
            },
          }
        : {
            supabase: {
              auth: {
                getSession: async () => ({ data: { session } }),
                refreshSession: async () => {
                  refresh++;
                  session = { access_token: "renewed" };
                  return { data: { session } };
                },
              },
            },
            signOutLocally: async () => {
              out++;
            },
          },
    Error,
    Promise,
    JSON,
    encodeURIComponent,
  };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync("src/lib/chatApi.ts", "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    scope,
  );
  return { api: scope.exports, calls, refresh: () => refresh, out: () => out };
}
test("chat usa Bearer e chave estável em repetição após 401 sem autoria cliente", async () => {
  const x = load([401, 200]);
  await x.api.sendMessage("c", "Texto", "same-key");
  assert.equal(x.refresh(), 1);
  assert.deepEqual(JSON.parse(x.calls[0].init.body), {
    content: "Texto",
    clientKey: "same-key",
  });
  assert.equal(x.calls[1].init.body, x.calls[0].init.body);
  assert.equal(x.calls[1].init.headers.Authorization, "Bearer renewed");
});
test("401 persistente limpa sessão; rede falha sem logout indevido", async () => {
  const denied = load([401, 401]);
  await assert.rejects(denied.api.conversations(), (e) => e.status === 401);
  assert.equal(denied.out(), 1);
  assert.equal(denied.calls.length, 2);
  const offline = load([], true);
  await assert.rejects(offline.api.conversations());
  assert.equal(offline.out(), 0);
});
test("notificação e leitura usam somente o destinatário derivado da sessão e marcador visto", async () => {
  const x = load();
  await x.api.readConversation("c", "m");
  assert.deepEqual(JSON.parse(x.calls[0].init.body), { throughMessageId: "m" });
  await x.api.readNotification("n");
  assert.equal(
    x.calls[1].url,
    "http://127.0.0.1:4330/api/v1/notifications/n/read",
  );
  await x.api.messages("c", "opaque/+");
  assert.ok(x.calls[2].url.endsWith("cursor=opaque%2F%2B"));
});
