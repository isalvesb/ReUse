import { createRequire } from "node:module";
import { assertLabDatabaseUrl } from "../src/lib/lab-config.mjs";
import { cleanupPhotos } from "../src/lib/item-storage.mjs";
assertLabDatabaseUrl(process.env.DATABASE_URL);
const { PrismaClient } = createRequire(import.meta.url)("@prisma/client");
const db = new PrismaClient();
try {
  const pending = await db.itemUpload.count({
    where: { expiresAt: { lt: new Date() }, status: { not: "ATTACHED" } },
  });
  console.log(
    JSON.stringify(
      process.argv.includes("--apply")
        ? await cleanupPhotos(db)
        : { mode: "dry-run", expiredCandidates: pending },
    ),
  );
} finally {
  await db.$disconnect();
}
