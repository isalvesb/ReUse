import {
    Gift, Package, Pencil, Star,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfileInfo({
    tradesCount = 0,
    salesCount = 0,
    rating = 0,
    bio,
    canEdit = false,
}) {
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
                        {tradesCount}
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
                        {salesCount}
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
                        {rating.toFixed(1)}
                    </strong>

                    <span className='mt-2 text-[10px] text-reuse-brown/80'>
                        Avaliações
                    </span>
                </div>
            </div>

            {/* SOBRE MIM */}
            <div className='min-h-[281px] w-full rounded-2xl bg-[#F3E8D2] px-4 pb-5 pt-6'>
                <div className="flex justify-between">
                    <h2 className="mb-3 text-xl font-bold text-reuse-brown">
                        Sobre mim
                    </h2>

                    {canEdit && (
                        <Link
                            href="/perfil/editar"
                            aria-label="Editar perfil"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2D5AB]"
                        >
                            <Pencil aria-hidden="true" size={20} />
                        </Link>
                    )}
                </div>

                <p className='whitespace-pre-line text-base leading-6.5 text-reuse-brown'>
                    {bio || "Você ainda não escreveu nada sobre você. Clique no lápis para editar seu perfil."}
                </p>
            </div>
        </div >
    );
}
