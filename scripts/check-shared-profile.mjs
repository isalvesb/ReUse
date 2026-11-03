import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { LAB_AUTH_URL } from '../apps/web/src/lib/lab-config.mjs';
import { verifiedIdentity } from '../apps/web/src/lib/supabase-auth.mjs';
const require = createRequire(import.meta.url);
const requireWeb = createRequire(new URL('../apps/web/package.json', import.meta.url));
const { createClient } = await import(requireWeb.resolve('@supabase/supabase-js'));
const { decodeJwt } = await import(requireWeb.resolve('jose'));
const ts = require('../apps/mobile/node_modules/typescript');
const credentials = JSON.parse(fs.readFileSync(process.env.REUSE_TEST_CREDENTIALS_FILE, 'utf8'));
assert.equal(credentials.auth_url, LAB_AUTH_URL);
const base = process.env.REUSE_TEST_API_URL || 'http://127.0.0.1:4330';
assert.equal(base, 'http://127.0.0.1:4330', 'Restrito ao servidor local do laboratório.');
process.env.SUPABASE_AUTH_URL = LAB_AUTH_URL;
process.env.SUPABASE_PUBLISHABLE_KEY = credentials.publishable_key;
const source = ts.transpileModule(fs.readFileSync(new URL('../apps/mobile/src/lib/profileApi.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const checks = [], clients = [];
async function check(name, action) { await action(); checks.push({ name, passed: true }); }
async function clientFor(account) {
    const supabase = createClient(LAB_AUTH_URL, credentials.publishable_key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await supabase.auth.signInWithPassword({ email: credentials[`account_${account}_email`], password: credentials[`account_${account}_password`] });
    assert.equal(error, null, 'Login fictício falhou.');
    const scope = { exports: {}, URL, AbortSignal, __DEV__: true, process: { env: { EXPO_PUBLIC_REUSE_API_URL: base } }, fetch,
        require: () => ({ supabase, signOutLocally: () => supabase.auth.signOut({ scope: 'local' }) }) };
    vm.runInNewContext(source, scope);
    const client = { supabase, api: scope.exports }; clients.push(client); return client;
}
async function access(client) { return (await client.supabase.auth.getSession()).data.session.access_token; }
async function http(token, path = '/me', init = {}) {
    return fetch(`${base}/api/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers } });
}
try {
    const aWeb = await clientFor('a'), aMobile = await clientFor('a'), bWeb = await clientFor('b'), bMobile = await clientFor('b');
    let profileA, profileB;
    await check('API recusa ausência, bypass demonstrativo e token forjado', async () => {
        assert.equal((await http(null)).status, 401); assert.equal((await http('dev@reuse.app')).status, 401);
        assert.equal((await http(null, '/me', { headers: { 'X-User-Id': credentials.account_a_id } })).status, 401);
        const forged = `${Buffer.from('{"alg":"none"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: credentials.account_a_id })).toString('base64url')}.`;
        assert.equal((await http(forged)).status, 401);
    });
    await check('A/B têm perfis únicos e estáveis entre sessões independentes', async () => {
        profileA = await aMobile.api.readMyProfile(); profileB = await bMobile.api.readMyProfile();
        assert.equal((await aWeb.api.readMyProfile()).id, profileA.id); assert.equal((await bWeb.api.readMyProfile()).id, profileB.id); assert.notEqual(profileA.id, profileB.id);
        assert.deepEqual(Object.keys(profileA).sort(), ['id', 'name', 'email', 'location', 'bio', 'avatarUrl', 'rating', 'createdAt', 'updatedAt'].sort());
        assert.ok(Number.isFinite(Date.parse(profileA.updatedAt)));
    });
    await check('Atualização no servidor aparece no cliente de API Mobile real', async () => {
        assert.equal((await http(await access(aWeb), '/me', { method: 'PATCH', body: JSON.stringify({ name: 'Conta A - teste compartilhado', bio: 'Atualização fictícia pelo servidor.' }) })).status, 200);
        assert.equal((await aMobile.api.readMyProfile()).bio, 'Atualização fictícia pelo servidor.');
    });
    await check('Alteração pelo cliente Mobile persiste e aparece na outra sessão', async () => {
        await aMobile.api.editMyProfile({ name: 'Conta A - Mobile', bio: 'Biografia fictícia atualizada pelo Mobile.' });
        assert.equal((await (await http(await access(aWeb))).json()).data.bio, 'Biografia fictícia atualizada pelo Mobile.');
    });
    await check('B não escolhe, consulta privadamente nem altera A pelo contrato', async () => {
        const before = await aWeb.api.readMyProfile(), token = await access(bMobile);
        for (const input of [{ id: profileA.id, name: 'Attempt' }, { userId: profileA.id, bio: 'Attempt' }, { email: credentials.account_a_email, name: 'Attempt' }]) assert.equal((await http(token, '/me', { method: 'PATCH', body: JSON.stringify(input) })).status, 400);
        assert.equal((await http(token, `/me?id=${profileA.id}`)).status, 400); assert.equal((await http(token, `/users/${profileA.id}`)).status, 404);
        assert.equal((await aWeb.api.readMyProfile()).updatedAt, before.updatedAt); assert.equal((await bMobile.api.readMyProfile()).id, profileB.id);
        await bMobile.api.editMyProfile({ name: 'Conta B - teste isolado', bio: 'Biografia fictícia de B.' });
        assert.equal((await bWeb.api.readMyProfile()).name, 'Conta B - teste isolado'); assert.equal((await aWeb.api.readMyProfile()).name, before.name);
    });
    await check('Entradas inválidas, campos proibidos e limites geram 400/413/415', async () => {
        const token = await access(aWeb);
        for (const input of [{ name: ' ' }, { bio: 'x'.repeat(1001) }, { passwordHash: 'forbidden' }, { authSubject: credentials.account_b_id }, []]) assert.equal((await http(token, '/me', { method: 'PATCH', body: JSON.stringify(input) })).status, 400);
        assert.equal((await http(token, '/me', { method: 'PATCH', body: '{broken' })).status, 400);
        assert.equal((await http(token, '/me', { method: 'PATCH', headers: { 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
        assert.equal((await http(token, '/me', { method: 'PATCH', body: 'x'.repeat(16001) })).status, 413);
    });
    await check('Renovação preserva identidade e identificador da sessão', async () => {
        const previous = decodeJwt(await access(aMobile)); const { data, error } = await aMobile.supabase.auth.refreshSession();
        assert.equal(error, null); assert.ok(data.session); assert.equal(decodeJwt(data.session.access_token).session_id, previous.session_id); assert.equal((await aMobile.api.readMyProfile()).id, profileA.id);
    });
    await check('JWT autêntico expirado é recusado com relógio de verificação controlado', async () => {
        const token = await access(aMobile), claims = decodeJwt(token);
        await assert.rejects(verifiedIdentity(token, { now: new Date((claims.exp + 1) * 1000) }), error => error.status === 401);
    });
    await check('Acesso direto à tabela retorna erro sem expor registros', async () => {
        const response = await fetch(`${LAB_AUTH_URL}/rest/v1/users?select=id`, { headers: { apikey: credentials.publishable_key, Authorization: `Bearer ${await access(aWeb)}` } });
        assert.ok([401, 403, 404, 503].includes(response.status));
        assert.equal(Array.isArray(await response.json()), false);
    });
    await check('Logout impede replay/refresh e preserva outras sessões e conta B', async () => {
        const session = (await aMobile.supabase.auth.getSession()).data.session; await aMobile.api.endSharedSession();
        assert.equal((await http(session.access_token)).status, 401);
        const empty = createClient(LAB_AUTH_URL, credentials.publishable_key, { auth: { persistSession: false, autoRefreshToken: false } });
        assert.ok((await empty.auth.refreshSession({ refresh_token: session.refresh_token })).error);
        assert.equal((await aWeb.api.readMyProfile()).id, profileA.id); assert.equal((await bMobile.api.readMyProfile()).id, profileB.id);
    });
    console.log(JSON.stringify({ mode: 'Auth + HTTP + PostgreSQL reais; cliente API Mobile transpilado, sem interface nativa', checks }, null, 2));
} catch (error) {
    console.log(JSON.stringify({ completed: false, checks, failed_type: error.name, failed_status: error.status ?? null, message: error.name === 'ProfileApiError' ? error.message : 'Uma asserção falhou; nenhum token ou credencial foi registrado.' }, null, 2)); process.exitCode = 1;
} finally {
    for (const client of clients) { try { await client.api.endSharedSession(); } catch { await client.supabase.auth.signOut({ scope: 'local' }); } }
}
