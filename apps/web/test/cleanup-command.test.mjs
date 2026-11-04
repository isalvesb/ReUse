import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
const script = new URL("../scripts/cleanup-item-uploads.mjs", import.meta.url);
test("comando de manutenção recusa aplicação sem confirmação e destino alheio antes de conectar", () => {
  for (const [args, expected] of [
    [["--apply"], /confirme explicitamente/],
    [["--apply", "--dry-run"], /nunca as duas/],
    [["--global-delete"], /Argumento/],
    [[], /banco não é/],
  ]) {
    const r = spawnSync(process.execPath, [script.pathname, ...args], {
      env: {
        ...process.env,
        DATABASE_URL: "postgresql://example:fake@old.example.com/postgres",
      },
      encoding: "utf8",
    });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, expected);
    assert.doesNotMatch(r.stderr, /example:fake/);
  }
});
