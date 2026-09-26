import { createHmac } from "node:crypto";

export function createRateLimitKey({ scope, identifier, windowId, secret }) {
    if (!scope || !identifier || !Number.isInteger(windowId) || !secret) {
        throw new Error("Parâmetros inválidos para o rate limit.");
    }

    return createHmac("sha256", secret)
        .update(`${scope}:${identifier}:${windowId}`)
        .digest("hex");
}
