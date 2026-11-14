# Transferência acadêmica e hospedagem controlada

**Registro histórico (10/11/2026).** Os passos de transferência relatados abaixo foram planejados antes da integração do monorepo à `main`. Para conhecer a estrutura atual, consulte o [README principal](../README.md) e o [índice da documentação](README.md). Este registro não deve ser seguido como roteiro de publicação atual.


Preparação local em 10/11/2026. Destino definido: `isalvesb/ReUse`; base remota conferida `5f34ae22b9d061baae4408bec6fc8807c5e90b14`. Branch proposta: `integracao/reuse-monorepo-20261110`. Nenhum push, PR, merge ou deploy foi executado nesta preparação.

## Histórico e estrutura

A base acadêmica é ancestral do Lab `3825024be1eb3ea3e168841f5371d1c11704899c`. A integração preserva os commits Mobile originais e o histórico Web sanitizado descrito em [origem e histórico](origem-e-historico.md), sem squash ou refs Web antigas não sanitizadas. O aplicativo Expo passa da raiz para `apps/mobile`; a Web/API fica em `apps/web`; instalação e lockfile ficam na raiz. `design/`, `docs/` e scripts compartilhados acompanham as aplicações.

A árvore de publicação não inclui ambientes privados, contas, evidências externas, backups, caches de dependências ou material de assinatura. Os dois arquivos `.expo` que haviam sido versionados na Web foram removidos: a lista de dispositivos estava vazia. A exclusão não reescreve o histórico. Configurações públicas legadas de cliente já documentadas permanecem históricas; não utilizar seus projetos para execução. Identificadores do laboratório são parâmetros de destino, não credenciais. Segredos e credenciais de contas são fornecidos somente fora do Git.

A revisão local compara o histórico completo alcançável e o conteúdo novo em relação ao destino. Atribuição normal de autores, commits e datas é preservada. Não publicar `--all`, `--mirror`, tags, stashes, refs de backup ou o clone separado usado para comparação da origem Web.

## Revisão e reversão

Reconsultar o SHA remoto imediatamente antes de um envio autorizado. Se divergir, reavaliar os novos commits e preparar a integração sem sobrescrever a principal. Enviar exclusivamente a branch proposta e abrir PR para `main`, com revisão da Isa. Nenhum merge automático. Para preservar a topologia importada, não fazer squash da integração inteira. Se um merge for autorizado futuramente e precisar ser desfeito, usar revert do merge, sem reescrever a principal e sem restaurar dados do Supabase.

O primeiro push público e a hospedagem têm aprovações independentes. Ausência de workflows versionados não prova ausência de webhooks/integrações externos. O acesso atual tem push, sem administração de webhooks. Antes do push, obter confirmação do responsável sobre automações não visíveis; não disparar um deployment para testar sua existência.

## Configuração de hospedagem proposta

Usar projeto novo e separado dos anteriores, sem Git conectado inicialmente. Criar o projeto sem deployment e com Vercel Authentication em **All Deployments**; verificar a configuração antes de inserir credenciais ou enviar código para execução. Não alterar o padrão da equipe nem a proteção de outros projetos. O primeiro deployment é classificado **Production** pela Vercel, mesmo quando pedido como Preview, e usa as variáveis Production. Esse nome de ambiente não autoriza exposição pública. Somente depois há Preview regular, se autorizado.

- Root Directory: `apps/web`, preset Next.js; incluir arquivos fora da raiz da aplicação.
- Node **24.x** nos manifests e no projeto. Intervalo aberto pode escolher uma versão superior apesar do ajuste no painel.
- Instalação a partir de `apps/web`: `cd ../.. && npm ci --install-strategy=nested --ignore-scripts --include=dev`.
- Incluir dependências de desenvolvimento no build, mesmo com `NODE_ENV=production`, pois ESLint/TypeScript/Tailwind e o compilador React são ferramentas de compilação; isso não incorpora o aplicativo Mobile nas funções Web.
- Build a partir de `apps/web`: `cd ../.. && npm run build:web`.
- Saída padrão Next `.next`; geração Prisma no prebuild, sem migrations, seeds ou importação. Não executar scripts de integração real no build.
- Confirmar origem HTTPS gerada/reservada antes de definir `NEXT_PUBLIC_APP_URL`; não usar localhost nem um alias diferente para testar a validação de origem IBM.
- Definir variáveis privadas por ambiente conforme [pré-publicação](pre-publicacao.md), usando exclusivamente o Supabase do laboratório. Conferir redirects e cookies em HTTPS, sem alterar políticas ou credenciais por conveniência.
- Vercel Authentication deve bloquear também HTML, API e rotas de imagem em contexto anônimo externo antes dos testes autenticados. `noindex` não substitui proteção. Não criar links de bypass nem incorporar segredos ao Mobile.

A API protegida pela Vercel não fica automaticamente acessível ao cliente nativo. O Mobile continua com a configuração local até uma estratégia autorizada de acesso HTTPS. Não declarar compatibilidade com o deployment só porque seus contratos locais passaram. IBM real e testes de escrita necessitam autorização e fixtures isoladas. O prazo acadêmico do trial e os alertas residuais de ferramentas/Mobile estão em [pré-publicação](pre-publicacao.md).
