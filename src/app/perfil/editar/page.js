"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Camera, Check, X } from "lucide-react";
import Header from "@/components/Header";
import FormField from '@/components/FormField';


export default function EditarPerfil() {
    const [nome, setNome] = useState("Maria Silva");
    const [email, setEmail] = useState('maria.silva@email.com');
    const [localizacao, setLocalizacao] = useState('São Paulo, SP');
    const [sobre, setSobre] = useState(
        "Apaixonada por sustentabilidade e consumo consciente. Acredito que pquenas ações fazem grandes diferenças para o planeta."
    );

    function handleSubmit(event) {
        event.preventDefault();

        console.log({
            nome,
            email,
            localizacao,
            sobre,
        });
    }

    return (
        <main className="min-h-screen bg-reuse-cream">

            {/* HEADER */}
            <Header loggedIn />

            <Link
                href='/perfil'
                className="flex items-center gap-2 text-1rem font-medium mt-4 "
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

                    <div className="h-[128px] w[-128px] overflow-hidden rounded-full border-[3px] border-reuse-white bg-[#E5E7EB] shadow-lg">
                        <Image
                            src='/images/perfil/maria-silva.png'
                            alt='Foto de Maria Silva'
                            width={117}
                            height={117}
                            className='h-full w-full object-cover'
                        />
                    </div>

                    {/* BOTÃO CÂMERA */}
                    <button
                        type="button"
                        aria-label="Alterar foto"
                        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-reuse-brown text-reuse-white shadow-md">
                        <Camera
                            size={20}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>

                {/* FORMULÁRIO */}
                <form
                    id="perfil-form"
                    onSubmit={handleSubmit}
                    className="mt-6 rounded-[14px] border border-[#E5E7EB] bg-reuse-white p-[25px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">

                    {/* NOME */}
                    <FormField
                        label='Nome'
                        value={nome}
                        onChange={setNome}
                    />

                    {/* EMAIL */}
                    <FormField
                        label='E-mail'
                        value={email}
                        onChange={setEmail}
                        active
                    />

                    {/* LOCALIZAÇÃO */}
                    <FormField
                        label='Localização'
                        value={localizacao}
                        onChange={setLocalizacao}
                        active
                    />

                    {/* SOBRE MIM */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium leading-5 text-[#4A5565]">
                            Sobre mim
                        </label>

                        <textarea
                            value={sobre}
                            onChange={(event) => setSobre(event.target.value)}
                            className="mt-2 h-[120px] w-full resize-none rounded-[10px] border border-reuse-brow bg-reuse-white px-3 py-2 text-1rem leading-[26px] text-reuse-brown outline-none"
                        />
                    </div>

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
                        aria-label="Salvar"
                        className="flex h-9 w-10 items-center justify-center rounded-[10px] bg-reuse-brown text-reuse-white">
                        <Check size={18} />
                    </button>

                </div>
            </section>
        </main>
    );
}