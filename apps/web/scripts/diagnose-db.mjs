import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: [] });
try {
    await prisma.$transaction(async transaction => {
        await transaction.$executeRawUnsafe("SET TRANSACTION READ ONLY");
        await transaction.$queryRawUnsafe("SELECT 1");
        const migrations = await transaction.$queryRawUnsafe("SELECT migration_name, finished_at IS NOT NULL AS concluida FROM _prisma_migrations ORDER BY migration_name");
        console.log(JSON.stringify({ conectado: true, migrations }, null, 2));
    }, { timeout: 10000 });
} catch (error) {
    const message = String(error.message);
    const reason = /tenant.*not found/i.test(message) ? "destino_do_banco_nao_encontrado"
        : /authentication|password/i.test(message) ? "autenticacao_recusada"
        : /reach database|ENOTFOUND|timeout/i.test(message) ? "banco_inacessivel"
        : "falha_na_consulta";
    console.error(JSON.stringify({ conectado: false, tipo: error.name, motivo: reason }));
    process.exitCode = 1;
} finally { await prisma.$disconnect(); }
