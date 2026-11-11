const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  ts = require("typescript");
test("composição Web pausa refresh e mantém retry após falha até confirmação", async () => {
  let slots = [],
    index = 0,
    ticks = [],
    effects = [],
    refreshes = 0,
    reducer,
    fail = true;
  const ChatWindow = () => null;
  const scope = {
    exports: {},
    FormData,
    window: {
      setInterval: (f) => {
        ticks.push(f);
        return 1;
      },
      clearInterval: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    document: { hidden: false },
    require: (name) => {
      if (name === "react")
        return {
          useState: (initial) => {
            const i = index++;
            if (!(i in slots)) slots[i] = initial;
            return [slots[i], (v) => (slots[i] = v)];
          },
          useEffect: (f) => effects.push(f),
          useMemo: (f) => f(),
          useActionState: (f) => {
            reducer = f;
            return [{}, () => {}, false];
          },
        };
      if (name === "react/jsx-runtime")
        return {
          jsx: (type, props) => ({ type, props }),
          jsxs: (type, props) => ({ type, props }),
        };
      if (name === "next/navigation")
        return {
          useRouter: () => ({ refresh: () => refreshes++, replace: () => {} }),
        };
      if (name === "./actions")
        return {
          sendMessage: async () => {
            if (fail) throw Error("Network");
            return { sent: "saved", conversationId: "c" };
          },
        };
      return { default: name.includes("ChatWindow") ? ChatWindow : () => null };
    },
  };
  vm.runInNewContext(
    ts.transpileModule(
      fs.readFileSync("../web/src/app/chat/ChatClient.js", "utf8"),
      {
        fileName: "ChatClient.tsx",
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
    ).outputText,
    scope,
  );
  function render() {
    index = 0;
    ticks = [];
    effects = [];
    const tree = scope.exports.default({
      conversations: [{ id: "c" }],
      initialConversationId: "c",
    });
    effects.forEach((f) => f());
    return tree.props.children.find((c) => c.type === ChatWindow).props;
  }
  render().onComposingChange(true);
  render();
  ticks.forEach((f) => f());
  assert.equal(refreshes, 0);
  const form = new FormData();
  form.set("conversationId", "c");
  const error = await reducer({}, form);
  assert.match(error.error, /preservado/);
  render();
  ticks.forEach((f) => f());
  assert.equal(refreshes, 0);
  fail = false;
  assert.equal((await reducer({}, form)).sent, "saved");
  render();
  ticks.forEach((f) => f());
  assert.equal(refreshes, 1);
});
