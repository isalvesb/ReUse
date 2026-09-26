# ReUse Web

Plataforma de economia circular para publicar, vender, trocar e doar itens. O projeto usa Next.js, React, Prisma e PostgreSQL.

O projeto inclui um assistente integrado ao perfil, com IBM Watson Assistant opcional, ações autenticadas e confirmação antes de alterar ofertas.

## Execução local

```bash
npm ci
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`. O banco PostgreSQL e as variáveis `DATABASE_URL` e `SESSION_SECRET` são obrigatórios. Para carregar os dados demonstrativos, defina também uma `SEED_PASSWORD` local com pelo menos oito caracteres antes de executar o seed.

## Verificação

```bash
npm run check
```

O comando executa lint, testes unitários e build de produção.

As verificações cobrem classificação e confirmação do assistente, concorrência no vínculo OAuth, hash de tokens de redefinição, limites de upload e assinatura real dos arquivos de imagem. Fluxos com banco dependem de um PostgreSQL acessível.

## Assistente

O assistente aparece no perfil autenticado e oferece quatro intenções permitidas:

- resumir a vitrine;
- orientar a publicação de um item;
- pausar ofertas ativas, mediante confirmação;
- retomar ofertas pausadas, mediante confirmação.

As ações mutáveis usam uma confirmação assinada, vinculada ao usuário e válida por cinco minutos.

Sem credenciais IBM, as mesmas intenções são reconhecidas localmente para desenvolvimento. Esse modo não é evidência de integração real com o Watson. Veja [docs/projeto/watson.md](docs/projeto/watson.md).

## Produção

O upload local é usado somente em desenvolvimento. Em produção, configure um bucket público no Supabase Storage para que as imagens persistam entre deploys. O checklist completo está em [docs/projeto/deploy.md](docs/projeto/deploy.md).

## Estado das integrações locais

- Supabase Storage: upload real validado no bucket `reuse-items`.
- Resend: recuperação e redefinição de senha validadas de ponta a ponta.
- Google: login OAuth validado de ponta a ponta.
- Facebook: OAuth e permissões validados, mas a conta de teste não recebeu sessão porque a Graph API não retornou o campo `email` mesmo com a permissão concedida. O sistema mantém o bloqueio seguro nesse caso.
- IBM Watson Assistant: somente o classificador local foi validado; não há evidência de chamada real à IBM.

Essas validações foram feitas no ambiente local. Elas não comprovam configuração de produção nem deploy.
