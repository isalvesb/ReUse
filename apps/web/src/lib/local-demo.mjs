export function assertLocalDatabase(url) {
    const parsed = new URL(url || "invalid:");
    if (!["postgres:", "postgresql:"].includes(parsed.protocol)
        || !["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname)) {
        throw new Error("A demonstração exige PostgreSQL local. Banco remoto recusado.");
    }
    return parsed;
}

export function isLocalDemo(env = process.env) {
    if (env.REUSE_LOCAL_DEMO !== "true") return false;
    assertLocalDatabase(env.DATABASE_URL);
    const origin = new URL(env.NEXT_PUBLIC_APP_URL || "invalid:");
    if (env.VERCEL || !["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname)) {
        throw new Error("A demonstração local não pode executar em hospedagem pública.");
    }
    return true;
}
