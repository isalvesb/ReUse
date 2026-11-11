"use server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { saveItem } from "@/lib/item-write-domain.mjs";
import { signPhoto, verifyPhoto, cleanupPhotos } from "@/lib/item-storage.mjs";
import { revalidatePath } from "next/cache";
async function actor() {
  const a = await getSession();
  if (!a) throw Error("Entre novamente.");
  return a;
}
function message(e) {
  return {
    error:
      e.status && e.status < 500
        ? e.message
        : "Não foi possível concluir. Seus dados foram preservados.",
  };
}
export async function preparePhoto(input) {
  try {
    const a = await actor();
    await cleanupPhotos(prisma, a);
    return { data: await signPhoto(prisma, a, input) };
  } catch (e) {
    return message(e);
  }
}
export async function completePhoto(id) {
  try {
    return { data: await verifyPhoto(prisma, await actor(), id) };
  } catch (e) {
    return message(e);
  }
}
export async function saveSharedItem(input, id) {
  try {
    const data = await saveItem(prisma, await actor(), input, id);
    for (const path of ["/", "/perfil", "/vitrine", `/produto/${data.id}`])
      revalidatePath(path);
    return { data };
  } catch (e) {
    return message(e);
  }
}
