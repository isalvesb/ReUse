import { Trophy } from "lucide-react";
import Milestone from "./Milestone";

const MILESTONES = [
    { threshold: 1, emoji: "🌱", label: "1 Item" },
    { threshold: 3, emoji: "🌿", label: "3 Itens" },
    { threshold: 5, emoji: "🌳", label: "5 Itens" },
    { threshold: 10, emoji: "👑", label: "10 Itens" },
];

export default function JourneyCard({ itemCount = 0 }) {
    const subtitle = itemCount === 0
        ? "Publique seu primeiro item!"
        : `Você já publicou ${itemCount} ${itemCount === 1 ? "item" : "itens"}. Continue assim!`;

    return (
        <section className="mt-15 rounded-[14px] bg-linear-to-br from-reuse-brown to-reuse-brown-light p-6 text-reuse-white">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-[18px] font-medium">
                        Sua Jornada Sustentável
                    </h2>

                    <p className="mt-1 text-sm text-reuse-white/80">
                        {subtitle}
                    </p>
                </div>

                <Trophy
                    size={32}
                    strokeWidth={1.7}
                />
            </div>

            <div className="mt-7 grid grid-cols-4 gap-3">
                {MILESTONES.map((milestone) => (
                    <Milestone
                        key={milestone.threshold}
                        emoji={milestone.emoji}
                        label={milestone.label}
                        unlocked={itemCount >= milestone.threshold}
                    />
                ))}
            </div>
        </section>
    );
}