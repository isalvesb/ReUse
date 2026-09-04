import Image from "next/image";
import { Mail, MapPin } from 'lucide-react';

const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatMemberSince(date) {
    if (!date) return "";

    const parsed = new Date(date);
    return `${MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
}

export default function ProfileHeader({
    name,
    email,
    location,
    avatarUrl,
    memberSince,
}) {
    return (
        <section className="flex items-center gap-8">

            {/* FOTO */}
            <div className="relative h-[117px] w-[117px] shrink-0 overflow-hidden rounded-full">
                <Image
                    src={avatarUrl || "/images/perfil/avatar.png"}
                    alt={name}
                    fill
                    sizes="117px"
                    className="object-cover"
                />
            </div>

            {/* INFORMAÇÕES */}

            {/* NOME */}
            <div className="flex flex-col gap-2">

                <h1 className="text-[28px] font-bold leading-7 text-reuse-brown">
                    {name}
                </h1>

                <div className="flex flex-col gap-1">

                    {/* EMAIL */}
                    <div className="flex items-center gap-2">
                        <Mail
                            size={16}
                            strokeWidth={1.8}
                            className="text-reuse-brown"
                        />

                        <span className="text-sm text-reuse-brown">
                            {email}
                        </span>
                    </div>

                    {/* LOCALIZAÇÃO */}
                    {location && (
                        <div className="flex items-center gap-2">
                            <MapPin
                                size={16}
                                strokeWidth={1.8}
                                className="text-reuse-brown"
                            />

                            <span className="text-sm text-reuse-brown">
                                {location}
                            </span>
                        </div>
                    )}

                    <span className="text-xs text-reuse-brown opacity-70">
                        No ReUse desde {formatMemberSince(memberSince)}
                    </span>
                </div>
            </div>


        </section>
    )
}