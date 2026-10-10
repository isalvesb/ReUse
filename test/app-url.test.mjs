import test from "node:test";
import assert from "node:assert/strict";
import {
    resolveAppUrl,
    resolveCanonicalRequest,
} from "../src/lib/app-url.mjs";

test("aceita a origem pública quando ela coincide com o domínio confiável da Vercel", () => {
    assert.equal(
        resolveAppUrl({
            requestUrl: "https://re-use-web-bay.vercel.app/api/auth/google",
            configuredUrl: "http://localhost:3000",
            vercelProductionUrl: "re-use-web-bay.vercel.app",
            nodeEnv: "production",
        }),
        "https://re-use-web-bay.vercel.app"
    );
});

test("não usa o domínio da Vercel quando a origem canônica pública foi configurada", () => {
    assert.equal(
        resolveAppUrl({
            requestUrl: "https://re-use-web-bay.vercel.app/api/auth/google",
            configuredUrl: "https://reuse.exemplo.com",
            vercelProductionUrl: "re-use-web-bay.vercel.app",
            vercelUrl: "reuse-preview-123.vercel.app",
            nodeEnv: "production",
        }),
        "https://reuse.exemplo.com"
    );
});

test("normaliza a URL configurada para uma origem sem barra final", () => {
    assert.equal(
        resolveAppUrl({ configuredUrl: "https://reuse.example/" }),
        "https://reuse.example"
    );
});

test("redireciona para o domínio canônico antes de iniciar o OAuth", () => {
    assert.deepEqual(
        resolveCanonicalRequest({
            requestUrl: "https://re-use-web-bay.vercel.app/api/auth/google",
            canonicalPath: "/api/auth/google",
            configuredUrl: "https://reuse.exemplo.com",
            vercelProductionUrl: "re-use-web-bay.vercel.app",
            nodeEnv: "production",
        }),
        {
            appUrl: "https://reuse.exemplo.com",
            redirectUrl: "https://reuse.exemplo.com/api/auth/google",
        }
    );
});

test("preserva os parâmetros ao canonicalizar um callback OAuth", () => {
    assert.deepEqual(
        resolveCanonicalRequest({
            requestUrl: "https://re-use-web-bay.vercel.app/api/auth/google/callback?code=abc&state=xyz",
            canonicalPath: "/api/auth/google/callback",
            preserveSearch: true,
            configuredUrl: "https://reuse.exemplo.com",
            vercelProductionUrl: "re-use-web-bay.vercel.app",
            nodeEnv: "production",
        }),
        {
            appUrl: "https://reuse.exemplo.com",
            redirectUrl: "https://reuse.exemplo.com/api/auth/google/callback?code=abc&state=xyz",
        }
    );
});

test("não redireciona quando a requisição já usa o domínio canônico", () => {
    assert.deepEqual(
        resolveCanonicalRequest({
            requestUrl: "https://reuse.exemplo.com/api/auth/facebook",
            canonicalPath: "/api/auth/facebook",
            configuredUrl: "https://reuse.exemplo.com",
            vercelProductionUrl: "outro-projeto.vercel.app",
            nodeEnv: "production",
        }),
        {
            appUrl: "https://reuse.exemplo.com",
            redirectUrl: null,
        }
    );
});

test("rejeita host arbitrário quando a configuração de produção ainda aponta para localhost", () => {
    assert.throws(
        () => resolveAppUrl({
            requestUrl: "https://host-nao-autorizado.exemplo/api/auth/google",
            configuredUrl: "http://localhost:3000",
            vercelProductionUrl: "re-use-web-bay.vercel.app",
            vercelUrl: "reuse-preview-123.vercel.app",
            nodeEnv: "production",
        }),
        /origem pública confiável/
    );
});

test("mantém localhost como origem canônica no desenvolvimento", () => {
    assert.equal(
        resolveAppUrl({
            requestUrl: "http://localhost:3000/api/auth/google",
            configuredUrl: "http://localhost:3000",
            nodeEnv: "development",
        }),
        "http://localhost:3000"
    );
});

test("rejeita protocolos que não podem ser usados em callbacks", () => {
    assert.throws(
        () => resolveAppUrl({ configuredUrl: "javascript:alert(1)" }),
        /HTTP ou HTTPS/
    );
});
