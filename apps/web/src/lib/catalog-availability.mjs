export async function readCatalog(query) {
    try { return { available: true, items: await query() }; }
    catch (error) {
        if (!/^PrismaClient/.test(error?.name || "")) throw error;
        // Não registrar URLs, credenciais, identidades ou o texto bruto do provedor.
        console.error("Consulta ao catálogo indisponível", { type: error.name, code: error.code || "initialization" });
        return { available: false, items: [] };
    }
}
