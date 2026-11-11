import { supabase } from "./supabase";
import { fetchWithTimeout } from "./fetchWithTimeout";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { readMyProfile, apiBase } from "./profileApi";
export { readMyProfile };
export async function itemRequest(
  path: string,
  method = "GET",
  input?: unknown,
): Promise<any> {
  let session = (await supabase.auth.getSession()).data.session;
  if (!session) throw Error("Entre novamente.");
  const run = () =>
    fetchWithTimeout(
      `${apiBase()}/api/v1${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${session!.access_token}`,
          "Content-Type": "application/json",
        },
        ...(input ? { body: JSON.stringify(input) } : {}),
      },
      90000,
    );
  let r = await run();
  if (r.status === 401) {
    session = (await supabase.auth.refreshSession()).data.session;
    if (!session) throw Error("Entre novamente.");
    r = await run();
  }
  const result = await r.json();
  if (!r.ok)
    throw Error(
      result.error?.message || "Não foi possível salvar. Tente novamente.",
    );
  return result.data;
}
export async function uploadPhoto(photo: {
  uri: string;
  type: string;
  size: number;
}) {
  const signed = await itemRequest("/uploads", "POST", {
    type: photo.type,
    size: photo.size,
  });
  // React Native fetch local URI produces bytes; never send local paths as catalogue images.
  const bytes = decode(
    await FileSystem.readAsStringAsync(photo.uri, {
      encoding: FileSystem.EncodingType.Base64,
    }),
  );
  const r = await fetchWithTimeout(
    signed.url,
    {
      method: "PUT",
      headers: { "Content-Type": photo.type, "x-upsert": "false" },
      body: bytes,
    },
    90000,
  );
  if (!r.ok)
    throw Error(
      "Falha ao enviar foto. Os dados do rascunho foram preservados.",
    );
  await itemRequest(`/uploads/${signed.id}/complete`, "POST");
  return signed.id as string;
}
