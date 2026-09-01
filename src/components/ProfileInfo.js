import {
    Gift, Package, Pencil, Star,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfileInfo() {
    return (
        <div className='flex w-full flex-col gap-6'>

            {/* ESTATÍSTICAS */}
            <div className='flex justify-center gap-4'>

                {/* TROCAS */}
                <div className='flex h-26.75 w-21.75 flex-col items-center justify-center rounded-3xl border border-reuse-white/60 bg-reuse-pink shadow-lg'>
                    <div className='mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-reuse-white/60'>
                        <Gift
                            size={16}
                            className='text-reuse-brown'
                        />
                    </div>

                    <strong className='text-[22px] leading-6 text-reuse-brown'>
                        24
                    </strong>

                    <span className='mt-2 text-[10px] text-reuse-brown/80'>
                        Trocas
                    </span>
                </div>

                {/* VENDAS */}
                <div className='flex h-26.75 w-21.75 flex-col items-center justify-center rounded-3xl border border-reuse-white/60 bg-reuse-pink shadow-lg'>
                    <div className='mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-reuse-white/60'>
                        <Package
                            size={16}
                            className='text-reuse-brown'
                        />
                    </div>

                    <strong className='text-[22px] leading-6 text-reuse-brown'>
                        12
                    </strong>

                    <span className='mt-2 text-[10px] text-reuse-brown/80'>
                        Vendas
                    </span>
                </div>

                {/* AVALIAÇÕES */}
                <div className='flex h-26.75 w-21.75 flex-col items-center justify-center rounded-3xl border border-reuse-white/60 bg-reuse-pink shadow-lg'>
                    <div className='mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-reuse-white/60'>
                        <Star
                            size={16}
                            className='text-reuse-brown'
                        />
                    </div>

                    <strong className='text-[22px] leading-6 text-reuse-brown'>
                        4.8
                    </strong>

                    <span className='mt-2 text-[10px] text-reuse-brown/80'>
                        Avaliações
                    </span>
                </div>
            </div>

            {/* SOBRE MIM */}
            <div className='px-4 pt-6 pb-5 bg-[#F3E8D2] rounded-2xl gap-3 w-[421px] h-[281px]'>
                <div className="flex justify-between">
                    <h2 className="mb-3 text-xl font-bold text-reuse-brown">
                        Sobre mim
                    </h2>

                    <Link
                        href="/perfil/editar"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2D5AB]"
                    >
                        <Pencil size={20} />
                    </Link>
                </div>

                <p className='text-base leading-6.5 text-reuse-brown'>
                    Sou mãe da Beatriz e do Pedro. Quero um futuro mais sustentável para os meus netos, e acredito que temos que consumir com mais consciência.
                </p>

                <p className='mt-2 text-base leading-6.5 text-reuse-brown'>
                    Reutilizar as coisas nos aproxima mais dessa meta.
                    Hoje tenho praticado mais o desapego e focado mais em realizar trocas que fazem produtos usados circular.
                </p>
            </div>
        </div >
    );
}