# ReUse Lab

Laboratório privado que reúne ReUse Web e ReUse Mobile em npm workspaces. A fundação preserva os históricos dos dois projetos. A Work 1.3 integra exclusivamente identidade e perfil: Supabase Auth, PostgreSQL novo e backend Next.js/Prisma. As interfaces e o Expo/React Native são preservados; catálogo, imagens, chat e demais serviços ainda não são compartilhados.

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

Cada aplicação possui seu próprio `.env.example`. Configure somente o projeto novo de testes indicado nos exemplos. Nenhum `.env`, configuração Google local ou arquivo de assinatura foi transferido dos projetos originais. O Mobile consulta o próprio perfil em `/api/v1/me`; a Web utiliza as mesmas funções de domínio. Consulte [configuração e contratos da Work 1.3](docs/contas-e-perfis.md).

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

As pastas nativas locais ignoradas não foram incluídas no Git. As fontes existentes foram preservadas em backup externo ao laboratório; há uma divergência conhecida entre o AppDelegate local antigo e o plugin de cenas versionado. Prebuild/compilação nativa e assinatura precisam de validação própria.

Não há deploy, integração Vercel ou publicação automática. A aplicação conecta exclusivamente ao Supabase novo do laboratório, com bloqueio de destinos históricos. Builds não aplicam migrations. O comando explícito `db:migrate` recusa qualquer destino diferente do projeto novo. Seeds históricos não fazem parte desta integração e não devem ser executados nesta base.

Consulte [origem e sanitização](docs/origem-e-historico.md), [política de conteúdo](docs/seguranca.md) e [validação e limites](docs/validacao.md).
