"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import Button from "@/components/Button";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import ProfileItemCard from "@/components/ProfileItemCard";
import JourneyCard from "@/components/JourneyCard";
import PhotoButton from "@/components/PhotoButton";
import FieldLabel from "@/components/FieldLabel";
import ConditionButton from "@/components/ConditionButton";
import { logOut, publishItem } from "./actions";

import {
    ChevronDown,
    MapPin,
} from "lucide-react";

const filters = [
    { label: "Todos", value: "todos" },
    { label: "Doações", value: "doacoes" },
    { label: "Trocas", value: "trocas" },
    { label: "Vendas", value: "vendas" },
];

const FILTER_TYPE_MAP = {
    todos: null,
    doacoes: "Doação",
    trocas: "Troca",
    vendas: "Venda",
};

const initialState = { error: null, success: false };

function PublishFormFields() {
    const [condicao, setCondicao] = useState("");
    const [descricao, setDescricao] = useState("");
    const [negociacao, setNegociacao] = useState("");
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const fileInputRef = useRef(null);
    const photoPreviewsRef = useRef([]);

    useEffect(() => {
        photoPreviewsRef.current = photoPreviews;
    });

    useEffect(() => {
        return () => {
            photoPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    function handlePhotosChange(event) {
        photoPreviews.forEach((url) => URL.revokeObjectURL(url));

        const files = Array.from(event.target.files ?? []).slice(0, 5);
        setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
    }

    return (
        <>
            {/* FOTOS */}
            <section className="mt-5 rounded-[14px] border border-reuse-pink bg-reuse-white p-6.25 shadow-sm">

                {/* DICA */}

                <section className="mb-5 rounded-[10px] border border-[#FEE685] bg-[#FFFBEB] px-[17px] py-2.5">
                    <p className="text-sm leading-5 text-[#7B3306]">
                        <strong>Dica: </strong>
                        Itens com fotos claras e descrições
                        detalhadas têm 3x mais chances de serem
                        doados rapidamente!
                    </p>
                </section>


                {/* TÍTULO */}

                <h2 className="text-[18px] font-medium text-[#101828]">
                    Fotos do Item
                </h2>

                <p className="mt-4 max-w-[272px] text-[14px] leading-5 text-[#4A5565]">
                    Adicione até 5 fotos do seu item. A primeira
                    será a foto de capa.
                </p>


                {/* FOTOS */}

                <input
                    ref={fileInputRef}
                    type="file"
                    name="photos"
                    accept="image/*"
                    multiple
                    onChange={handlePhotosChange}
                    className="hidden"
                />

                <div className="mt-4 flex gap-3">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <PhotoButton
                            key={index}
                            preview={photoPreviews[index]}
                            onClick={() => fileInputRef.current?.click()}
                            onRemove={() => {
                                setPhotoPreviews((current) => {
                                    const url = current[index];
                                    if (url) URL.revokeObjectURL(url);
                                    return current.filter((_, i) => i !== index);
                                });
                            }}
                        />
                    ))}
                </div>

            </section>


            {/* DETALHES */}

            <section className="mt-5 rounded-[14px] border border-reuse-pink bg-reuse-white p-[25px] shadow-sm">

                <h2 className="text-[18px] font-medium text-[#101828]">
                    Detalhes do Item
                </h2>


                {/* TÍTULO */}

                <FieldLabel
                    label="Título"
                    required
                />

                <input
                    type="text"
                    name="title"
                    required
                    placeholder="Ex: Cadeira de escritório ergonômica"
                    className="mt-2 h-12 w-full rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5] px-3 text-1rem outline-none"
                />


                {/* PREÇO */}

                <FieldLabel
                    label="Preço"
                    required={negociacao === "venda"}
                />

                <div className="relative mt-2 flex h-12 w-[160px] items-center rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5]">

                    <span className="pl-3 text-1rem text-[#717182]">
                        R$
                    </span>

                    <input
                        type="number"
                        name="price"
                        placeholder="0,00"
                        min="0"
                        step="0.01"
                        className="h-full w-full bg-transparent px-2 text-1rem text-reuse-brown outline-none"
                    />

                </div>


                {/* CATEGORIA */}

                <FieldLabel
                    label="Categoria"
                    required
                />

                <div className="relative mt-2 w-[298px]">

                    <select
                        name="category"
                        defaultValue=""
                        required
                        className="h-12 w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-reuse-white px-3 pr-10 text-1rem text-[#717182] outline-none"
                    >
                        <option value="" disabled>
                            Selecione uma categoria
                        </option>

                        <option value="eletronicos">
                            Eletrônicos
                        </option>

                        <option value="roupas">
                            Roupas
                        </option>

                        <option value="moveis">
                            Móveis
                        </option>

                        <option value="livros">
                            Livros
                        </option>

                        <option value="sapatos">
                            Sapatos
                        </option>

                        <option value="outros">
                            Outros
                        </option>
                    </select>

                    <ChevronDown
                        size={20}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown"
                    />

                </div>


                {/* CONDIÇÃO */}

                <FieldLabel
                    label="Condição"
                    required
                />

                <input type="hidden" name="condition" value={condicao} />

                <div className="mt-2 grid grid-cols-2 gap-3">

                    <ConditionButton
                        label="Novo"
                        selected={condicao === "Novo"}
                        onClick={() => setCondicao("Novo")}
                    />

                    <ConditionButton
                        label="Usado • Como Novo"
                        selected={
                            condicao === "Usado • Como Novo"
                        }
                        onClick={() =>
                            setCondicao("Usado • Como Novo")
                        }
                    />

                    <ConditionButton
                        label="Usado • Bom Estado"
                        selected={
                            condicao === "Usado • Bom Estado"
                        }
                        onClick={() =>
                            setCondicao("Usado • Bom Estado")
                        }
                    />

                    <ConditionButton
                        label="Usado • Estado Regular"
                        selected={
                            condicao === "Usado • Estado Regular"
                        }
                        onClick={() =>
                            setCondicao("Usado • Estado Regular")
                        }
                    />

                </div>


                {/* CATEGORIA DE NEGOCIAÇÃO */}

                <FieldLabel
                    label="Categoria de Negociação"
                    required
                />

                <div className="relative mt-2 w-[298px]">

                    <select
                        name="negotiationType"
                        value={negociacao}
                        onChange={(event) =>
                            setNegociacao(event.target.value)
                        }
                        required
                        className="h-12 w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-reuse-white px-3 pr-10 text-1rem text-[#717182] outline-none"
                    >
                        <option value="" disabled>
                            Selecione uma categoria
                        </option>

                        <option value="venda">
                            Venda
                        </option>

                        <option value="troca">
                            Troca
                        </option>

                        <option value="doacao">
                            Doação
                        </option>
                    </select>

                    <ChevronDown
                        size={20}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown"
                    />

                </div>


                {/* DESCRIÇÃO */}

                <FieldLabel
                    label="Descrição"
                    required
                />

                <textarea
                    name="description"
                    value={descricao}
                    onChange={(event) =>
                        setDescricao(event.target.value)
                    }
                    required
                    placeholder="Descreva o item, suas características e motivo da doação..."
                    className="mt-2 min-h-[120px] w-full resize-none rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5] px-3 py-2 text-1rem leading-6 outline-none"
                />

                <p className="mt-1 text-xs text-[#6A7282]">
                    Mínimo 20 caracteres ({descricao.length}/20)
                </p>


                {/* LOCALIZAÇÃO */}

                <FieldLabel
                    label="Localização"
                />

                <div className="relative mt-2">

                    <MapPin
                        size={20}
                        strokeWidth={1.8}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-reuse-brown"
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Bairro, cidade ou CEP"
                        className="h-12 w-[298px] rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5] pl-10 pr-3 text-1rem outline-none"
                    />

                </div>

            </section>
        </>
    );
}

export default function PerfilClient({ user, items }) {
    const [activeFilter, setActiveFilter] = useState("todos");

    const publicarRef = useRef(null);

    const [state, formAction, pending] = useActionState(publishItem, initialState);

    const filterType = FILTER_TYPE_MAP[activeFilter];
    const filteredItems = filterType
        ? items.filter((item) => item.negotiationType === filterType)
        : items;

    function scrollToPublicar() {
        publicarRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const fieldsKey = state.success ? `published-${state.publishedItemId}` : "draft";

    return (
        <main className="w-full bg-reuse-cream">
            <div className="mx-auto max-w-7xl px-10 py-13.25">
                {/* =========================
                PERFIL
            ========================= */}

                <div className="grid grid-cols-[421px_1fr] gap-24.75">

                    {/* COLUNA ESQUERDA */}

                    <aside className="flex flex-col">
                        <ProfileHeader
                            name={user.name}
                            email={user.email}
                            location={user.location}
                            avatarUrl={user.avatarUrl}
                            memberSince={user.memberSince}
                        />

                        <div className="mt-11.75">
                            <ProfileInfo
                                tradesCount={items.filter((item) => item.negotiationType === "TROCA").length}
                                salesCount={items.filter((item) => item.negotiationType === "VENDA").length}
                                rating={user.rating}
                                bio={user.bio}
                            />
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => logOut()}
                            className="mt-5 text-center font-medium hover:underline rounded-[14px] w-96"
                        >
                            Deslogar
                        </Button>
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
                                            } `}
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

                        <div className="mt-5 grid grid-cols-4 gap-x-15 gap-y-10 pb-12">
                            {filteredItems.map((item) => (
                                <ProfileItemCard
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    condition={item.condition}
                                    distance={item.distance}
                                    type={item.type}
                                    price={item.price}
                                    image={item.image}
                                />
                            ))}
                        </div>

                        {filteredItems.length === 0 && (
                            <p className="text-sm text-reuse-brown-light">
                                Nenhum item nessa categoria ainda.
                            </p>
                        )}


                        {/* BOTÃO PUBLICAR */}

                        <div className="mt-4 flex justify-center">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={scrollToPublicar}
                                className="w-63.5 rounded-[14px]"
                            >
                                Publicar Novo Item
                            </Button>
                        </div>

                    </section>
                </div>

                {/* ==================================================FORMULÁRIO DE PUBLICAR ITEM=================================================*/}

                <section
                    id="publicar-item"
                    ref={publicarRef}
                    className="mx-auto mt-24 w-full max-w-[598px] scroll-mt-8"
                >


                    {/* JORNADA SUSTENTÁVEL */}

                    <JourneyCard itemCount={items.length} />

                    <form action={formAction}>

                        <PublishFormFields key={fieldsKey} />

                        {/* ERRO / SUCESSO */}

                        {state?.error && (
                            <p className="mt-4 text-center text-sm font-medium text-red-600">
                                {state.error}
                            </p>
                        )}

                        {state?.success && (
                            <p className="mt-4 text-center text-sm font-medium text-green-700">
                                Item publicado com sucesso!
                            </p>
                        )}


                        {/* TERMOS */}

                        <p className="mt-4 text-center text-sm leading-5 text-[#6a7282]">
                            Ao publicar, você concorda com nossos{" "}
                            <a
                                href="#"
                                className="text-reuse-brown underline"
                            >
                                Termos de Uso
                            </a>
                        </p>


                        {/* BOTÃO */}

                        <div className="mt-6 flex justify-center">

                            <Button
                                type="submit"
                                variant="secondary"
                                disabled={pending}
                                className="w-63.5 rounded-[14px]"
                            >
                                {pending ? "Publicando..." : "Publicar Item"}
                            </Button>

                        </div>

                    </form>

                </section>
            </div>
        </main>
    );
}
