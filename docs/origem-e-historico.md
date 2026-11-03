# Origem e continuidade do histórico

A importação foi feita sem squash, a partir de cópias independentes dos projetos ReUse Web e Mobile. Os históricos completos originais, os oito commits locais, os três stashes e as fontes nativas locais permanecem preservados em backups externos ao laboratório. Stashes e refs de preservação não integram a publicação.

| Aplicação | HEAD original aprovado | HEAD importado |
| --- | --- | --- |
| Web | `06e2c9556d5b60ede4f0d5d338b182699e86065c` | `13eaa61255853e471d0fe50a7e994af6dd6cfee3` |
| Mobile | `056970c446128718f87c27b045de15a322451c39` | `056970c446128718f87c27b045de15a322451c39` |

A sanitização usou git-filter-repo 2.47.0 em clone isolado de uma única branch Web. A substituição literal do destinatário autorizado por `teste@example.com` alcançou somente `src/app/api/recuperar-senha/route.js`, em seis árvores históricas. Não foram removidos commits ou simplificados merges. Autores, committers, datas, mensagens, modos de arquivo e relações entre pais foram conferidos. Somente as árvores que continham o destinatário tiveram seu conteúdo alterado; os descendentes recebem novos SHAs por encadeamento.

Foram mantidos 58 commits Web e 143 Mobile. Dos 58 Web, 52 têm novos SHAs e seis permanecem iguais. A árvore Web atual aprovada não continha o destinatário e permaneceu idêntica após a sanitização. Portanto, nenhuma chamada ativa de recuperação de senha foi substituída por um destinatário fictício. A substituição no código antigo não representa uma implementação funcional de recuperação de senha.

Os mapas completos estão em [Web](web-commit-map.tsv) e [Mobile](mobile-commit-map.tsv). Os valores da primeira coluna Web são referências documentais de rastreabilidade, não refs Git destinadas a recuperar o conteúdo removido. Os commits Mobile mantiveram seus SHAs. A antiga branch Mobile `mvp` já é ancestral do HEAD importado e continua alcançável pelo histórico Mobile.

| Marco do laboratório | SHA |
| --- | --- |
| Fundação | `8f98702eef4617c0cd13f181e3a4ddb7d546b276` |
| Importação Web | `ce1df925a5778844cb1986450ae2be7d5d3a44c9` |
| Importação Mobile | `b2f98b819f9f082897537aff3d44c9263aa6c671` |

Nos dois marcos de importação foi comparado o identificador da árvore de `apps/<aplicação>` com a árvore da origem aprovada. As duas comparações foram iguais. O ajuste posterior de coexistência altera apenas nomes de pacotes, scripts e a posição do lockfile, além da documentação da raiz. O código de produto, assets, migrations, plugins e configuração visual permanecem como nas árvores aprovadas.

As pastas `ios/` e `android/` ignoradas no Mobile original não foram incorporadas. Os 68 arquivos de fontes/configuração selecionados continuam no backup verificado. Pods, build, configurações da máquina e material de assinatura não são conteúdo de publicação.
