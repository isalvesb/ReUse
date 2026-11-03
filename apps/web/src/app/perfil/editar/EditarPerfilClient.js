"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { Check, ImageUp, Pencil, X, LoaderCircle } from "lucide-react";
import FormField from "@/components/FormField";
import BackButton from "@/components/BackButton";
import { updateProfile, updateBio } from "../actions";
import { FIELD_LIMITS } from "@/lib/validation.mjs";
import SpriteImage from "@/components/SpriteImage";
import { getAvatarSource } from "@/lib/sprite";

const initialState = { error: null };
const DEFAULT_AVATARS = Array.from(
    { length: 6 },
    (_, index) => `/images/pranchas/prancha8.png#sprite=${index + 1}`
);

export default function EditarPerfilClient({ user }) {
    const [nome, setNome] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [localizacao, setLocalizacao] = useState(user.location ?? "");
    const [sobre, setSobre] = useState(user.bio ?? "");
    const [savedBio, setSavedBio] = useState(user.bio ?? "");
    const [editingBio, setEditingBio] = useState(false);
    const [savingBio, setSavingBio] = useState(false);
    const [bioError, setBioError] = useState("");
    const [bioSuccess, setBioSuccess] = useState("");
    const bioInputRef = useRef(null);
    const [selectedAvatar, setSelectedAvatar] = useState(
        DEFAULT_AVATARS.includes(user.avatarUrl) ? user.avatarUrl : "current"
    );
    const [uploadedPreview, setUploadedPreview] = useState("");
    const [avatarOptionsOpen, setAvatarOptionsOpen] = useState(false);
    const previousPreviewRef = useRef("");
    const avatarInputRef = useRef(null);

    const [state, formAction, pending] = useActionState(updateProfile, initialState);

    useEffect(() => () => {
        if (previousPreviewRef.current) {
            URL.revokeObjectURL(previousPreviewRef.current);
        }
    }, []);

    function handleAvatarUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (previousPreviewRef.current) {
            URL.revokeObjectURL(previousPreviewRef.current);
        }

        const preview = URL.createObjectURL(file);
        previousPreviewRef.current = preview;
        setUploadedPreview(preview);
        setSelectedAvatar("upload");
    }

    function chooseIllustratedAvatar(source) {
        if (previousPreviewRef.current) {
            URL.revokeObjectURL(previousPreviewRef.current);
            previousPreviewRef.current = "";
        }
        if (avatarInputRef.current) avatarInputRef.current.value = "";
        setSelectedAvatar(source);
        setUploadedPreview("");
    }

    async function handleSaveBio() {
        if (savingBio) return;
        setBioError("");
        setBioSuccess("");
        setSavingBio(true);
        try {
            const data = new FormData();
            data.set("bio", sobre);
            const result = await updateBio(null, data);
            if (result?.error) {
                setBioError(result.error);
                return;
            }
            const nextBio = result?.bio ?? sobre.trim();
            setSavedBio(nextBio);
            setSobre(nextBio);
            setEditingBio(false);
            setBioSuccess("Descrição atualizada.");
        } catch {
            setBioError("Não foi possível salvar a descrição. Tente novamente.");
        } finally {
            setSavingBio(false);
        }
    }

    function handleCancelBio() {
        setSobre(savedBio);
        setEditingBio(false);
        setBioError("");
    }

    const previewSource = uploadedPreview
        || (DEFAULT_AVATARS.includes(selectedAvatar)
            ? selectedAvatar
            : getAvatarSource(user.avatarUrl, user.id || user.email));

    return (
        <>
            <BackButton
                fallback="/perfil"
                className="ml-5 mt-4 flex items-center gap-2 text-base font-medium"
            >
                Voltar
            </BackButton>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-medium">
                Perfil
            </h1>
            <div className="w-[70px]" />

            {/* CONTEÚDO */}
            <section className="mx-auto w-full max-w-[390px] px-5 pb-8">

                {/* FOTO */}
                <div className="relative mx-auto mt-8 h-[140px] w-[140px]">

                    <div className="relative h-[140px] w-[140px] overflow-hidden rounded-full border-[3px] border-reuse-white bg-reuse-cream shadow-lg" style={{ clipPath: "circle(50% at 50%)" }}>
                        <SpriteImage
                            src={previewSource}
                            alt={`Foto de ${user.name}`}
                            fill
                            sizes="140px"
                            unoptimized={previewSource.startsWith("blob:")}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        aria-label={avatarOptionsOpen ? "Ocultar opções de foto do perfil" : "Alterar foto do perfil"}
                        aria-expanded={avatarOptionsOpen}
                        aria-controls="avatar-options"
                        onClick={() => setAvatarOptionsOpen((open) => !open)}
                        className="absolute bottom-0 right-0 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[3px] border-reuse-white bg-reuse-brown text-reuse-white shadow-md transition hover:bg-reuse-brown-light active:scale-95"
                    >
                        <Pencil size={18} aria-hidden="true" />
                    </button>
                </div>

                {/* FORMULÁRIO */}
                <form
                    id="perfil-form"
                    action={formAction}
                    aria-busy={pending}
                    className="mt-6 rounded-[14px] border border-[#E5E7EB] bg-reuse-white p-[25px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">

                    <fieldset id="avatar-options" className={avatarOptionsOpen ? "" : "hidden"}>
                        <legend className="text-sm font-medium leading-5 text-[#4A5565]">
                            Imagem do perfil
                        </legend>
                        <p className="mt-1 text-xs leading-5 text-reuse-brown-light">
                            Envie uma foto ou escolha um dos avatares ReUse.
                        </p>

                        <input type="hidden" name="avatarChoice" value={selectedAvatar} />
                        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                            {DEFAULT_AVATARS.map((source, index) => {
                                const selected = selectedAvatar === source;

                                return (
                                    <button
                                        key={source}
                                        type="button"
                                        aria-label={`Escolher avatar ilustrado ${index + 1}`}
                                        aria-pressed={selected}
                                        onClick={() => chooseIllustratedAvatar(source)}
                                        className={`relative aspect-square overflow-hidden rounded-full border-2 bg-reuse-cream transition ${selected
                                            ? "border-reuse-brown ring-2 ring-reuse-pink"
                                            : "border-transparent hover:border-reuse-pink"
                                            }`}
                                    >
                                        <SpriteImage
                                            src={source}
                                            alt=""
                                            fill
                                            sizes="56px"
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-reuse-brown/25 px-4 py-2 text-sm font-medium text-reuse-brown transition hover:bg-reuse-cream">
                            <ImageUp aria-hidden="true" size={18} />
                            Escolher imagem
                            <input
                                ref={avatarInputRef}
                                type="file"
                                name="avatar"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleAvatarUpload}
                                className="sr-only"
                            />
                        </label>
                    </fieldset>

                    {avatarOptionsOpen && <div className="my-6 h-px bg-reuse-brown/10" />}

                    {/* NOME */}
                    <FormField
                        label='Nome'
                        name='name'
                        value={nome}
                        onChange={setNome}
                        maxLength={FIELD_LIMITS.name}
                        active
                    />

                    {/* EMAIL */}
                    <FormField
                        label='E-mail'
                        name='email'
                        value={email}
                        onChange={setEmail}
                        type="email"
                        maxLength={FIELD_LIMITS.email}
                        readOnly
                        active
                    />

                    {/* LOCALIZAÇÃO */}
                    <FormField
                        label='Localização'
                        name='location'
                        value={localizacao}
                        onChange={setLocalizacao}
                        maxLength={FIELD_LIMITS.location}
                        active
                    />

                    {/* SOBRE MIM — edição deliberada, salvar e cancelar */}
                    <section aria-labelledby="bio-heading" className="mt-6">
                        <div className="flex min-h-11 items-center justify-between gap-3">
                            <h2 id="bio-heading" className="text-sm font-medium text-[#4A5565]">Sobre mim</h2>
                            <div className="flex items-center gap-2">
                                {!editingBio ? (
                                    <button
                                        type="button"
                                        aria-label="Editar Sobre mim"
                                        onClick={() => {
                                            setBioError("");
                                            setBioSuccess("");
                                            setEditingBio(true);
                                            requestAnimationFrame(() => bioInputRef.current?.focus());
                                        }}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-reuse-brown/20 text-reuse-brown transition hover:bg-reuse-cream active:scale-95"
                                    >
                                        <Pencil size={17} aria-hidden="true" />
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Cancelar edição do Sobre mim"
                                            onClick={handleCancelBio}
                                            disabled={savingBio}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-reuse-brown/25 text-reuse-brown transition hover:bg-reuse-cream active:scale-95 disabled:opacity-50"
                                        >
                                            <X size={17} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Salvar Sobre mim"
                                            onClick={() => void handleSaveBio()}
                                            disabled={savingBio}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-reuse-brown text-reuse-white transition hover:bg-reuse-brown-light active:scale-95 disabled:opacity-50"
                                        >
                                            {savingBio ? <LoaderCircle size={17} aria-hidden="true" className="animate-spin" /> : <Check size={17} aria-hidden="true" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <textarea
                            ref={bioInputRef}
                            id="bio"
                            name="bio"
                            aria-label="Sobre mim"
                            readOnly={!editingBio}
                            tabIndex={editingBio ? 0 : -1}
                            value={sobre}
                            onChange={(event) => setSobre(event.target.value)}
                            maxLength={FIELD_LIMITS.bio}
                            placeholder="Você ainda não escreveu uma descrição sobre você."
                            className={`mt-2 min-h-[120px] w-full resize-y rounded-[10px] border px-3 py-2 text-base leading-[26px] text-reuse-brown outline-none placeholder:text-reuse-brown/40 ${editingBio ? "border-reuse-brown bg-reuse-white" : "border-reuse-brown/15 bg-reuse-cream/45"}`}
                        />
                        {bioError && <p role="alert" className="mt-2 text-xs font-medium text-red-700">{bioError}</p>}
                        {bioSuccess && <p role="status" className="mt-2 text-xs text-green-800">{bioSuccess}</p>}
                    </section>

                    {state?.error && (
                        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
                            {state.error}
                        </p>
                    )}

                </form>

                {/* BOTÕES */}
                <div className="mt-4 flex justify-end gap-2">

                    <Link
                        href='/perfil'
                        aria-label="Cancelar"
                        className="flex h-9 w-[42px] items-center justify-center rounded-[10px] border border-reuse-brown text-reuse-brown">
                        <X size={18} />
                    </Link>

                    <button
                        type="submit"
                        form="perfil-form"
                        disabled={pending}
                        aria-label="Salvar"
                        className="flex h-9 w-10 items-center justify-center rounded-[10px] bg-reuse-brown text-reuse-white disabled:opacity-50">
                        {pending ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
                    </button>

                </div>
            </section>
        </>
    );
}
