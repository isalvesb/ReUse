"use client";

import { useState } from "react";

import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import ProfileItemCard from "@/components/ProfileItemCard";

const filters = [
    { label: "Todos", value: "todos" },
    { label: "Doações", value: "doacoes" },
    { label: "Trocas", value: "trocas" },
    { label: "Vendas", value: "vendas" },
];

const FILTER_TYPE_MAP = {
    todos: null,
    doacoes: "DOACAO",
    trocas: "TROCA",
    vendas: "VENDA",
};

export default function PerfilPublicoClient({ user, items }) {
    const [activeFilter, setActiveFilter] = useState("todos");

    const filterType = FILTER_TYPE_MAP[activeFilter];

    const filteredItems = filterType
        ? items.filter(
            (item) => item.negotiationType === filterType
        )
        : items;

    const tradesCount = items.filter(
        (item) => item.negotiationType === "TROCA"
    ).length;

    const salesCount = items.filter(
        (item) => item.negotiationType === "VENDA"
    ).length;

    return (
        <main className="w-full bg-reuse-cream">
            <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-13.25">

                {/* =========================
                    PERFIL
                ========================= */}
                <div className="grid gap-12 lg:grid-cols-[minmax(0,421px)_minmax(0,1fr)] lg:gap-12 xl:gap-24.75">

                    {/* =========================
                        COLUNA ESQUERDA
                    ========================= */}
                    <aside className="mx-auto flex w-full max-w-[421px] flex-col lg:mx-0">

                        <ProfileHeader
                            name={user.name}
                            location={user.location}
                            avatarUrl={user.avatarUrl}
                            avatarKey={user.id}
                            memberSince={user.memberSince}
                        />

                        <div className="mt-11.75">
                            <ProfileInfo
                                tradesCount={tradesCount}
                                salesCount={salesCount}
                                rating={user.rating}
                                bio={user.bio}
                            />
                        </div>

                    </aside>

                    {/* =========================
                        COLUNA DIREITA
                    ========================= */}
                    <section>

                        {/* FILTROS */}
                        <div className="flex flex-wrap items-center gap-2">
                            {filters.map((filter) => {
                                const active =
                                    activeFilter === filter.value;

                                return (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() =>
                                            setActiveFilter(
                                                filter.value
                                            )
                                        }
                                        className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${active
                                                ? "border-reuse-brown bg-reuse-brown text-reuse-white"
                                                : "border-reuse-brown/10 bg-reuse-white text-reuse-brown-light hover:bg-reuse-cream"
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* QUANTIDADE */}
                        <p className="mt-5 text-xs text-reuse-beige">
                            {filteredItems.length} itens
                        </p>

                        {/* CARDS */}
                        {filteredItems.length > 0 ? (
                            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(173px,1fr))] justify-items-center gap-6 pb-12 lg:justify-items-start">
                                {filteredItems.map((item, index) => (
                                    <ProfileItemCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        condition={item.condition}
                                        distance={item.distance}
                                        type={item.type}
                                        price={item.price}
                                        image={item.image}
                                        eager={index === 0}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-5 text-sm text-reuse-brown-light">
                                {activeFilter === "todos"
                                    ? `${user.name} ainda não publicou nenhum item.`
                                    : "Nenhum item nessa categoria ainda."}
                            </p>
                        )}

                    </section>
                </div>
            </div>
        </main>
    );
}
