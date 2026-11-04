# Catálogo compartilhado — Work 1.5

Implementação local de leitura. Web é a referência de produto; dados exclusivamente fictícios do projeto Supabase novo `reuse-lab`. Sem publicação remota, upload ou integração de escrita Mobile.

## Fonte central e contratos

Next.js e Prisma consultam as mesmas tabelas PostgreSQL já existentes. Não houve alteração de schema nem migration. A Web usa `catalog-domain.mjs`; Mobile consome somente HTTP, sem consultar tabelas de domínio diretamente nas telas integradas.

| Contrato público | Resultado |
| --- | --- |
| `GET /api/v1/categories` | `{data: [{id, name, slug}]}` |
| `GET /api/v1/items` | `{data: {items, pagination: {page, pageSize, total, totalPages}}}` |
| `GET /api/v1/items/:id` | `{data: item}` com anunciante público e contagem de anúncios ativos |

Parâmetros da listagem: `q` (até 80 caracteres), `categoria`, `tipo` (`DOACAO`, `TROCA`, `VENDA`), `page` (1–10000), `pageSize` (1–24, padrão 12), `curadoria=pecas-raras` opcional. Parâmetros desconhecidos, duplicados ou inválidos retornam 400. Busca segue a Web: trecho completo sem distinguir maiúsculas, em título, descrição ou nome da categoria; não introduz busca aproximada nem remoção de acentos.

Categorias consultadas no banco e limitadas às seis decisões Web, em sua ordem: `eletronicos`, `roupas`, `moveis`, `livros`, `sapatos`, `outros`. As 11 categorias históricas Mobile não foram reativadas.

Ordenação por criação decrescente e ID crescente para desempate. IDs são strings; datas ISO UTC; preço decimal com duas casas em string, somente em venda, moeda BRL. Imagens usam URLs existentes da Web, resolvidas contra a origem da API no Mobile. Sem upload.

A projeção pública inclui título, descrição, categoria, modalidade, condição, preço, localização pública, imagens, status e datas. Não inclui e-mail, identidade Auth, hash, endereço privado ou campos internos do usuário. Detalhes incluem apenas ID, nome, avatar, avaliação e quantidade ativa do anunciante. Os endpoints públicos não precisam de token, como a vitrine pública Web.

Somente `ATIVO` aparece na listagem e nos detalhes públicos. Ausentes, reservados, concluídos e inativos retornam 404 na API. A prévia Web de item próprio inativo continua dependendo do usuário verificado no servidor; nenhum parâmetro cliente habilita essa exceção na API. Erros de banco retornam 503 sanitizado; respostas seguem o envelope e `no-store` existentes. Escrita não foi criada.

## Dados reproduzíveis

`apps/web/scripts/seed-lab-catalog.mjs --apply` exige destino exatamente igual ao projeto novo, URL Auth correspondente e dois identificadores Auth de teste por variáveis `REUSE_TEST_SUBJECT_A/B`. Usa as configurações locais ignoradas. Não executar o seed acadêmico antigo.

São 15 IDs determinísticos `lab15-item-01` a `lab15-item-15`: 12 ativos, dois por categoria; três controles não públicos (RESERVADO, CONCLUIDO, INATIVO). Cobrem três modalidades, quatro condições, preços e localização explicitamente fictícia. Titulares são somente os dois perfis já existentes. Imagens ilustrativas são arquivos Web preexistentes, inclusive a marca como imagem genérica de Outros.

A carga utiliza upserts, verifica colisões de ID e compara os perfis antes/depois. Foi executada duas vezes com sucesso, mantendo 12 públicos + 3 controles e perfis inalterados. Uma tentativa inicial excedeu o limite transacional de cinco segundos e foi integralmente revertida; o script usa limite explícito de 60 segundos. Não houve reset, DDL ou importação histórica.

## Diferenças resolvidas e capacidades preservadas

- Home, Vitrine, busca e detalhes Mobile agora leem o catálogo central, com carregamento, vazio, erro, repetição da consulta e paginação. Cards e animações nativas existentes, áreas seguras, navegação e fontes foram aproveitados.
- A Vitrine Mobile deixou de apresentar a lista histórica de itens locais do proprietário como se fosse catálogo público. Perfil e sessão compartilhados não foram substituídos.
- Tamanho, CEP, rua, campos e filtros históricos não consolidados na Web não foram acrescentados ao contrato. Condição, preço, localização pública e modalidades seguem a Web.
- Home Web deixou a seleção fixa por identidades demonstrativas antigas para mostrar seis anúncios ativos da base nova. O título nas duas aplicações passou a “Anúncios da comunidade”; não se afirma proximidade calculada por GPS.
- Os cartões promocionais Mobile acionam categorias/curadoria equivalentes à Web. “Peças raras” preserva o seletor demonstrativo já existente da Web; fica vazio na base nova. Não foram criados usuários antigos nem um novo critério arbitrário de raridade.
- Publicação e edição Mobile apresentam aviso de pendência. O código de câmera, permissões e rascunhos foi preservado em `screens/Publish`; não foi religado ao banco histórico nem adaptado para gravar o catálogo novo. A mudança de disponibilidade é explícita, sem apagar a capacidade acadêmica.
- AsyncStorage de cache/rascunhos e os componentes de animação permanecem. A matriz FIAP foi consultada: não exige restaurar 11 categorias ou campos históricos. Nenhum requisito de Marketing/Low-Code foi adicionado.

## Validação realizada em 03/11/2026

| Tipo | Evidência / resultado |
| --- | --- |
| Testes automatizados | 63 Web + 27 Mobile = 90 aprovados; oito testes novos de domínio/cliente de catálogo |
| Análise estática | ESLint Web e TypeScript Mobile aprovados |
| HTTP real e SSR | `scripts/check-catalog.mjs`: oito grupos aprovados, 12 detalhes, imagens, todas as categorias/modalidades/composições, busca, vazio, paginação e 404 dos três controles |
| Regressão Auth real | `scripts/check-profile-regression.mjs`: login A/B, perfil distinto, recusa de bypass/seleção de terceiros, renovação, logout/replay; perfis e datas preservados |
| Interface Web | Vitrine de 12 registros, detalhes do notebook, busca Livro com dois registros e vazio; backend e banco de testes reais |
| Interface nativa | Development build instalado, iPhone 16 / iOS 27.2; Home, Vitrine 12, Eletrônicos 2, Venda 4, Livro 2, detalhes do notebook, retorno, vazio, perda do backend, repetição com recuperação e leitura do perfil A |
| Build Web | Produção compilada; fonte Google substituída pela fixture local já documentada, por restrição de rede. Não é homologação visual da fonte publicada |
| Export Expo | Bundles Hermes iOS e Android gerados. Android não foi executado |

As jornadas iOS usaram React Native na development build da Work 1.4, com JavaScript atualizado pelo Metro em loopback. Não foi Expo Go nem React Native Web. Não houve nova compilação Xcode, pois nenhum módulo/configuração nativa mudou. Build, testes e jornada de interface são evidências distintas.

Evidências completas fora do Git: `../outputs/reuse-lab-work1-5-20261103/`. Os registros `catalog-http-final.json`, `profile-regression.json`, `fixtures-repeat.log`, `check-final.log`, `build-*-final.log`, `ios-*.txt/jpg`, `security.json` e `originals.json` distinguem cada verificação.

## Limites e próxima decisão

Não há homologação em aparelho físico, execução Android, distribuição ou deploy. Galeria com múltiplas fotos, todos os gestos e todas as combinações na interface não foram percorridos; combinações de filtros e paginação foram verificadas por HTTP. A interrupção do backend foi verificada na interface Mobile; a indisponibilidade PostgreSQL da Web não foi provocada no serviço remoto. O navegador de testes ficou indisponível após a interrupção local; as verificações Web seguintes foram feitas por HTTP/SSR.

As estatísticas históricas do perfil Mobile ainda não integram os anúncios (podem mostrar zero); os detalhes mostram a contagem ativa central. Não houve regressão de edição/leitura dos campos de perfil. Imagens são ilustrativas e dependem do servidor Web local; falhas de imagem não têm cache offline específico. Curadoria rara ainda é demonstrativa. Catálogo permanece público de leitura, sem API de escrita, upload ou chat integrado. Interfaces Web de outras funcionalidades já existentes não foram reimplementadas nem homologadas nesta tarefa.

Próximo objetivo recomendado para discussão: definir o contrato de publicação/edição e imagens, incluindo câmera e rascunhos nativos, antes de autorizar sua implementação. Não iniciado.
