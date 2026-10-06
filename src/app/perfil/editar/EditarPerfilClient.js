"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState, useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import FormField from "@/components/FormField";
import { updateProfile } from "../actions";
import { FIELD_LIMITS } from "@/lib/validation.mjs";

const initialState = { error: null };

export default function EditarPerfilClient({ user }) {
    const [nome, setNome] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [localizacao, setLocalizacao] = useState(user.location ?? "");
    const [sobre, setSobre] = useState(user.bio ?? "");

    const [state, formAction, pending] = useActionState(updateProfile, initialState);

    return (
        <>
            <Link
                href='/perfil'
                className="mt-4 flex items-center gap-2 text-base font-medium"
            >
                <ArrowLeft size={20} strokeWidth={1.8} className="ml-5" />
                Voltar
            </Link>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-medium">
                Perfil
            </h1>
            <div className="w-[70px]" />

            {/* CONTEÚDO */}
            <section className="mx-auto w-full max-w-[390px] px-5 pb-8">

                {/* FOTO */}
                <div className="relative mx-auto mt-[38px] h-[128px] w-[128px]">

                    <div className="h-[128px] w-[128px] overflow-hidden rounded-full border-[3px] border-reuse-white bg-[#E5E7EB] shadow-lg">
                        <Image
                            src={user.avatarUrl || "/images/perfil/avatar.png"}
                            alt={`Foto de ${user.name}`}
                            width={117}
                            height={117}
                            className='h-full w-full object-cover'
                        />
                    </div>

                </div>

                {/* FORMULÁRIO */}
                <form
                    id="perfil-form"
                    action={formAction}
                    className="mt-6 rounded-[14px] border border-[#E5E7EB] bg-reuse-white p-[25px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">

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

                    {/* SOBRE MIM */}
                    <div className="mt-6">
                        <label htmlFor="bio" className="block text-sm font-medium leading-5 text-[#4A5565]">
                            Sobre mim
                        </label>

                        <textarea
                            id="bio"
                            name="bio"
                            value={sobre}
                            onChange={(event) => setSobre(event.target.value)}
                            maxLength={FIELD_LIMITS.bio}
                            className="mt-2 h-[120px] w-full resize-none rounded-[10px] border border-reuse-brown bg-reuse-white px-3 py-2 text-base leading-[26px] text-reuse-brown outline-none"
                        />
                    </div>

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
                        <Check size={18} />
                    </button>

                </div>
            </section>
        </>
    );
}
