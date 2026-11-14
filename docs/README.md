# Documentação do ReUse

Esta pasta reúne a **documentação técnica e acadêmica** do ReUse. O produto atual é apresentado no [README principal](../README.md), com os links para [site](https://reuse-lab.vercel.app), [vídeo-pitch](https://youtu.be/6i3HlwCB0co) e Figma.

> **Como ler estes documentos:** os registros têm datas e escopos diferentes. Uma afirmação como “não havia backend compartilhado”, “não houve deploy” ou “o Mobile usava API fictícia” pode estar correta **na data daquele teste**, mas não descrever a `main` atual. Não confunda testes locais e de simulador com homologação de toda a hospedagem, dispositivos físicos ou serviços externos.

## Projeto e apresentação

| Documento | Conteúdo |
| --- | --- |
| [Plano de marketing digital](plano-marketing-digital.md) | Proposta acadêmica de campanha orgânica de 30 dias, SWOT, 8 Ps, calendário e KPIs. **Planejamento, não campanha executada.** |
| [Identidade e design system](design-system.md) | Tokens, tipografia, cores, componentes e cuidados de UX/UI |
| [Dados e imagens demonstrativos](demonstracao-academica.md) | Limites dos anúncios, perfis, imagens e resultados simulados |
| [Origem e histórico](origem-e-historico.md) | Preservação do histórico Git e organização do monorepo |

## Arquitetura e recursos

| Documento | Conteúdo |
| --- | --- |
| [Contas e perfis](contas-e-perfis.md) | Identidade Supabase, autorização e contratos compartilhados |
| [Catálogo compartilhado](catalogo-compartilhado.md) | Busca, leitura e separação dos dados de demonstração |
| [Publicação e imagens](publicacao-e-imagens.md) | Escrita, edição, armazenamento e suas restrições |
| [Chat e notificações](chat-e-notificacoes.md) | Conversas e notificações |
| [Estatísticas de perfil](estatisticas-perfil.md) | Indicadores de anúncios sem presumir negociações concluídas |
| [Assistente IBM](ibm-assistant.md) | Integração experimental com watsonx Orchestrate, autorização e confirmação do usuário |
| [Manutenção de imagens](manutencao-imagens.md) | Operações manuais e limites do armazenamento |
| [Importação demonstrativa](importacao-demonstrativa.md) | Curadoria e origem dos anúncios fictícios |

## Registros históricos e preparação

Estes documentos são **evidências datadas**. Preservam contexto e rastreabilidade, inclusive nomes originais das sessões de trabalho, mas não substituem o estado do repositório ou da hospedagem em novembro de 2026.

- [Validação da fundação, 03/11](validacao.md)
- [Segurança e sanitização da importação](seguranca.md)
- [Homologação iOS em simulador](homologacao-ios.md)
- [Desempenho Web](desempenho-web.md)
- [Preparação técnica anterior à publicação](pre-publicacao.md)
- [Planejamento da transferência acadêmica](transferencia-academica.md)
- [Mapas de histórico Git: Mobile](mobile-commit-map.tsv) e [Web](web-commit-map.tsv)

Os relatórios ainda existentes em `apps/web/docs/` e `apps/mobile/docs/` também podem refletir **versões acadêmicas anteriores**. Não são, por si só, guias operacionais da integração atual.

## Executar e verificar

Os comandos oficiais, workspaces e pré-requisitos estão no [README principal](../README.md). Por segurança, configure as variáveis de ambiente conforme os exemplos de cada aplicação, trabalhe apenas com ambientes autorizados e **não execute migrations, seeds ou operações destrutivas em bancos compartilhados** sem revisão do destino.

Não houve nesta reorganização execução de testes, `npm audit`, builds nativos, alterações de produção ou homologação de serviços externos.
