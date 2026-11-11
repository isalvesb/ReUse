export async function POST() {
    return Response.json({ error: "Recuperação por e-mail indisponível nesta etapa. Nenhuma mensagem foi enviada." }, { status: 501 });
}
