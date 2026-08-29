import Image from "next/image";
import { Mail, MapPin } from 'lucide-react';

export default function ProfileHeader() {
    return (
        <section className="flex items-center gap-8">

            {/* FOTO */}
            <div className="relative h-[117px] w-[117px] shrink-0 overflow-hidden rounded-full">
                <Image
                    src="/images/perfil/maria-silva.png"
                    alt="Maria Silva"
                    fill
                    sizes="117px"
                    className="object-cover"
                />
            </div>

            {/* INFORMAÇÕES */}

            {/* NOME */}
            <div className="flex flex-col gap-2">

                <h1 className="text-[28px] font-bold leading-7 text-reuse-brown">
                    Maria Silva
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
                            maria.silva@email.com
                        </span>
                    </div>

                    {/* LOCALIZAÇÃO */}
                    <div className="flex items-center gap-2">
                        <MapPin
                            size={16}
                            strokeWidth={1.8}
                            className="text-reuse-brown"
                        />

                        <span className="text-sm text-reuse-brown">
                            São Paulo, SP
                        </span>
                    </div>

                    <span className="text-xs text-reuse-brown opacity-70">
                        No ReUse desde Janeiro 2026
                    </span>
                </div>
            </div>


        </section>
    )
}