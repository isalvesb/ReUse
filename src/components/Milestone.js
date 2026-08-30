import { Lock } from "lucide-react";

export default function Milestone({ emoji, label }) {
    return (
        <div className="relative flex h-[94px] flex-col items-center justify-center overflow-hidden rounded-[10px] border border-reuse-white/20 bg-reuse-white/5">

            <span className="text-2xl opacity-30">
                {emoji}
            </span>

            <span className="mt-2 text-xs text-reuse-white/30">
                {label}
            </span>

            <div className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-black/40">
                <Lock
                    size={16}
                    strokeWidth={1.8}
                    className="text-reuse-white"
                />
            </div>
        </div>
    );
}