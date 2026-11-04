# ReUse Lab

Laboratório privado que reúne ReUse Web e ReUse Mobile em npm workspaces. A fundação preserva os históricos dos dois projetos. A Work 1.3 integrou identidade e perfil: Supabase Auth, PostgreSQL novo e backend Next.js/Prisma; a Work 1.4 verificou sua execução nativa iOS. A Work 1.5 compartilha a leitura do catálogo, categorias, busca, filtros e detalhes. Expo/React Native e a identidade visual são preservados. A Work 1.6 integra publicação/edição e imagens em Storage privado. Chat compartilhado permanece pendente.

```text
apps/web/       Next.js e Prisma
apps/mobile/    Expo e React Native
docs/          origem, mapa de commits e validação
package.json
package-lock.json
```

## Preparação

Validado com Node 24.13.1 e npm 11.8.0. Instale pela raiz:

```sh
npm ci --ignore-scripts
npm run generate:web
```

O primeiro comando instala o lockfile sem executar os scripts dos pacotes. O segundo gera somente o cliente Prisma; não aplica migrations nem seeds. A geração pode precisar obter os binários oficiais do Prisma.

As dependências continuam declaradas em cada aplicação. O lockfile único conserva as versões e os dados de resolução dos dois locks de origem, com instalação dentro dos respectivos workspaces. Os locks antigos continuam disponíveis no histórico importado.

Cada aplicação possui seu próprio `.env.example`. Configure somente o projeto novo de testes indicado nos exemplos. Nenhum `.env`, configuração Google local ou arquivo de assinatura foi transferido dos projetos originais. O Mobile consulta o próprio perfil em `/api/v1/me`; a Web utiliza as mesmas funções de domínio. Consulte [configuração e contratos da Work 1.3](docs/contas-e-perfis.md) e [catálogo e limites da Work 1.5](docs/catalogo-compartilhado.md).

## Comandos pela raiz

| Comando | Finalidade |
| --- | --- |
| `npm run dev:web` | Next local em `127.0.0.1:4330`, com Webpack |
| `npm run dev:mobile` | Inicia o Expo |
| `npm run test:web` | Testes Web |
| `npm run test:mobile` | Testes Mobile |
| `npm run lint:web` | ESLint Web |
| `npm run typecheck:mobile` | TypeScript Mobile |
| `npm run test:integration` | Verificações reais com as duas contas fictícias; exige arquivo privado de credenciais e servidor local |
| `npm run check` | Testes dos dois apps, lint Web e tipagem Mobile |
| `npm run build:web` | Gera Prisma e compila a Web com Webpack |
| `npm run build:mobile` | Exporta bundles Expo iOS e Android; não gera aplicativos assinados |

Também é possível executar scripts de cada aplicação com `npm run <script> --workspace=@reuse/web` ou `--workspace=@reuse/mobile`. Os identificadores Expo/nativos não foram renomeados. A configuração Metro existente foi preservada.

O comando Web da raiz usa a opção Webpack suportada pelo Next existente: o build Turbopack não concluiu nos limites do ambiente isolado. O script original `build` dentro da Web permanece disponível sem alteração. A verificação offline de compilação usou fontes locais fictícias; o build habitual continua dependendo das fontes Google declaradas no aplicativo.

As pastas nativas locais ignoradas não foram incluídas no Git. As fontes existentes foram preservadas em backup externo ao laboratório; há uma divergência conhecida entre o AppDelegate local antigo e o plugin de cenas versionado. A development build local iOS foi compilada e executada na Work 1.4; consulte [procedimento e limites nativos](docs/homologacao-ios.md). Distribuição e aparelhos físicos continuam fora da validação.

Não há deploy, integração Vercel ou publicação automática. A aplicação conecta exclusivamente ao Supabase novo do laboratório, com bloqueio de destinos históricos. Builds não aplicam migrations. O comando explícito `db:migrate` recusa qualquer destino diferente do projeto novo. Seeds históricos não fazem parte desta integração e não devem ser executados nesta base.

Consulte [origem e sanitização](docs/origem-e-historico.md), [política de conteúdo](docs/seguranca.md) e [validação e limites](docs/validacao.md).

Para conferir o catálogo com o backend local e os fixtures já criados, execute `node scripts/check-catalog.mjs`. Para regressão Auth sem editar perfis, execute `node scripts/check-profile-regression.mjs` com `REUSE_TEST_CREDENTIALS_FILE` apontando para o arquivo privado local. O teste de integração da Work 1.3 edita biografias fictícias; não é necessário para a regressão de leitura da Work 1.5. A carga fictícia é explícita e separada, com bloqueio de destino, conforme a documentação do catálogo.

A [Work 1.6](docs/publicacao-e-imagens.md) descreve os contratos de escrita, configuração de Storage exclusivamente no servidor, migration aditiva, rascunhos, limpeza e limites de homologação. `node scripts/check-item-writes.mjs` usa as duas contas fictícias e cria anúncios adicionais; exige `REUSE_TEST_CREDENTIALS_FILE` e backend local. Não execute contra ambientes históricos.
