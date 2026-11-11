"use client";
import { useEffect, useRef, useState } from "react";
import PhotoButton from "@/components/PhotoButton";
import FieldLabel from "@/components/FieldLabel";
import ConditionButton from "@/components/ConditionButton";
import { ChevronDown, MapPin } from "lucide-react";
import {
  getItemPhotoValidationError,
  ITEM_PHOTO_LIMITS,
} from "@/lib/upload-constraints.mjs";
export function PublishFormFields({ initial = {} }) {
  const [condicao, setCondicao] = useState(initial.conditionLabel || "");
  const [descricao, setDescricao] = useState(initial.description || "");
  const [negociacao, setNegociacao] = useState(
    initial.type?.toLowerCase() || "",
  );
  const [photos, setPhotos] = useState(
    (initial.images || []).map((i) => ({ preview: i.url, imageId: i.id })),
  );
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);
  const photosRef = useRef([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current
        .filter((p) => p.file)
        .forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, []);

  function syncPhotoInput(nextPhotos) {
    if (!fileInputRef.current) return;

    const transfer = new DataTransfer();
    nextPhotos
      .filter((p) => p.file)
      .forEach(({ file }) => transfer.items.add(file));
    fileInputRef.current.files = transfer.files;
  }

  function handlePhotosChange(event) {
    const incomingFiles = Array.from(event.target.files ?? []);
    const existingKeys = new Set(
      photos
        .filter((p) => p.file)
        .map(({ file }) => `${file.name}:${file.size}:${file.lastModified}`),
    );
    const uniqueIncomingFiles = incomingFiles.filter((file) => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;

      if (existingKeys.has(key)) return false;
      existingKeys.add(key);
      return true;
    });

    const nextFiles = [
      ...photos.map(({ file }) => file || { type: "image/jpeg", size: 0 }),
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
      <input
        type="hidden"
        name="retainedPhotos"
        value={JSON.stringify(
          photos.filter((p) => p.imageId).map((p) => ({ imageId: p.imageId })),
        )}
      />
      {/* FOTOS */}
      <section className="mt-5 rounded-[14px] border border-reuse-pink bg-reuse-white p-6.25 shadow-sm">
        {/* DICA */}

        <section className="mb-5 rounded-[10px] border border-[#FEE685] bg-[#FFFBEB] px-[17px] py-2.5">
          <p className="text-sm leading-5 text-[#7B3306]">
            <strong>Dica: </strong>
            Itens com fotos claras e descrições detalhadas têm 3x mais chances
            de serem doados rapidamente!
          </p>
        </section>

        {/* TÍTULO */}

        <h2 className="text-[18px] font-medium text-[#101828]">
          Fotos do Item <span aria-hidden="true">*</span>
        </h2>

        <p className="mt-4 max-w-[272px] text-[14px] leading-5 text-[#4A5565]">
          Adicione de 1 a 5 fotos do seu item. A primeira será a foto de capa.
        </p>

        {/* FOTOS */}

        <input
          ref={fileInputRef}
          type="file"
          name="photos"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handlePhotosChange}
          aria-required="true"
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
          <p
            id="photo-error"
            role="alert"
            className="mt-3 text-sm font-medium text-red-600"
          >
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

        <FieldLabel label="Título" htmlFor="item-title" required />

        <input
          id="item-title"
          type="text"
          name="title"
          defaultValue={initial.title || ""}
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
          <span className="pl-3 text-base text-[#717182]">R$</span>

          <input
            id="item-price"
            type="number"
            name="price"
            defaultValue={initial.price || ""}
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

        <FieldLabel label="Categoria" htmlFor="item-category" required />

        <div className="relative mt-2 w-full max-w-[298px]">
          <select
            id="item-category"
            name="category"
            defaultValue={initial.category?.slug || ""}
            required
            className="h-12 w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-reuse-white px-3 pr-10 text-base text-[#717182] outline-none"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>

            <option value="eletronicos">Eletrônicos</option>

            <option value="roupas">Roupas</option>

            <option value="moveis">Móveis</option>

            <option value="livros">Livros</option>

            <option value="sapatos">Sapatos</option>

            <option value="outros">Outros</option>
          </select>

          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown"
          />
        </div>

        {/* CONDIÇÃO */}

        <FieldLabel label="Condição" required />

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
            selected={condicao === "Usado • Como Novo"}
            onClick={() => setCondicao("Usado • Como Novo")}
          />

          <ConditionButton
            label="Usado • Bom Estado"
            selected={condicao === "Usado • Bom Estado"}
            onClick={() => setCondicao("Usado • Bom Estado")}
          />

          <ConditionButton
            label="Usado • Estado Regular"
            selected={condicao === "Usado • Estado Regular"}
            onClick={() => setCondicao("Usado • Estado Regular")}
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
            onChange={(event) => setNegociacao(event.target.value)}
            required
            className="h-12 w-full appearance-none rounded-[10px] border border-[#D1D5DC] bg-reuse-white px-3 pr-10 text-base text-[#717182] outline-none"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>

            <option value="venda">Venda</option>

            <option value="troca">Troca</option>

            <option value="doacao">Doação</option>
          </select>

          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown"
          />
        </div>

        {/* DESCRIÇÃO */}

        <FieldLabel label="Descrição" htmlFor="item-description" required />

        <textarea
          id="item-description"
          name="description"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
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

        <FieldLabel label="Localização" htmlFor="item-location" />

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
            defaultValue={initial.location || ""}
            maxLength={160}
            placeholder="Bairro, cidade ou CEP"
            className="h-12 w-full max-w-[298px] rounded-[10px] border border-[#D1D5DC] bg-[#f3f3f5] pl-10 pr-3 text-base outline-none"
          />
        </div>
      </section>
    </>
  );
}
