import Link from "next/link";
import { CircleCheck, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

export default async function EmailEnviado({ searchParams }) {
    const params = await searchParams;

    const email = params.email;

    return (
        <main className="min-h-screen bg-reuse-cream flex flex-col items-center justify-center">
            <div className="w-full max-w-md px-6 text-center">

                {/* ÍCONE */}
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-reuse-pink/50">
                    <CircleCheck
                        size={40}
                        strokeWidth={2}
                        className="text-reuse-brown"
                    />
                </div>


                {/* TÍTULO */}
                <h1 className="text-2xl font-medium text-reuse-brown">
                    E-mail enviado!
                </h1>

                {/* MENSAGEM */}
                <p className="mt-4 text-base leading-7 text-reuse-brown">
                    Enviamos um link de recuperação para {""}
                    <strong className="font-bold">
                        {email}
                    </strong>
                </p>

                <div className="mt-10 flex flex-col items-center gap-5">

                    {/* DICA */}
                    <div className="w-87.5 rounded-[18px] bg-reuse-brown/80 px-4 py-4 text-left">
                        <p className="text-sm leading-5 text-reuse-cream">
                            <strong className="font-bold">Dica:</strong> {""}
                            Não encontrou o e-mail? Verifique sua
                            caixa de spam ou lixo eletrônico.
                        </p>
                    </div>

                    {/* REENVIAR E-MAIL */}
                    <Button
                        type="submit"
                        variant="primary"
                        className="h-12 w-87.5 max-w-full rounded-[14px] text-base font-medium text-reuse-brown transition hover:opacity-90">
                        Reenviar e-mail
                    </Button>

                    {/* VOLTAR PARA O LOGIN */}
                    <Link
                        href='/login'
                        className="flex items-center gap-2 text-base text-reuse-brown transition hover:opacity-70">
                        <ArrowLeft size={16} />
                        <span>Voltar para o login</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}