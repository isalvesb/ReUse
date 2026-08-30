import { Trophy } from "lucide-react";
import Milestone from "./Milestone";

export default function JourneyCard() {
    return (
        <section className="mt-15 rounded-[14px] bg-linear-to-br from-reuse-brown to-reuse-brown-light p-6 text-reuse-white">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-[18px] font-medium">
                        Sua Jornada Sustentável
                    </h2>

                    <p className="mt-1 text-sm text-reuse-white/80">
                        Publique seu primeiro item!
                    </p>
                </div>

                <Trophy
                    size={32}
                    strokeWidth={1.7}
                />
            </div>

            <div className="mt-7 grid grid-cols-4 gap-3">
                <Milestone
                    emoji="🌱"
                    label="1 Item"
                />

                <Milestone
                    emoji="🌿"
                    label="3 Itens"
                />

                <Milestone
                    emoji="🌳"
                    label="5 Itens"
                />

                <Milestone
                    emoji="👑"
                    label="10 Itens"
                />

            </div>
        </section>
    );
}