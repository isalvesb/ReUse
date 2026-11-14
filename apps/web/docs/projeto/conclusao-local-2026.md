# Conclusão técnica local — 24/10/2026

**Registro histórico (24/10/2026).** Este documento descreve o estágio anterior à integração Web/Mobile, ao novo README e à hospedagem acadêmica. Não representa o funcionamento atual da branch `main`. Para informações atuais, consulte o [README principal](../../../../README.md) e o [índice da documentação](../../../../docs/README.md).


## Escopo autorizado

Marketing Digital e área administrativa Low-Code não ocorreram: foram citados por erro no enunciado final e não integram esta entrega. Mobile e web preservam suas arquiteturas independentes. Nenhum push, PR, deploy ou mudança de serviço remoto foi autorizado nesta execução.

## Diagnóstico do HTTP 500

A consulta somente de leitura com a conexão local existente falhou durante a inicialização do Prisma: o pooler retornou `FATAL (ENOTFOUND): tenant/user not found`. Nenhuma consulta ou migration pôde prosseguir. Home e Vitrine consultavam o banco sem tratamento de indisponibilidade. A causa comprovada nesta configuração é o destino de banco recusado pelo provedor; não há evidência de que editar consultas ou criar tabelas corrigiria esse erro. Não houve alteração na conexão original.

O endereço publicado apresentou erro 500 na auditoria. Sem os logs/configuração da Vercel, não está comprovado que ela usa a mesma conexão local. A correção definitiva de produção ainda exige conferir o destino e os logs, mediante autorização específica. O código local agora diferencia catálogo vazio de catálogo indisponível e não inventa anúncios quando o banco falha.

## Execução local segura

Instale PostgreSQL local, crie um banco exclusivo e informe `REUSE_LOCAL_DATABASE_URL=postgresql://usuario@127.0.0.1:porta/banco`. Execute `npm run demo -- prepare`, depois `npm run demo -- build` e `npm run demo -- start`. A porta HTTP padrão é 4317; ajuste com `REUSE_LOCAL_PORT`. O comando prepare aplica migrations e seed **somente** ao PostgreSQL loopback informado. Nunca use a conexão de produção.

O runner remove credenciais externas do ambiente e neutraliza as chaves dos arquivos .env. Usa contas fictícias do seed e senha demonstrativa `LocalDemo2026!`, alterável por `REUSE_DEMO_PASSWORD`. Recusa banco remoto, desabilita o web chat IBM e exibe o assistente local identificado como demonstração. Uploads persistem em public/uploads apenas neste modo local. Não há envio de e-mail, autenticação social ou chamada real IBM neste percurso.

O build normal agora gera o client Prisma, mas **não aplica migrations**. Migrations de qualquer ambiente remoto continuam como operação separada e não autorizada.

## Verificações

- 48 testes automatizados de regras aprovados e lint sem erros no checkout.
- Build de produção em cópia isolada, sem .env original. A cópia evita substituir .next ou interferir em outro servidor de desenvolvimento.
- PostgreSQL exclusivo: sete migrations e seed fictício aplicados localmente.
- Interface real no navegador local: cadastro, login, upload de duas fotos, publicação, busca, galeria, pausa e reativação com confirmação, conversa e resposta entre duas contas, notificação e marcação de leitura. Duas mensagens foram confirmadas no PostgreSQL exclusivo.
- HTTP com banco local indisponível: Home e Vitrine responderam com aviso explícito de indisponibilidade. Nenhum dado fictício substituiu a falha.
- Imagem enviada após o build servida com HTTP 200 tanto pela rota local protegida quanto pelo otimizador de imagem. Isso não valida Supabase Storage ou armazenamento serverless.
- `npm run demo -- verify`: teste HTTP das ferramentas IBM contra o PostgreSQL local, incluindo isolamento e confirmação de uso único. Isso valida o contrato local das ferramentas, não a instância IBM.

## Limites

Atualização periódica do chat (cinco segundos), armazenamento local de imagens e classificador local são os limites da demonstração. As avaliações exibidas no seed são fictícias; não há sistema completo de reviews, pagamentos ou sincronização mobile/web. Fotografias padrão de anúncios antigos são ilustrações de fallback.

A validação final publicada, OAuth, entrega real de e-mail, Supabase Storage e IBM ficam pendentes de autorização/configuração externa. Nenhuma evidência local substitui esses testes.
