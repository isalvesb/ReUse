import { spawnSync, spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { assertLocalDatabase } from "../src/lib/local-demo.mjs";

const command = process.argv[2] || "dev";
const databaseUrl = process.env.REUSE_LOCAL_DATABASE_URL;
assertLocalDatabase(databaseUrl);
const port = process.env.REUSE_LOCAL_PORT || "4317";
if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) throw new Error("Porta local inválida.");
// Nenhuma credencial externa do shell ou dos arquivos do projeto é herdada.
const env = {};
for (const key of ["PATH", "HOME", "TMPDIR", "LANG", "TZ", "SYSTEMROOT"]) if (process.env[key]) env[key] = process.env[key];
for (const name of [".env", ".env.local", ".env.development", ".env.development.local", ".env.production", ".env.production.local"]) {
    if (!existsSync(name)) continue;
    for (const match of readFileSync(name, "utf8").matchAll(/^(?:export )?([A-Z][A-Z0-9_]+)\s*=/gm)) env[match[1]] = "";
}
Object.assign(env, {
    DATABASE_URL: databaseUrl, REUSE_LOCAL_DEMO: "true",
    NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${port}`,
    NEXT_PUBLIC_SHOW_LEGACY_ASSISTANTS: "true", NEXT_PUBLIC_DISABLE_IBM_WEBCHAT: "true",
    ASSISTANT_API_KEY: "ferramenta-local-demonstrativa", ORCHESTRATE_TOOLS_SECRET: "ferramenta-local-demonstrativa",
    SESSION_SECRET: "demonstracao-local-isolada-chave-de-sessao-2026",
    ASSISTANT_CONFIRMATION_SECRET: "demonstracao-local-isolada-chave-de-confirmacao-2026",
    NEXT_TELEMETRY_DISABLED: "1", DEMO_SEED_ALLOWED: "true",
    SEED_PASSWORD: process.env.REUSE_DEMO_PASSWORD || "LocalDemo2026!",
});
const run = (file, args) => {
    const result = spawnSync(process.execPath, [file, ...args], { env, stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status || 1);
};
if (command === "prepare") {
    run("node_modules/prisma/build/index.js", ["migrate", "deploy"]);
    run("node_modules/prisma/build/index.js", ["generate"]);
    run("prisma/seed.js", []);
} else if (command === "verify") {
    run("scripts/verify-local.mjs", []);
} else if (command === "build") {
    run("node_modules/next/dist/bin/next", ["build", "--webpack"]);
} else if (["dev", "start"].includes(command)) {
    const args = [command, "--hostname", "127.0.0.1", "--port", port];
    if (command === "dev") args.push("--webpack");
    const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", ...args], { env, stdio: "inherit" });
    for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
    child.on("exit", code => process.exit(code || 0));
} else throw new Error("Use prepare, dev, build, start ou verify.");
