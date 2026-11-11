import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { assertLabDatabaseUrl, LAB_PROJECT_REF } from "../src/lib/lab-config.mjs";
const url = new URL(assertLabDatabaseUrl(process.env.DATABASE_URL));
if (url.username !== `postgres.${LAB_PROJECT_REF}` || url.port !== "5432") {
    throw new Error("Migration exige conexão administrativa de sessão ao projeto novo. Nenhum build aplica migrations.");
}
const result = spawnSync(process.execPath, [createRequire(import.meta.url).resolve("prisma/build/index.js"), "migrate", "deploy"], { stdio: "inherit", env: process.env });
process.exit(result.status ?? 1);
