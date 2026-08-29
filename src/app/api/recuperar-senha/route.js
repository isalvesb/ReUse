import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    console.log(
        "RESEND KEY:",
        process.env.RESEND_API_KEY ? "chave encontrada" : "chave não encontrada"
    );

    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: ["teste@example.com"],
            subject: "Hello World",
            html: `
                <p>
                    Congrats on sending your
                    <strong>first email</strong>!
                </p>
            `,
        });

        if (error) {
            console.error("[Resend API Error]:", error);

            return Response.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("[Server Error]:", error);

        return Response.json(
            { error: "Erro ao enviar o e-mail." },
            { status: 500 }
        );
    }
}