"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import Button from "@/components/Button";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import ProfileItemCard from "@/components/ProfileItemCard";
import JourneyCard from "@/components/JourneyCard";
import PhotoButton from "@/components/PhotoButton";
import FieldLabel from "@/components/FieldLabel";
import ConditionButton from "@/components/ConditionButton";
import ReuseAssistant from "@/components/ReuseAssistant";
import {
  getItemPhotoValidationError,
  ITEM_PHOTO_LIMITS,
} from "@/lib/upload-constraints.mjs";
import SharedItemForm from "./SharedItemForm";
import { itemStatistics } from "@/lib/item-statistics.mjs";

import { ChevronDown, MapPin } from "lucide-react";

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

const initialState = { error: null, success: false };

const SHOW_LEGACY_ASSISTANTS =
  process.env.NEXT_PUBLIC_SHOW_LEGACY_ASSISTANTS === "true";

export default function PerfilClient({ user, items }) {
  const statistics = itemStatistics(items);
  const [activeFilter, setActiveFilter] = useState("todos");
  const [showAllItems, setShowAllItems] = useState(false);

  const publicarRef = useRef(null);

  const filterType = FILTER_TYPE_MAP[activeFilter];
  const filteredItems = filterType
    ? items.filter((item) => item.negotiationType === filterType)
    : items;
  const visibleItems = showAllItems ? filteredItems : filteredItems.slice(0, 3);

  function scrollToPublicar() {
    publicarRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="w-full bg-reuse-cream">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-13.25">
        {/* =========================
                PERFIL
            ========================= */}

        <div
          className={
            SHOW_LEGACY_ASSISTANTS
              ? "grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)] lg:items-stretch lg:gap-10"
              : "grid gap-8"
          }
        >
          {/* ESQUERDA: identificação, biografia, estatísticas e anúncios */}
          <section className="min-w-0 space-y-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
              <div className="min-w-0 flex-1">
                <ProfileHeader
                  name={user.name}
                  email={user.email}
                  location={user.location}
                  avatarUrl={user.avatarUrl}
                  avatarKey={user.id || user.email}
                  memberSince={user.memberSince}
                />
              </div>
              <div className="w-full shrink-0 xl:w-[274px]">
                <ProfileInfo
                  tradesCount={statistics.tradeItems}
                  salesCount={statistics.saleItems}
                  rating={user.rating}
                  showBio={false}
                />
              </div>
            </div>
            <ProfileInfo bio={user.bio} showStats={false} />
            {/* MINHA VITRINE */}
            <div className="rounded-[22px] bg-reuse-white/55 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-reuse-brown">
                    Minha Vitrine
                  </h2>
                </div>

                {/* FILTROS */}

                <div className="flex flex-wrap items-center gap-2">
                  {filters.map((filter) => {
                    const active = activeFilter === filter.value;

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => {
                          setActiveFilter(filter.value);
                          setShowAllItems(false);
                        }}
                        className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                          active
                            ? "border-reuse-brown bg-reuse-brown text-reuse-white"
                            : "border-reuse-brown/10 bg-reuse-white text-reuse-brown-light hover:bg-reuse-cream"
                        } `}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUANTIDADE */}

              <p className="mt-5 text-xs text-reuse-beige">
                {filteredItems.length} itens
              </p>

              {/* CARDS */}

              <div className="mt-5 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-[repeat(auto-fit,minmax(173px,1fr))] sm:gap-6 lg:justify-items-start">
                {visibleItems.map((item, index) => (
                  <div key={item.id}>
                    <ProfileItemCard
                      id={item.id}
                      name={item.name}
                      category={item.category}
                      condition={item.condition}
                      distance={item.distance}
                      type={item.type}
                      price={item.price}
                      image={item.image}
                      eager={index === 0}
                    />
                    <a
                      className="mt-2 block underline"
                      href={`/perfil/anuncios/${item.id}`}
                    >
                      Editar anúncio
                    </a>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <p className="text-sm text-reuse-brown-light">
                  Nenhum item nessa categoria ainda.
                </p>
              )}

              {filteredItems.length > 3 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllItems((current) => !current)}
                    aria-expanded={showAllItems}
                    className="rounded-xl border border-reuse-brown/20 bg-reuse-white px-5 py-2.5 text-sm font-medium text-reuse-brown transition hover:bg-reuse-cream"
                  >
                    {showAllItems
                      ? "Mostrar menos"
                      : `Ver todos os ${filteredItems.length} itens`}
                  </button>
                </div>
              )}

              {/* BOTÃO PUBLICAR */}

              <div className="mt-7 flex justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={scrollToPublicar}
                  className="w-63.5 rounded-[14px]"
                >
                  Publicar Novo Item
                </Button>
              </div>
            </div>
          </section>

          {/* DIREITA: assistente com destaque, sem empurrá-lo abaixo da Vitrine */}
          {SHOW_LEGACY_ASSISTANTS && (
            <aside className="min-w-0 self-stretch [&>section]:mt-0! [&>section]:max-w-none! lg:[&>section]:h-full!">
              <ReuseAssistant />
            </aside>
          )}
        </div>

        {/* ==================================================FORMULÁRIO DE PUBLICAR ITEM=================================================*/}

        <section
          id="publicar-item"
          ref={publicarRef}
          className="mx-auto mt-24 w-full max-w-[598px] scroll-mt-8"
        >
          {/* JORNADA SUSTENTÁVEL */}

          <JourneyCard itemCount={items.length} />

          <SharedItemForm />
        </section>
      </div>
    </main>
  );
}
