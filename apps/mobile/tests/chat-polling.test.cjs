const test = require("node:test"),
  assert = require("node:assert/strict"),
  vm = require("node:vm"),
  fs = require("node:fs"),
  ts = require("typescript");
test("poll não sobrepõe consultas, pausa em segundo plano e recomeça ao voltar", async () => {
  const timers = new Map();
  let seq = 0,
    change,
    cleanup,
    focus,
    resolve,
    calls = 0;
  const app = {
    currentState: "active",
    addEventListener: (_event, f) => {
      change = f;
      return {
        remove: () => {
          change = null;
        },
      };
    },
  };
  const globals = {
    exports: {},
    require: (name) =>
      name === "react"
        ? { useRef: (v) => ({ current: v }), useCallback: (f) => f }
        : name === "react-native"
          ? { AppState: app }
          : {
              useFocusEffect: (f) => {
                focus = f;
              },
            },
    setTimeout: (f) => {
      timers.set(++seq, f);
      return seq;
    },
    clearTimeout: (id) => timers.delete(id),
    Promise,
  };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync("src/lib/useActivePolling.ts", "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    globals,
  );
  globals.exports.useActivePolling(async () => {
    calls++;
    await new Promise((r) => {
      resolve = r;
    });
  });
  cleanup = focus();
  assert.equal(calls, 1);
  assert.equal(timers.size, 0);
  app.currentState = "background";
  change("background");
  app.currentState = "active";
  change("active");
  assert.equal(calls, 1);
  resolve();
  await new Promise(setImmediate);
  assert.equal(timers.size, 1);
  app.currentState = "background";
  change("background");
  assert.equal(timers.size, 0);
  app.currentState = "active";
  change("active");
  assert.equal(calls, 2);
  resolve();
  await new Promise(setImmediate);
  cleanup();
  assert.equal(timers.size, 0);
  assert.equal(change, null);
});
