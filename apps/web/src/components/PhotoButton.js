"use client";

import Image from "next/image";
import { Camera, X } from "lucide-react";

export default function PhotoButton({ preview, onClick, onRemove }) {
    if (preview) {
        return (
            <div className="relative h-[89px] w-[89px] shrink-0 overflow-hidden rounded-[10px] border border-[#D1D5DC]">
                <Image
                    src={preview}
                    alt="Prévia da foto do item"
                    fill
                    sizes="89px"
                    className="object-cover"
                />

                <button
                    type="button"
                    onClick={onRemove}
                    aria-label="Remover foto"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                    <X size={12} />
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-[89px] w-[89px] shrink-0 flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#D1D5DC] text-[#4A5565]">

            <Camera
                size={32}
                strokeWidth={1.5}
            />

            <span className="text-sm">
                Adicionar
            </span>
        </button>
    );

}
