import "server-only";
import { prisma } from "./prisma";
import { verifiedIdentity, providerSignOut } from "./supabase-auth.mjs";
import { provisionActor, revokeOwnSession } from "./profile-domain.mjs";

export async function actorForToken(token) { return provisionActor(prisma, await verifiedIdentity(token)); }
export async function endTokenSession(token, actor) {
    await revokeOwnSession(prisma, actor);
    try { await providerSignOut(token); } catch { /* Domain revocation already prevents token replay. */ }
}
