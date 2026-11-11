const DEFAULT_APP_URL = "http://localhost:3000";

function normalizeUrl(value, { assumeHttps = false } = {}) {
    if (!value) {
        return null;
    }

    const candidate = assumeHttps
        && !value.startsWith("http://")
        && !value.startsWith("https://")
        ? `https://${value}`
        : value;
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("A URL-base da aplicação deve usar HTTP ou HTTPS.");
    }

    return url.origin;
}

function isLoopbackOrigin(origin) {
    if (!origin) {
        return false;
    }

    const { hostname } = new URL(origin);
    return hostname === "localhost"
        || hostname === "127.0.0.1"
        || hostname === "[::1]";
}

export function resolveAppUrl({
    requestUrl,
    configuredUrl = process.env.NEXT_PUBLIC_APP_URL,
    vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL,
    vercelUrl = process.env.VERCEL_URL,
    nodeEnv = process.env.NODE_ENV,
} = {}) {
    const requestOrigin = normalizeUrl(requestUrl);
    const configuredOrigin = normalizeUrl(configuredUrl);
    const trustedVercelOrigins = new Set([
        normalizeUrl(vercelProductionUrl, { assumeHttps: true }),
        normalizeUrl(vercelUrl, { assumeHttps: true }),
    ].filter(Boolean));

    const configuredIsSafe = configuredOrigin
        && (
            nodeEnv !== "production"
            || !isLoopbackOrigin(configuredOrigin)
            || configuredOrigin === requestOrigin
        );

    if (configuredIsSafe) {
        return configuredOrigin;
    }

    if (requestOrigin && trustedVercelOrigins.has(requestOrigin)) {
        return requestOrigin;
    }

    if (nodeEnv !== "production") {
        return configuredOrigin
            || (isLoopbackOrigin(requestOrigin) ? requestOrigin : null)
            || DEFAULT_APP_URL;
    }

    throw new Error(
        "Não foi possível determinar uma origem pública confiável para a aplicação."
    );
}

export function resolveCanonicalRequest({
    requestUrl,
    canonicalPath,
    preserveSearch = false,
    ...options
}) {
    const request = new URL(requestUrl);
    const appUrl = resolveAppUrl({ requestUrl, ...options });

    if (request.origin === appUrl) {
        return { appUrl, redirectUrl: null };
    }

    const redirect = new URL(canonicalPath, appUrl);

    if (preserveSearch) {
        redirect.search = request.search;
    }

    return { appUrl, redirectUrl: redirect.toString() };
}
