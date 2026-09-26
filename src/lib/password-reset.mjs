import { createHash, randomBytes } from "node:crypto";

export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export function createPasswordResetToken() {
    const rawToken = randomBytes(32).toString("hex");
    return {
        rawToken,
        tokenHash: hashPasswordResetToken(rawToken),
    };
}

export function hashPasswordResetToken(token) {
    if (typeof token !== "string" || token.length < 32) {
        return null;
    }

    return createHash("sha256").update(token).digest("hex");
}

export function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
