# Preparação técnica — Work 2.04

**Registro histórico (10/11/2026).** As etapas de transferência e publicação descritas abaixo eram propostas ou verificações naquele momento. O monorepo foi posteriormente integrado ao repositório acadêmico. Consulte o [README principal](../README.md) e o [índice da documentação](README.md) antes de interpretar instruções antigas como ações pendentes.


Estado de 10/11/2026. Nenhuma transferência ou publicação executada. Destino acadêmico definido pelo usuário: `isalvesb/ReUse`.

## Dependências e reprodução

Next 16.4.5 e Sharp 0.35.5 substituem 16.3.6/0.35.4. A revisão do Next cobre também os avisos de novembro, posteriores à correção 16.4.1 do [GHSA-2464-fhr4-w9xw](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw). O Sharp resolvido pelo Next deve ser 0.35.5 ou superior. A autorização das imagens continua no servidor, com bucket privado e assinatura de 60 segundos.

As três resoluções transitivas corrigidas ficam fixadas em `overrides`: shell-quote 1.11.0, websocket-driver 0.7.5 e source-map-js 1.2.2. Shell-quote 1.9.0 resolvia avisos anteriores, mas ainda era afetado pelo [GHSA-pqg4-j6r4-53mv](https://github.com/advisories/GHSA-pqg4-j6r4-53mv). React 19.2.0, Prisma 6.19.3, Expo 55 e TypeScript 5.9.3 foram preservados. A configuração ESLint existente permanece compatível nos checks executados; não se atualizou sua árvore de ferramentas sem necessidade.

Com Node 24.13.1 e npm 11.8.0, pela raiz:

```sh
npm ci --install-strategy=nested --ignore-scripts
npm run generate:web
npm test
npm run lint:web
npm run typecheck:mobile
npm run design:check
npm ls next sharp shell-quote websocket-driver source-map-js --all
npm audit --omit=dev
```

A geração Prisma não é migration nem seed. A consulta npm transmite inventário de pacotes ao registro. Não executar correção automática com força. O lockfile foi instalado do zero e conferido; as alterações de resolução ficaram restritas aos pacotes indicados, seus binários de plataforma e semver na árvore do Sharp.

A auditoria de produção terminou com zero alertas críticos, mas conserva alertas altos/moderados/baixos. Na Web, os altos restantes são `prisma → @prisma/config → deepmerge-ts`, usados para carregar configuração local confiável. Não foram encontrados nos traces das funções da build de produção, e o servidor usa `@prisma/client`, não essa ferramenta. Os demais altos da árvore Mobile/ferramentas precisam de avaliação antes de distribuição pública; não se migrou Expo ou Prisma para outra versão principal para zerar contagens.

## Fluxos preservados

A busca da Vitrine preserva categoria, modalidade e curadoria, exibe o termo atual e reinicia a paginação. O ajuste de largura apenas contém o card na coluna em 1024 px; não muda o catálogo. O placeholder recebeu opacidade integral para legibilidade.

Perguntas digitadas/sugeridas do assistente aparecem enquanto a resposta é aguardada, com estados de envio e falha; o texto é restaurado no campo após erro. Seleção, confirmação, cancelamento e autorização continuam nos mesmos contratos. Não há resposta IBM simulada em produção ou retry automático de mutação após falha de rede. A renovação após 401 mantém a repetição única com o mesmo identificador/token.

Os clientes Mobile autenticados de perfil, chat, assistente e escrita reutilizam a validação da origem da API: HTTPS fora de desenvolvimento, sem credenciais, caminho, query ou fragmento no endereço base. O catálogo conserva sua validação equivalente. Não colocar segredo de hospedagem em `EXPO_PUBLIC_*`.

## Condições para transferência e Preview

1. Revalidar o remoto de `isalvesb/ReUse`, ancestralidade, regras de revisão e automações. Preparar branch/PR com preservação do histórico; sem força, squash da importação ou ativação involuntária de produção. Não copiar ambientes privados, outputs, dependências, caches ou materiais de assinatura.
2. Configurar Vercel posteriormente, com autorização: raiz `apps/web`, preset Next.js, Node 24.x, instalação na raiz dos workspaces e build webpack. O build executa geração Prisma, não migration/seed/importação. A documentação atual da Vercel informa que o primeiro deployment de um projeto novo é Production; resolver explicitamente esse fluxo antes de criar recursos. Não presumir que outra branch garante Preview inicial.
3. Definir variáveis por ambiente: `DATABASE_URL`, `SUPABASE_AUTH_URL`, `SUPABASE_PUBLISHABLE_KEY`, `REUSE_STORAGE_SECRET`, `RATE_LIMIT_SECRET`, `ASSISTANT_CONFIRMATION_SECRET`; IBM: `REUSE_IBM_ENABLED`, `REUSE_IBM_API_KEY`, `REUSE_IBM_CHAT_URL`, `REUSE_IBM_TRIAL_END_DATE`. Somente nomes/valores de exemplo vão ao Git.
4. `NEXT_PUBLIC_APP_URL` deve coincidir com a origem HTTPS efetivamente usada, inclusive no Preview. Conferir flags do chat integrado/legado. Manter ferramentas antigas fechadas e não preencher suas credenciais por conveniência.
5. Conferir proteção de acesso do Preview e Site URL/redirects do Supabase no domínio autorizado. A proteção precisa permitir uma estratégia segura para a API nativa, sem chave pública de bypass no aplicativo.
6. Mobile exige `EXPO_PUBLIC_REUSE_API_URL` HTTPS estável fora do Mac e `EXPO_PUBLIC_DEV_SKIP_AUTH=false`. O loopback atual serve ao simulador neste Mac. Não houve mudança de ambiente privado ou novo artefato de distribuição nesta Work.
7. Verificar em HTTPS cookies, login/renovação/logout, imagens, API e falhas dos serviços. Homologar escrita somente com fixtures isoladas. Os 104 anúncios e históricos existentes não são fixtures de mutação.
8. IBM permanece trial acadêmico, com corte local configurado no início de 04/12/2026 UTC. Disponibilidade, quota e termos para operação pública precisam ser conferidos. Não usar dados pessoais nem presumir serviço permanente.

## Alcance da validação

Suíte de 175 testes (123 Web e 52 no runner Mobile), lint Web, TypeScript Mobile, tokens e build webpack de produção isolada aprovados. Os novos testes incluem estados do assistente Web com dependências simuladas e bloqueio de origens inseguras nos quatro clientes autenticados. Não substituem homologação nativa.

A development build iOS existente executou no iPhone 16/iOS 27.2: Home, 97 anúncios, Vitrine, Livros/Troca com busca e três resultados, detalhe, retorno preservando filtros, limpeza de filtros e galeria com três fotos. Não foram feitos login/logout novos, publicação/edição, leitura/envio de conversa, marcação de notificação ou operação real IBM. Android, aparelho físico e distribuição continuam fora da homologação desta Work.

Os relatórios e evidências detalhados ficam fora do repositório, em `PRODUTO/outputs/reuse-work2-04-seguranca-20261110/`. A build local não certifica a hospedagem nem autoriza publicação. Curadoria de localidades/perfis demonstrativos exige autorização de dados separada; melhorias visuais secundárias não integram este pacote.
