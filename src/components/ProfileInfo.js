import {
    Gift, Package, Star,
} from 'lucide-react';

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
            <div className='rounded-2xl bg-reuse-cream/60 px-4.25 py-6'>

                <h2 className='mb-3 text-xl font-bold text-reuse-brown'>
                    Sobre mim
                </h2>

                <p className='text-base leading-6.5 text-reuse-brown'>
                    Sou mãe da Beatriz e do Pedro. Quero um futuro mais sustentável para os meus netos, e acredito que temos que consumir com mais consciência.
                </p>

                <p className='mt-2 text-base leading-6.5 text-reuse-brown'>
                    Reutilizar as coisas nos aproxima mais dessa meta.
                    Hoje tenho praticado mais o desapego e focado mais em realizar trocas que fazem produtos usados circular.
                </p>
            </div>
        </div>
    );
}