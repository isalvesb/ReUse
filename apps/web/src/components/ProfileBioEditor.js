"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, Pencil, X } from "lucide-react";
import { updateBio } from "@/app/perfil/actions";
import { FIELD_LIMITS } from "@/lib/validation.mjs";

const initialState = { success: false, error: null, bio: null };

export default function ProfileBioEditor({ bio = "", canEdit = false }) {
    const [savedBio, setSavedBio] = useState(bio);
    const [draftBio, setDraftBio] = useState(bio);
    const [editing, setEditing] = useState(false);
    const textareaRef = useRef(null);
    const [state, formAction, pending] = useActionState(
        async (previousState, formData) => {
            const result = await updateBio(previousState, formData);

            if (result?.success) {
                const nextBio = result.bio || "";
                setSavedBio(nextBio);
                setDraftBio(nextBio);
                setEditing(false);
            }

            return result;
        },
        initialState
    );

    useEffect(() => {
        if (editing) textareaRef.current?.focus();
    }, [editing]);

    function cancelEditing() {
        setDraftBio(savedBio);
        setEditing(false);
    }

    return (
        <section aria-labelledby="profile-bio-title" className="w-full">
            <div className="flex min-h-11 items-center justify-between gap-3">
                <h2 id="profile-bio-title" className="text-xl font-bold text-reuse-brown">
                    Sobre mim
                </h2>

                {canEdit && !editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        aria-label="Editar Sobre mim"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2D5AB] text-reuse-brown transition hover:bg-reuse-pink"
                    >
                        <Pencil aria-hidden="true" size={19} />
                    </button>
                )}
            </div>

            {editing ? (
                <form action={formAction} aria-busy={pending} className="mt-3">
                    <label htmlFor="profile-bio" className="sr-only">Sobre mim</label>
                    <textarea
                        ref={textareaRef}
                        id="profile-bio"
                        name="bio"
                        value={draftBio}
                        onChange={(event) => setDraftBio(event.target.value)}
                        maxLength={FIELD_LIMITS.bio}
                        className="min-h-[180px] w-full resize-y rounded-2xl border border-reuse-brown/25 bg-[#F3E8D2] px-4 py-4 text-base leading-6 text-reuse-brown outline-none focus-visible:border-reuse-brown"
                    />
                    <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={pending}
                            aria-label="Descartar alterações"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-reuse-brown/25 text-reuse-brown transition hover:bg-reuse-white disabled:opacity-50"
                        >
                            <X aria-hidden="true" size={19} />
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            aria-label={pending ? "Salvando Sobre mim" : "Salvar Sobre mim"}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-reuse-brown text-reuse-white transition hover:bg-reuse-brown-light disabled:opacity-50"
                        >
                            {pending ? <LoaderCircle aria-hidden="true" size={19} className="animate-spin" /> : <Check aria-hidden="true" size={19} />}
                        </button>
                    </div>
                    {pending && <p role="status" className="mt-2 text-right text-sm text-reuse-brown-light">Salvando alterações...</p>}
                </form>
            ) : (
                <div className="mt-3 min-h-[180px] w-full rounded-2xl bg-[#F3E8D2] px-4 py-5">
                    <p className={`whitespace-pre-line text-base leading-6.5 ${savedBio
                        ? "text-reuse-brown"
                        : "text-reuse-brown-light/75"
                        }`}
                    >
                        {savedBio || "Adicione uma breve descrição sobre você."}
                    </p>
                </div>
            )}

            {state?.error && (
                <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                    {state.error}
                </p>
            )}
            {state?.success && !editing && (
                <p role="status" className="mt-3 text-sm font-medium text-green-700">
                    Sobre mim atualizado com sucesso.
                </p>
            )}
        </section>
    );
}
