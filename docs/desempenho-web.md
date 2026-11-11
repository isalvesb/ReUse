# Desempenho Web — Work 2.02

Referência: diagnóstico da Work 2.01, HEAD `50a597b6486c22d61be38f033d2fc29a8180f8a9`. Alterações locais em `work/1-3-contas-perfis`, sem alteração de infraestrutura, dependências ou dados do laboratório.

## Correções

- Sessão e perfil são deduplicados por renderização com React `cache`, que não compartilha identidade entre requisições. Route Handlers e validação Bearer continuam verificando a identidade a cada acesso. O perfil selecionado durante a construção do ator é reutilizado.
- Usuários e sessões existentes são consultados antes do provisionamento. Upserts ficam como fallback de primeiro acesso, com tratamento de concorrência por chave única. Revogação, proprietário e limite de sete dias continuam sendo verificados, sem reativar ou prolongar sessões existentes.
- A Vitrine inicia leituras independentes em paralelo. Lista e total permanecem na mesma transação, agora com isolamento `RepeatableRead`, incluindo as relações carregadas pelo Prisma. Não há cache persistente do catálogo.
- A autorização de imagens usa uma consulta parametrizada que reúne associação, anúncio e upload. Anúncios não ativos continuam exigindo proprietário verificado. Bucket privado, assinatura de 60 segundos, redirecionamento `private, no-store` e resposta 404 para acesso privado recusado são preservados.
- O cabeçalho possui um único fluxo de atualização do contador, compartilhado pelo sino e menu. A tela de notificações atualiza lista e contador em uma Server Action localizada; o cabeçalho não inicia outro polling nessa tela. Intervalo de dez segundos, foco e retorno de visibilidade são preservados, com uma leitura em andamento por consumidor e descarte de respostas após desmontagem. Não há cache global de notificações. Refresh completo fica reservado à reconciliação de identidade alterada/encerrada, além das operações já existentes.

## Medição local

10/11/2026, Next 16.3.6 com webpack em desenvolvimento, mesmo Mac, rede e sessão fictícia preexistente. Instrumentação temporária externa ao repositório registra operações, tabelas e tempos sem parâmetros ou credenciais.

| Vitrine autenticada aquecida | Cinco tempos de servidor | Mediana |
|---|---|---|
| Antes | 5.000 / 4.200 / 2.600 / 3.400 / 3.300 ms | 3.400 ms |
| Depois, versão final | 2.300 / 1.228 / 1.001 / 937 / 1.034 ms | 1.034 ms |

Redução observada: **69,6%**. Não são tempos de LCP, FCP ou hidratação. A primeira abertura depois das alterações levou 37,1 segundos, dos quais 34,3 segundos foram atribuídos ao framework durante recompilação; o código da aplicação levou 2,8 segundos. Essa condição não é equivalente ao cache anterior reutilizado. Arquivos de dependências sob demanda no iCloud também foram encontrados durante as verificações. Não foi corrigida a configuração do Mac.

Na amostra HTTP de três autorizações da mesma fotografia pública, a mediana caiu de 680 para 560 ms; autorização + download caiu de 1.397 para 1.281 ms. A redução de consultas por foto, de três para uma, está comprovada; o ganho de tempo da amostra é menor e varia com a rede. A Vitrine anônima teve mediana de 893 ms antes e 946 ms depois. O objetivo principal foi alcançado no percurso autenticado; não se presume ganho em todas as rotas.

A build webpack de produção passou em fonte isolada, sem executar o prebuild do Prisma ou alterar os artefatos originais. Bibliotecas existentes foram referenciadas para leitura, com escrita no repositório original explicitamente negada ao processo; fontes, cliente gerado copiado e caches da build ficaram na pasta temporária. As cinco navegações autenticadas aquecidas de produção levaram 1.311 / 749 / 868 / 1.273 / 814 ms no servidor, mediana de **868 ms**, excluindo RSC e prefetch. A primeira abertura do processo levou 2.654 ms. A comparação usou a sessão preexistente, sem novo login; não homologa renovação de cookies Secure por HTTPS.

Passaram 123 testes Web, 47 Mobile, lint Web, TypeScript Mobile, tokens de design e `git diff --check`. Um erro intermediário na renderização anônima e o reenvio indevido do cursor decodificado no polling de páginas posteriores foram identificados na regressão/revisão, corrigidos e cobertos antes do encerramento.

As medições e evidências completas ficam fora do Git, em `PRODUTO/outputs/reuse-work2-02-desempenho-20261110/`. O relatório final dessa pasta registra checks, build, limitações e commits efetivamente concluídos.

## Regressões e continuidade

Fixtures isoladas cobrem JWT válido/inválido/expirado, falha do Auth, sessão revogada e expiração do domínio, duas identidades, corrida de provisionamento, matriz de visibilidade de imagens, erro de Storage, isolamento de notificações, concorrência de polling e snapshot de paginação. As leituras HTTP reais cobrem categorias, catálogo paginado usado pelo Mobile, busca combinada, recusa de rotas privadas sem sessão/Bearer válido, detalhes não públicos e URLs assinadas. Uma URL de 60 segundos foi recusada pelo Storage após expirar.

Os hashes das 13 tabelas conferidas permaneceram iguais aos do início da execução: 104 anúncios, 97 públicos, 107 associações de imagens, três conversas, 11 mensagens e 11 notificações. Não foram criados usuários, anúncios, conversas ou registros remotos para esses testes. Sessões inválidas/revogadas e a troca entre contas foram testadas com fixtures, sem revogar sessões reais.

Esta correção não homologa publicação nem transfere o projeto. A auditoria integrada ainda deve cobrir Web e aplicativo nativo, renovação/encerramento de sessão entre plataformas, envio/leitura de mensagens com dados isolados, fluxos IBM, aparelhos físicos, acessibilidade e os achados UX/UI anteriores. Não há autorização implícita para push, deploy ou alteração dos repositórios acadêmicos.
