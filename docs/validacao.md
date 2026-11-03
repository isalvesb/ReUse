# Validação da fundação — 03/11/2026

As aplicações foram verificadas de forma independente no mesmo monorepo, com Node 24.13.1 e npm 11.8.0. Não foram usados arquivos `.env` ou credenciais das fontes. Os checks receberam variáveis sintéticas e destinos locais; a saída de rede dos processos Node foi bloqueada durante testes e builds. A obtenção de pacotes e binários oficiais foi uma etapa separada da execução das aplicações.

| Verificação | Resultado |
| --- | --- |
| `npm ci --ignore-scripts` pela raiz | Aprovado: 1.343 pacotes instalados |
| Lock único comparado aos dois locks originais | 480 entradas Web e 944 Mobile preservadas integralmente, sem atualização de versão |
| Resolução dos workspaces | `npm ls --workspaces --depth=0 --json` aprovado |
| Geração explícita do cliente Prisma | Aprovada; nenhuma migration ou seed executada |
| Testes Web no workspace | 48 aprovados, zero falhas |
| Testes Mobile no workspace | 14 aprovados, zero falhas |
| Baseline nas cópias isoladas de origem | Os mesmos 48 e 14 testes aprovados |
| ESLint Web | Aprovado |
| TypeScript Mobile | Aprovado |
| Expo config | Resolvida com configuração fictícia |
| Expo/Metro iOS e Android | Bundles Hermes exportados, 4,2 MB cada; não são builds nativos assinados |
| Next com Webpack | Compilação, geração das páginas e rastreamento de arquivos aprovados, com fixture de fontes local |
| Next com Turbopack | Não concluiu: tentativa normal encerrada após aproximadamente 200 segundos; tentativa com fixture encerrada no limite de 90 segundos. Causa não comprovada |

Os testes de baseline usam as cópias isoladas das fontes com as mesmas dependências instaladas pelo lock consolidado, sem ler ou reutilizar `node_modules` dos projetos originais. A árvore Web atual depois da sanitização é igual à árvore aprovada original. Os testes não acessam provedores reais; o Mobile usa serviços simulados no código de teste.

A comparação arquivo a arquivo confirmou que fontes de produto, assets e configurações dos aplicativos não mudaram. Os manifests mudaram somente para os nomes `@reuse/web` e `@reuse/mobile` e para acrescentar o comando de exportação Mobile. As entradas dos locks antigos foram movidas para o lock da raiz sem mudanças de versão, integridade ou resolução. Nenhum ajuste de Metro ou Next config foi necessário.

O comando `build:web` da raiz seleciona explicitamente Webpack, que concluiu neste ambiente. O script original do aplicativo permanece `next build`. Os dois comportamentos estão documentados para que a limitação do Turbopack não seja confundida com uma validação aprovada.

## Limites

O build Web offline usou o mecanismo de respostas fictícias de fontes presente no Next instalado. A fixture ficou fora do repositório e não mudou as fontes declaradas no código. Isso comprova a compilação, não a aparência das fontes reais. O primeiro ensaio dessa fixture falhou por um caminho local incorreto; o caminho foi corrigido e a compilação foi aprovada.

Não foram realizados testes de interface no navegador, aparelho físico, acessibilidade assistiva, câmera, galeria, notificações, build nativo Xcode/Gradle, assinatura ou distribuição. O funcionamento de recuperação de senha, login, banco, storage, chat e serviços IBM não foi homologado. Nenhuma operação de banco, seed, autenticação real, upload ou deploy foi executada.

As dependências herdadas incluem avisos de depreciação. Não foram atualizadas e não foi feita uma nova auditoria completa de vulnerabilidades. A existência de uma compilação aprovada não significa prontidão para produção.

As fontes nativas locais ignoradas permanecem no backup externo. Sua reprodução pelo prebuild e a divergência conhecida entre AppDelegate local e plugin de cenas precisam de validação específica antes de compilar/distribuir aplicativos.

Não foi iniciada integração de backend, dados, contas ou identidade visual. As próximas etapas dependem de autorização própria.


## Continuação Work 1.3

As evidências acima descrevem a fundação. A configuração e os limites atuais de autenticação/perfil estão em [contas e perfis compartilhados](contas-e-perfis.md). Não houve publicação remota desta implementação.
