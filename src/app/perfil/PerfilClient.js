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
import ReuseAssistant from "@/components/ReuseAssistant";
import {
    getItemPhotoValidationError,
    ITEM_PHOTO_LIMITS,
} from "@/lib/upload-constraints.mjs";
import { publishItem } from "./actions";

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
    doacoes: "DOACAO",
    trocas: "TROCA",
    vendas: "VENDA",
};

const initialState = { error: null, success: false };


const SHOW_LEGACY_ASSISTANTS = process.env.NEXT_PUBLIC_SHOW_LEGACY_ASSISTANTS === "true";

function PublishFormFields() {
    const [condicao, setCondicao] = useState("");
    const [descricao, setDescricao] = useState("");
    const [negociacao, setNegociacao] = useState("");
    const [photos, setPhotos] = useState([]);
    const [photoError, setPhotoError] = useState("");
    const fileInputRef = useRef(null);
    const photosRef = useRef([]);

    useEffect(() => {
        photosRef.current = photos;
    }, [photos]);

    useEffect(() => {
        return () => {
            photosRef.current.forEach(({ preview }) => URL.revokeObjectURL(preview));
        };
    }, []);

    function syncPhotoInput(nextPhotos) {
        if (!fileInputRef.current) return;

        const transfer = new DataTransfer();
        nextPhotos.forEach(({ file }) => transfer.items.add(file));
        fileInputRef.current.files = transfer.files;
    }

    function handlePhotosChange(event) {
        const incomingFiles = Array.from(event.target.files ?? []);
        const existingKeys = new Set(
            photos.map(({ file }) => `${file.name}:${file.size}:${file.lastModified}`)
        );
        const uniqueIncomingFiles = incomingFiles.filter((file) => {
            const key = `${file.name}:${file.size}:${file.lastModified}`;

            if (existingKeys.has(key)) return false;
            existingKeys.add(key);
            return true;
        });

        const nextFiles = [
            ...photos.map(({ file }) => file),
            ...uniqueIncomingFiles,
        ];
        const validationError = getItemPhotoValidationError(nextFiles);

        if (validationError) {
            setPhotoError(validationError);
            syncPhotoInput(photos);
            return;
        }

        const nextPhotos = [
            ...photos,
            ...uniqueIncomingFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            })),
        ];

        setPhotoError("");
        setPhotos(nextPhotos);
        syncPhotoInput(nextPhotos);
    }

    function removePhoto(index) {
        const removedPhoto = photos[index];
        if (!removedPhoto) return;

        URL.revokeObjectURL(removedPhoto.preview);
        const nextPhotos = photos.filter((_, photoIndex) => photoIndex !== index);
        setPhotoError("");
        setPhotos(nextPhotos);
        syncPhotoInput(nextPhotos);
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
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handlePhotosChange}
                    aria-describedby={photoError ? "photo-error" : undefined}
                    className="hidden"
                />

                <div className="mt-4 flex flex-wrap gap-3">
                    {Array.from({ length: ITEM_PHOTO_LIMITS.maxFiles }, (_, index) => (
                        <PhotoButton
                            key={index}
                            preview={photos[index]?.preview}
                            onClick={() => fileInputRef.current?.click()}
                            onRemove={() => removePhoto(index)}
                        />
                    ))}
                </div>

                {photoError && (
                    <p id="photo-error" role="alert" className="mt-3 text-sm font-medium text-red-600">
                        {photoError}
                    </p>
                )}

            </section>


            {/* DETALHES */}

            <section className="mt-5 rounded-[14px] border border-reuse-pink bg-reuse-white p-[25px] shadow-sm">

                <h2 className="text-[18px] font-medium text-[#101828]">
                    Detalhes do Item
                </h2>


                {/* TÍTULO */}

                <FieldLabel
                    label="Título"
                    htmlFor="item-title"
                    required
                />

                <input
                    id="item-title"
                    type="text"
                    name="title"
                    required
                    maxLength={120}
                    placeholder="Ex: Cadeira de escritório ergonômica"
                    className="mt-2 h-12 w-full rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5] px-3 text-base outline-none"
                />


                {/* PREÇO */}

                <FieldLabel
                    label="Preço"
                    htmlFor="item-price"
                    required={negociacao === "venda"}
                />

                <div className="relative mt-2 flex h-12 w-[160px] items-center rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5]">

                    <span className="pl-3 text-base text-[#717182]">
                        R$
                    </span>

                    <input
                        id="item-price"
                        type="number"
                        name="price"
                        placeholder="0,00"
                        min="0.01"
                        max="99999999.99"
                        step="0.01"
                        required={negociacao === "venda"}
                        disabled={negociacao !== "venda"}
                        className="h-full w-full bg-transparent px-2 text-base text-reuse-brown outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />

                </div>


                {/* CATEGORIA */}

                <FieldLabel
                    label="Categoria"
                    htmlFor="item-category"
                    required
                />

                <div className="relative mt-2 w-full max-w-[298px]">

                    <select
                        id="item-category"
                        name="category"
                        defaultValue=""
                        required
                        className="h-12 w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-reuse-white px-3 pr-10 text-base text-[#717182] outline-none"
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

                <div
                    role="group"
                    aria-label="Condição do item"
                    className="mt-2 grid grid-cols-2 gap-3"
                >

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
                    htmlFor="item-negotiation-type"
                    required
                />

                <div className="relative mt-2 w-full max-w-[298px]">

                    <select
                        id="item-negotiation-type"
                        name="negotiationType"
                        value={negociacao}
                        onChange={(event) =>
                            setNegociacao(event.target.value)
                        }
                        required
                        className="h-12 w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-reuse-white px-3 pr-10 text-base text-[#717182] outline-none"
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
                    htmlFor="item-description"
                    required
                />

                <textarea
                    id="item-description"
                    name="description"
                    value={descricao}
                    onChange={(event) =>
                        setDescricao(event.target.value)
                    }
                    required
                    minLength={20}
                    maxLength={3000}
                    placeholder="Descreva o item, suas características e motivo da doação..."
                    className="mt-2 min-h-[120px] w-full resize-none rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5] px-3 py-2 text-base leading-6 outline-none"
                />

                <p className="mt-1 text-xs text-[#6A7282]">
                    Mínimo 20 caracteres ({descricao.length}/20)
                </p>


                {/* LOCALIZAÇÃO */}

                <FieldLabel
                    label="Localização"
                    htmlFor="item-location"
                />

                <div className="relative mt-2">

                    <MapPin
                        size={20}
                        strokeWidth={1.8}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-reuse-brown"
                    />

                    <input
                        id="item-location"
                        type="text"
                        name="location"
                        maxLength={160}
                        placeholder="Bairro, cidade ou CEP"
                        className="h-12 w-full max-w-[298px] rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5] pl-10 pr-3 text-base outline-none"
                    />

                </div>

            </section>
        </>
    );
}

export default function PerfilClient({ user, items }) {
    const [activeFilter, setActiveFilter] = useState("todos");
    const [showAllItems, setShowAllItems] = useState(false);

    const publicarRef = useRef(null);

    const [state, formAction, pending] = useActionState(publishItem, initialState);

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

    const fieldsKey = state.success ? `published-${state.publishedItemId}` : "draft";

    return (
        <main className="w-full bg-reuse-cream">
            <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-13.25">
                {/* =========================
                PERFIL
            ========================= */}

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)] lg:items-stretch lg:gap-10">
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
                                    tradesCount={items.filter((item) => item.negotiationType === "TROCA").length}
                                    salesCount={items.filter((item) => item.negotiationType === "VENDA").length}
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
                                    <h2 className="text-2xl font-bold text-reuse-brown">Minha Vitrine</h2>
                                </div>

                        {/* FILTROS */}

                        <div className="flex flex-wrap items-center gap-2">
                            {filters.map((filter) => {
                                const active =
                                    activeFilter === filter.value;

                                return (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() => {
                                            setActiveFilter(filter.value);
                                            setShowAllItems(false);
                                        }}
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
                            </div>


                        {/* QUANTIDADE */}

                        <p className="mt-5 text-xs text-reuse-beige">
                            {filteredItems.length} itens
                        </p>


                        {/* CARDS */}

                        <div className="mt-5 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-[repeat(auto-fit,minmax(173px,1fr))] sm:gap-6 lg:justify-items-start">
                            {visibleItems.map((item, index) => (
                                <ProfileItemCard
                                    key={item.id}
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
                    <aside className="min-w-0 self-stretch [&>section]:mt-0! [&>section]:max-w-none! lg:[&>section]:h-full!">
                        {SHOW_LEGACY_ASSISTANTS && <ReuseAssistant />}
                    </aside>
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
                            <p role="alert" className="mt-4 text-center text-sm font-medium text-red-600">
                                {state.error}
                            </p>
                        )}

                        {state?.success && (
                            <p role="status" className="mt-4 text-center text-sm font-medium text-green-700">
                                Item publicado com sucesso!
                            </p>
                        )}


                        {/* TERMOS */}

                        <p className="mt-4 text-center text-sm leading-5 text-[#6a7282]">
                            Ao publicar, você confirma que tem autorização para anunciar o item e que as informações fornecidas são verdadeiras.
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
