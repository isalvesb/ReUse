import { Pencil } from "lucide-react";

export default function FormField({
    label,
    value,
    onChange,
    placeholder = '',
    active = false,
}) {
    return (
        <div className="mb-6">
            <label className="block text-[14px] font-medium leading-5 text-[#4A5565]">
                {label}
            </label>

            <div className="relative mt-2">
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className={`h-12 w-full rounded-[10px] border border-reuse-brown bg-[#F3F3F5] px-3 pr-11 text-1rem text-[#0A0A0A] outline-none ${active
                        ? 'border-reuse-brown'
                        : 'border-reuse-pink'
                        }`}
                />

                <Pencil
                    size={20}
                    strokeWidth={1.8}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-reuse-brown ${active
                        ? 'text-reuse-brown'
                        : 'text-[#C4C4C4]'
                        }`}
                />
            </div>
        </div>
    );
}