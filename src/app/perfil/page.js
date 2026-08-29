"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import ProfileItemCard from "@/components/ProfilleItemCard";

const items = [
    {
        id: 1,
        name: 'Cadeira de madeira',
        condition: 'Usado • Bom estado',
        distance: '1 km de você',
        type: 'Venda',
        price: 'R$ 250',
        image: '/images/itens/cadeira.jpg',
        category: 'vendas',
    },
    {
        id: 2,
        name: 'Jaqueta de couro',
        condition: 'Usado • Tam 40',
        distance: '2 km de você',
        type: 'Troca',
        price: null,
        image: '/images/itens/jaqueta.jpg',
        category: 'trocas',
    },
    {
        id: 3,
        name: 'Teclado gamer',
        condition: 'Usado • Bom estado',
        distance: '2 km de você',
        type: 'Venda',
        price: 'R$ 250',
        image: '/images/itens/teclado.jpg',
        category: 'vendas',
    },
    {
        id: 4,
        name: 'Câmera vintage',
        condition: 'Bom estado',
        distance: '3 km de você',
        type: 'Venda',
        price: 'R$ 350',
        image: '/images/itens/camera-vintage.jpg',
        category: 'vendas',
    },
];

const filters = [
    { label: 'Todos', value: 'todos' },
    { label: 'Doações', value: 'doacoes' },
    { label: 'Trocas', value: 'trocas' },
    { label: 'Vendas', value: 'vendas' },
];

export default function Perfil() {
    const [activeFilter, setActiveFilter] = useState('todos');

    const filteredItems =
        activeFilter === 'todos'
            ? items
            : items.filter((item) => item.category === activeFilter);

    return (
        <>
            <Header loggedIn />

            <main className="mx-auto max-w-7xl px-10 py-13.25">
                <div className="grid grid-cols-[421px_1fr] gap-24.75">

                    {/* COLUNA ESQUERDA */}
                    <aside className="flex flex-col">
                        <ProfileHeader />

                        <div className="mt-11.75">
                            <ProfileInfo />
                        </div>

                        <button className="mt-5 text-center text-base font-medium text-reuse-brown hover:underline">
                            Deslogar
                        </button>

                    </aside>

                    {/* COLUNA DIREITA */}
                    <section>

                        {/* FILTROS */}
                        <div className="flex items-center gap-2">

                            {filters.map((filter) => {
                                const active =
                                    activeFilter === filter.value;

                                return (
                                    <button
                                        key={filter.value}
                                        onClick={() =>
                                            setActiveFilter(filter.value)
                                        }
                                        className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${active
                                            ? "border-reuse-brown bg-reuse-brown text-reuse-white"
                                            : "border-reuse-brown/10 bg-reuse-white text-reuse-brown-light hover:bg-reuse-cream"
                                            }`}>
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
                        <div className="mt-5 grid grid-cols-4 gap-x-15 gap-y-10 pb-12">

                            {filteredItems.map((item) => (
                                <ProfileItemCard
                                    key={item.id}
                                    name={item.name}
                                    condition={item.condition}
                                    distance={item.distance}
                                    type={item.type}
                                    price={item.price}
                                    image={item.image}
                                />
                            ))}
                        </div>

                        {/* BOTÃO */}
                        <div className="mt-4 flex justify-center">
                            <Button
                                href='/publicar-item'
                                variant="secondary"
                                className="w-63.5 rounded-[14px]"
                            >
                                Publicar Novo Item
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}