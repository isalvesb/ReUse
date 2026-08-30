import { Camera } from "lucide-react";

export default function PhotoButton() {
    return (
        <button
            type="button"
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