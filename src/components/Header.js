"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    Search,
    Bell,
    ShoppingBag,
    User,
    Package,
    Heart,
    MessageCircle,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";

import Button from "@/components/Button";
import { signOut } from "@/app/login/actions";


export default function Header({
    loggedIn = false,
    avatarUrl,
    unreadCount = 0,
}) {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Fecha o menu quando clicar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full shrink-0 bg-reuse-brown px-6 py-3">
            <div className="mx-auto flex h-[46px] max-w-[1344px] items-center justify-between gap-6">

                {/* Logo */}
                <Link href="/">
                    <Image
                        src="/images/logo/ReUse-creme.png"
                        width={130}
                        height={16}
                        alt="ReUse"
                        className="h-auto w-[130px]"
                        priority
                    />
                </Link>

                {/* Busca */}
                <div className="hidden w-[350px] md:flex">
                    <div className="flex h-10 w-full items-center rounded-2xl bg-reuse-cream px-4">
                        <input
                            type="text"
                            placeholder="Busque sapato, poltrona, notebook..."
                            className="w-full bg-transparent text-sm text-reuse-brown outline-none placeholder:text-reuse-brown-light"
                        />

                        <Search
                            size={20}
                            strokeWidth={2}
                            className="text-reuse-brown"
                        />
                    </div>
                </div>

                {/* Navegação */}
                <nav className="hidden items-center gap-8 text-sm text-reuse-white lg:flex">
                    <Link
                        href="/eletronicos"
                        className="transition hover:text-reuse-pink"
                    >
                        Eletrônicos
                    </Link>

                    <Link
                        href="/roupas"
                        className="transition hover:text-reuse-pink"
                    >
                        Roupas
                    </Link>

                    <Link
                        href="/moveis"
                        className="transition hover:text-reuse-pink"
                    >
                        Móveis
                    </Link>

                    <Link
                        href="/livros"
                        className="transition hover:text-reuse-pink"
                    >
                        Livros
                    </Link>

                    {loggedIn && (
                        <Link
                            href="/vitrine"
                            className="font-bold transition hover:text-reuse-pink"
                        >
                            Minha Vitrine
                        </Link>
                    )}
                </nav>

                {/* Área do usuário */}
                {loggedIn ? (
                    <div className="flex items-center gap-7">

                        {/* Notificações */}
                        <Link
                            href="/notificacoes"
                            className="relative text-reuse-white transition hover:text-reuse-pink"
                            aria-label="Notificações"
                        >
                            <Bell size={22} strokeWidth={1.8} />

                            {unreadCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-reuse-pink text-[9px] font-bold text-reuse-brown">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* Sacola */}
                        <Link
                            href="/vitrine"
                            className="text-reuse-white transition hover:text-reuse-pink"
                            aria-label="Minha sacola"
                        >
                            <ShoppingBag
                                size={21}
                                strokeWidth={1.8}
                            />
                        </Link>

                        {/* Foto + Menu */}
                        <div
                            ref={profileRef}
                            className="relative"
                        >
                            <button
                                type="button"
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="relative h-8 w-8 overflow-hidden rounded-full transition hover:ring-2 hover:ring-reuse-pink"
                                aria-label="Abrir menu do perfil"
                                aria-expanded={profileOpen}
                            >
                                <Image
                                    src={
                                        avatarUrl ||
                                        "/images/perfil/avatar.png"
                                    }
                                    alt="Meu perfil"
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                />
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                <div className="absolute right-0 top-11 z-50 w-[260px] overflow-hidden rounded-2xl bg-reuse-cream shadow-xl">

                                    {/* Cabeçalho */}
                                    <Link
                                        href="/perfil"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-4 transition hover:bg-reuse-pink/20"
                                    >
                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                            <Image
                                                src={
                                                    avatarUrl ||
                                                    "/images/perfil/avatar.png"
                                                }
                                                alt="Meu perfil"
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-reuse-brown">
                                                Meu perfil
                                            </p>

                                            <p className="text-xs text-reuse-brown-light">
                                                Ver perfil
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="h-px bg-reuse-brown/10" />

                                    {/* Opções principais */}
                                    <div className="p-2">

                                        <Link
                                            href="/perfil"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <User size={18} />
                                            <span>Meu perfil</span>
                                        </Link>

                                        <Link
                                            href="/vitrine"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <Package size={18} />
                                            <span>Meus itens</span>
                                        </Link>

                                        <Link
                                            href="/favoritos"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <Heart size={18} />
                                            <span>Favoritos</span>
                                        </Link>

                                        <Link
                                            href="/chat"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <MessageCircle size={18} />
                                            <span>Mensagens</span>
                                        </Link>

                                        <Link
                                            href="/notificacoes"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <Bell size={18} />
                                            <span>Notificações</span>

                                            {unreadCount > 0 && (
                                                <span className="ml-auto rounded-full bg-reuse-pink px-2 py-0.5 text-[10px] font-bold text-reuse-brown">
                                                    {unreadCount > 9
                                                        ? "9+"
                                                        : unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>

                                    <div className="h-px bg-reuse-brown/10" />

                                    {/* Configurações e ajuda */}
                                    <div className="p-2">

                                        <Link
                                            href="/configuracoes"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <Settings size={18} />
                                            <span>Configurações</span>
                                        </Link>

                                        <Link
                                            href="/ajuda"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <HelpCircle size={18} />
                                            <span>Ajuda</span>
                                        </Link>
                                    </div>

                                    <div className="h-px bg-reuse-brown/10" />

                                    {/* Sair */}
                                    <form action={signOut}>
                                        <div className="p-2">
                                            <button
                                                type="submit"
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                            >
                                                <LogOut size={18} />
                                                <span>Sair</span>
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Button href="/login">
                        Entrar
                    </Button>
                )}
            </div>
        </header >
    );
}

