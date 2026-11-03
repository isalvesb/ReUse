export const FIELD_LIMITS = Object.freeze({
    name: 100,
    email: 254,
    password: 128,
    location: 160,
    bio: 1000,
});

export const MIN_PASSWORD_LENGTH = 8;

export function normalizeEmail(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(value) {
    const email = normalizeEmail(value);

    return email.length > 0
        && email.length <= FIELD_LIMITS.email
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
        return `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`;
    }

    if (password.length > FIELD_LIMITS.password) {
        return `A senha pode ter no máximo ${FIELD_LIMITS.password} caracteres.`;
    }

    return null;
}
