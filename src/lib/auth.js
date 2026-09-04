import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
