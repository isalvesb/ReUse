"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PublishFormFields } from "./PublishFormFields";
import { preparePhoto, completePhoto, saveSharedItem } from "./item-actions";
const CONDITIONS = {
  Novo: "NOVO",
  "Usado • Como Novo": "USADO_COMO_NOVO",
  "Usado • Bom Estado": "USADO_BOM_ESTADO",
  "Usado • Estado Regular": "USADO_ESTADO_REGULAR",
};
export default function SharedItemForm({ initial = {} }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  const prepared = useRef(new Map());
  const creation = useRef(null),
    router = useRouter();
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setSuccess(false);
    try {
      creation.current ||= crypto.randomUUID();
      const photos = JSON.parse(form.get("retainedPhotos") || "[]");
      for (const file of form.getAll("photos").filter((f) => f.size)) {
        const photoKey = `${file.name}:${file.size}:${file.lastModified}`;
        if (prepared.current.has(photoKey)) {
          photos.push({ uploadId: prepared.current.get(photoKey) });
          continue;
        }
        const signed = await preparePhoto({ type: file.type, size: file.size });
        if (signed.error) throw Error(signed.error);
        const uploaded = await fetch(signed.data.url, {
          method: "PUT",
          headers: { "Content-Type": file.type, "x-upsert": "false" },
          body: file,
        });
        if (!uploaded.ok)
          throw Error("Falha no envio da foto. Tente novamente.");
        const verified = await completePhoto(signed.data.id);
        if (verified.error) throw Error(verified.error);
        prepared.current.set(photoKey, signed.data.id);
        photos.push({ uploadId: signed.data.id });
      }
      const input = {
        title: form.get("title"),
        description: form.get("description"),
        category: form.get("category"),
        type: form.get("negotiationType")?.toUpperCase(),
        condition: CONDITIONS[form.get("condition")],
        price: form.get("price") || null,
        location: form.get("location") || "",
        status: form.get("status") || initial.status || "ATIVO",
        photos,
        ...(initial.id
          ? { updatedAt: initial.updatedAt }
          : { creationKey: creation.current }),
      };
      const result = await saveSharedItem(input, initial.id);
      if (result.error) throw Error(result.error);
      setSuccess(true);
      router.push(`/produto/${result.data.id}`);
      router.refresh();
    } catch (e) {
      setError(e.message || "Falha ao salvar. Seus dados foram preservados.");
    } finally {
      setBusy(false);
    }
  }
  const conditionLabel = Object.entries(CONDITIONS).find(
    ([, value]) => value === initial.condition,
  )?.[0];
  return (
    <form onSubmit={submit}>
      <PublishFormFields initial={{ ...initial, conditionLabel }} />
      {initial.id && (
        <label className="mt-4 block">
          Estado
          <select
            name="status"
            defaultValue={initial.status}
            className="m-3 rounded-xl border p-3"
          >
            {(initial.status === "ATIVO" || initial.status === "INATIVO"
              ? ["ATIVO", "INATIVO"]
              : [initial.status]
            ).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      )}
      {error && (
        <p role="alert" className="my-4 text-red-700">
          {error}
        </p>
      )}
      {success && <p role="status">Anúncio salvo.</p>}
      {!initial.id && <p className="mt-4 text-center text-sm text-[#6a7282]">Ao publicar, você confirma que tem autorização para anunciar o item e que as informações fornecidas são verdadeiras.</p>}
      <button
        disabled={busy}
        className="my-6 min-h-12 rounded-xl bg-reuse-pink px-8 text-reuse-brown"
      >
        {busy
          ? "Enviando e salvando..."
          : initial.id
            ? "Salvar anúncio"
            : "Publicar Item"}
      </button>
    </form>
  );
}
