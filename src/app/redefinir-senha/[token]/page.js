import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RedefinirSenhaClient from "./RedefinirSenhaClient";

export const dynamic = "force-dynamic";

export default async function RedefinirSenha({ params }) {
    const { token } = await params;

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    const isValid = resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();

    if (!isValid) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-reuse-cream px-6 text-center">
                <h1 className="text-2xl font-medium text-reuse-brown">
                    Link inválido ou expirado
                </h1>

                <p className="mt-4 max-w-sm text-sm text-reuse-brown">
                    Esse link de redefinição de senha não é mais válido.
                    Solicite um novo.
                </p>

                <Link
                    href="/recuperar-senha"
                    className="mt-6 font-medium text-reuse-brown underline"
                >
                    Solicitar novo link
                </Link>
            </main>
        );
    }

    return <RedefinirSenhaClient token={token} />;
}
