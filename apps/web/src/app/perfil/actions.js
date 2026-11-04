"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { destroySession, getCurrentUserId, getSession } from "@/lib/session";

import { updateOwnProfile } from "@/lib/profile-domain.mjs";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 3000;
const MAX_LOCATION_LENGTH = 160;

export async function logOut() {
  await destroySession();
  redirect("/login");
}

export async function updateProfile(_prevState, formData) {
  const actor = await getSession();
  if (!actor) redirect("/login");
  const avatar = formData.get("avatar");
  if (
    (avatar instanceof File && avatar.size > 0) ||
    ![null, "current"].includes(formData.get("avatarChoice"))
  ) {
    return { error: "Alteração de avatar indisponível nesta etapa." };
  }
  try {
    await updateOwnProfile(prisma, actor, {
      name: formData.get("name"),
      bio: formData.get("bio"),
    });
  } catch (error) {
    return {
      error:
        error.status === 400
          ? error.message
          : "Não foi possível salvar o perfil.",
    };
  }
  revalidatePath("/perfil");
  revalidatePath("/perfil/editar");
  redirect("/perfil");
}

export async function updateBio(_prevState, formData) {
  const actor = await getSession();
  if (!actor) redirect("/login");
  try {
    const profile = await updateOwnProfile(prisma, actor, {
      bio: formData.get("bio"),
    });
    revalidatePath("/perfil");
    revalidatePath("/perfil/editar");
    return { success: true, error: null, bio: profile.bio ?? "" };
  } catch (error) {
    return {
      success: false,
      error:
        error.status === 400
          ? error.message
          : "Não foi possível salvar a descrição.",
    };
  }
}

// Item writes moved to item-actions.js; binaries upload directly to private Storage.
