import { Gift, Package, Star } from 'lucide-react';

export default function ProfileInfo({
    tradesCount = 0,
    salesCount = 0,
    rating = 0,
    bio,
    showBio = true,
    showStats = true,
}) {
    return (
        <div className='flex w-full flex-col gap-6'>

            {/* SOBRE MIM — edição disponível somente nas configurações */}
            {showBio && <section aria-labelledby="perfil-sobre-mim" className="w-full">
                <h2 id="perfil-sobre-mim" className="mb-3 text-xl font-bold text-reuse-brown">Sobre mim</h2>
                <div className="min-h-[110px] rounded-2xl bg-[#F3E8D2] px-5 py-5">
                    <p className={`whitespace-pre-line break-words text-base leading-7 ${bio?.trim() ? "text-reuse-brown" : "text-reuse-brown-light/75"}`}>
                        {bio?.trim() || "Você ainda não escreveu uma descrição sobre você."}
                    </p>
                </div>
            </section>}

            {/* ESTATÍSTICAS */}
            {showStats && <div className='grid w-full grid-cols-3 gap-2 sm:gap-3'>

                {/* TROCAS */}
                <div className='flex min-h-[96px] min-w-0 flex-col items-center justify-center rounded-3xl border border-reuse-white/60 bg-reuse-pink px-2 shadow-sm'>
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
                <div className='flex min-h-[96px] min-w-0 flex-col items-center justify-center rounded-3xl border border-reuse-white/60 bg-reuse-pink px-2 shadow-sm'>
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
                <div className='flex min-h-[96px] min-w-0 flex-col items-center justify-center rounded-3xl border border-reuse-white/60 bg-reuse-pink px-2 shadow-sm'>
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
            </div>}

        </div >
    );
}
