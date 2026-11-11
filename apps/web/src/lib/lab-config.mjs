export const LAB_PROJECT_REF = "mqvlgrxwuirgjutqltpv";
export const LAB_AUTH_URL = `https://${LAB_PROJECT_REF}.supabase.co`;

export function authConfiguration(env = process.env) {
    if (env.SUPABASE_AUTH_URL !== LAB_AUTH_URL || !env.SUPABASE_PUBLISHABLE_KEY?.startsWith("sb_publishable_")) {
        throw new Error("Configure exclusivamente o projeto Supabase novo do laboratório.");
    }
    return { url: LAB_AUTH_URL, key: env.SUPABASE_PUBLISHABLE_KEY };
}

export function assertLabDatabaseUrl(value) {
    let url;
    try { url = new URL(value); } catch { throw new Error("DATABASE_URL do laboratório ausente ou inválida."); }
    const allowed = url.hostname === `db.${LAB_PROJECT_REF}.supabase.co`
        || (url.hostname === "aws-0-us-east-1.pooler.supabase.com" && url.username.endsWith(`.${LAB_PROJECT_REF}`));
    if (!allowed || !["postgres:", "postgresql:"].includes(url.protocol) || url.pathname !== "/postgres") {
        throw new Error("Operação recusada: o banco não é o projeto novo do laboratório.");
    }
    return value;
}
