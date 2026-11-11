import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";
import { isLocalDemo } from "../src/lib/local-demo.mjs";
if (!isLocalDemo()) throw new Error("Validação permitida apenas na demonstração local.");
const prisma = new PrismaClient({ log: [] });
const base = process.env.NEXT_PUBLIC_APP_URL;
const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const ids = [];
const request = async (path, body, token, tool = false) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Cookie = `reuse_session=${token}`;
    if (tool) headers["x-api-key"] = process.env.ASSISTANT_API_KEY;
    const response = await fetch(`${base}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
    return { status: response.status, data: await response.json() };
};
try {
    for (const name of ["um", "dois"]) {
        const user = await prisma.user.create({ data: { name: `Teste isolado ${name}`, email: `${randomUUID()}@example.test` } });
        ids.push(user.id);
    }
    const category = await prisma.category.findFirstOrThrow();
    for (const id of ids) await prisma.item.create({ data: { title: "Teste de isolamento", description: "Registro exclusivo do teste local", type: "DOACAO", condition: "NOVO", sellerId: id, categoryId: category.id } });
    const session = await new SignJWT({ userId: ids[0], sessionVersion: 0 }).setProtectedHeader({ alg: "HS256" }).setIssuer("reuse-web").setAudience("reuse-session").setExpirationTime("5m").sign(key);
    assert.equal((await request("/api/assistant/delegation", {})).status, 401);
    const delegation = await request("/api/assistant/delegation", {}, session);
    assert.equal(delegation.status, 200);
    const body = { delegationToken: delegation.data.delegationToken };
    assert.equal((await request("/api/assistant/pausar-ofertas", body)).status, 401);
    const prepared = await request("/api/assistant/pausar-ofertas", body, null, true);
    assert.equal(prepared.data.requiresConfirmation, true);
    assert.equal(await prisma.item.count({ where: { sellerId: ids[0], status: "ATIVO" } }), 1);
    const confirmed = await request("/api/assistant/pausar-ofertas", { ...body, confirmationToken: prepared.data.confirmationToken }, null, true);
    assert.equal(confirmed.status, 200);
    assert.equal(await prisma.item.count({ where: { sellerId: ids[0], status: "INATIVO" } }), 1);
    assert.equal(await prisma.item.count({ where: { sellerId: ids[1], status: "ATIVO" } }), 1);
    assert.equal((await request("/api/assistant/pausar-ofertas", { ...body, confirmationToken: prepared.data.confirmationToken }, null, true)).status, 400);
    assert.equal((await request("/api/assistant/listar-ofertas", { ...body, userId: ids[1] }, null, true)).status, 400);
    const resume = await request("/api/assistant/reativar-ofertas", body, null, true);
    assert.equal((await request("/api/assistant/reativar-ofertas", { ...body, confirmationToken: resume.data.confirmationToken }, null, true)).status, 200);
    assert.equal(await prisma.item.count({ where: { sellerId: ids[0], status: "ATIVO" } }), 1);
    console.log("Integração HTTP + PostgreSQL: sessão, delegação, confirmação persistida, uso único, isolamento e reativação aprovados.");
} finally {
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
}
