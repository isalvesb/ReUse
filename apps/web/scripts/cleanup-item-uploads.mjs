import { createRequire } from "node:module";
import {
  assertLabDatabaseUrl,
  LAB_PROJECT_REF,
} from "../src/lib/lab-config.mjs";
import {
  cleanupPhotos,
  inspectPhotoCleanup,
} from "../src/lib/item-storage.mjs";
const args = process.argv.slice(2);
if (
  args.some(
    (arg) =>
      ![
        "--dry-run",
        "--apply",
        `--confirm-project=${LAB_PROJECT_REF}`,
      ].includes(arg),
  )
)
  throw Error("Argumento de manutenção inválido.");
if (args.includes("--apply") && args.includes("--dry-run"))
  throw Error("Escolha simulação ou aplicação, nunca as duas juntas.");
if (
  args.includes("--apply") &&
  !args.includes(`--confirm-project=${LAB_PROJECT_REF}`)
)
  throw Error(
    "Simule primeiro e confirme explicitamente o projeto do laboratório.",
  );
assertLabDatabaseUrl(process.env.DATABASE_URL);
const { PrismaClient } = createRequire(import.meta.url)("@prisma/client");
const db = new PrismaClient();
try {
  const plan = await inspectPhotoCleanup(db);
  const applied = args.includes("--apply") ? await cleanupPhotos(db) : null;
  console.log(
    JSON.stringify({
      mode: applied ? "apply" : "dry-run",
      project: LAB_PROJECT_REF,
      expiredCandidates: plan.expiredCandidates,
      batchCandidates: plan.rows.length,
      ...(applied || {}),
    }),
  );
  if (applied?.failed) process.exitCode = 1;
} catch {
  console.error(
    JSON.stringify({
      error: "MAINTENANCE_UNAVAILABLE",
      message:
        "Não foi possível concluir a manutenção. Confira o destino e a conexão; não divulgue credenciais.",
    }),
  );
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
