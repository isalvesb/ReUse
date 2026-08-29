import Link from "next/link";
import { Search, Bell, ShoppingBag } from "lucide-react";
import Button from "@/components/Button";
import Image from "next/image";

export default function Header({ loggedIn = false }) {
    return (
        <header className="w-full bg-reuse-brown px-6 py-3">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">

                {/* Logo */}
                <Link
                    href="/">
                    <Image
                        src='/images/logo/ReUse-creme.png'
                        width={130}
                        height={16}
                        alt="Logo creme"
                        className="h-auto w-32.5"
                        priority
                    />
                </Link>

                {/* Busca */}
                <div className="hidden w-87.5 md:flex">
                    <div className="flex w-full items-center rounded-2xl bg-reuse-cream px-4">
                        <input
                            type="text"
                            placeholder="Busque sapato, poltrona, notebook..."
                            className="w-full bg-transparent text-sm text-reuse-brown outline-none placeholder:text-reuse-brown-light"
                        />

                        <Search
                            size={24}
                            strokeWidth={2}
                            className="text-reuse-brown"
                        />
                    </div>
                </div>

                {/* Navegação */}
                <nav className="hidden items-center gap-8 text-sm text-reuse-white lg:flex">
                    <Link
                        href="/eletronicos"
                        className="hover:text-reuse-pink transition"
                    >
                        Eletrônicos
                    </Link>

                    <Link
                        href="/roupas"
                        className="hover:text-reuse-pink transition"
                    >
                        Roupas
                    </Link>

                    <Link
                        href="/moveis"
                        className="hover:text-reuse-pink transition"
                    >
                        Móveis
                    </Link>

                    <Link
                        href="/livros"
                        className="hover:text-reuse-pink transition"
                    >
                        Livros
                    </Link>

                    {loggedIn && (
                        <Link
                            href="/vitrine"
                            className="font-bold hover:text-reuse-pink transition"
                        >
                            Minha Vitrine
                        </Link>
                    )}
                </nav>

                {/* Área do Usuário */}
                {loggedIn ? (
                    <div className="flex items-center gap-7">

                        {/* NOTIFICAÇÕES */}
                        <Link
                            href='/notificacoes'
                            className="relative text-reuse-white hover:text-reuse-pink "
                )}

                        {/* Publicar */}
                        <Button href="/publicar-item">
                            Publicar Item
                        </Button>

                    </div>
        </header>
    );
}