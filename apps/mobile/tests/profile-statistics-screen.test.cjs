const test = require("node:test"),
  assert = require("node:assert/strict"),
  ts = require("typescript"),
  fs = require("node:fs"),
  vm = require("node:vm");
function screen() {
  let state = [],
    cursor = 0,
    effect,
    appChange;
  const pending = [];
  const react = {
    useState: (initial) => {
      const i = cursor++;
      if (!(i in state)) state[i] = initial;
      return [
        state[i],
        (next) => {
          state[i] = typeof next === "function" ? next(state[i]) : next;
        },
      ];
    },
    useCallback: (f) => f,
  };
  const imports = {
    react: { ...react, default: react },
    "react/jsx-runtime": require("react/jsx-runtime"),
    "react-native": {
      ActivityIndicator: "ActivityIndicator",
      Image: "Image",
      Pressable: "Pressable",
      View: "View",
      AppState: {
        addEventListener: (_, f) => {
          appChange = f;
          return {
            remove: () => {
              appChange = null;
            },
          };
        },
      },
    },
    "@react-navigation/native": {
      useFocusEffect: (f) => {
        effect = f;
      },
      useNavigation: () => ({}),
    },
    "react-native-safe-area-context": { useSafeAreaInsets: () => ({ top: 0 }) },
    "@expo/vector-icons": { Ionicons: "Icon" },
    "../../design/Text": { Text: "Text" },
    "../../lib/useActivePolling": { useActivePolling: () => {} },
    "../../lib/chatApi": {},
    "../../Services/authSession": {},
    "../../lib/profileApi": {
      readMyProfile: async () => ({
        name: "Conta fictícia",
        email: "teste@example.com",
        bio: "Bio",
      }),
      readMyItemStatistics: () =>
        new Promise((resolve, reject) => pending.push({ resolve, reject })),
    },
    "./styles": { default: {} },
  };
  const scope = {
    exports: {},
    console,
    require: (name) => imports[name] || {},
    Promise,
  };
  vm.runInNewContext(
    ts.transpileModule(
      fs.readFileSync("src/screens/Profile/index.tsx", "utf8"),
      {
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
    cursor = 0;
    return scope.exports.ProfileScreen({});
  }
  function texts(node) {
    if (!node) return [];
    if (Array.isArray(node)) return node.flatMap(texts);
    if (typeof node !== "object") return [node];
    return texts(node.props?.children);
  }
  return {
    render,
    texts,
    pending,
    focus: () => effect(),
    resume: () => appChange?.("active"),
  };
}
const tick = () => new Promise((r) => setImmediate(r));
test("perfil ignora resposta tardia da conta anterior e mostra indisponibilidade sem zeros falsos", async () => {
  const s = screen();
  s.render();
  const leaveA = s.focus();
  leaveA();
  s.render();
  s.focus();
  s.pending[1].resolve({ totalItems: 7, activeItems: 5, pausedItems: 2 });
  await tick();
  s.pending[0].resolve({ totalItems: 99, activeItems: 99, pausedItems: 99 });
  await tick();
  let text = s.texts(s.render());
  assert.ok(text.includes(7));
  assert.ok(!text.includes(99));
  s.resume();
  s.pending[2].reject(Error("offline"));
  await tick();
  text = s.texts(s.render());
  assert.equal(text.filter((t) => t === "—").length, 3);
  assert.ok(text.includes("Estatísticas indisponíveis. Tente novamente."));
  assert.ok(!text.includes(0));
});
