# ReUse: base visual Web e Mobile

Work 1.10. A Web é a referência de produto. Este documento organiza a identidade existente; não redefine fluxos, contratos ou funcionalidades. Implementações de componentes permanecem próprias de Next.js e React Native.

## Fonte única e manutenção

`design/tokens.json` contém os valores comuns. Execute `npm run design:tokens` após editar a especificação e versione também as saídas `apps/web/src/app/design-tokens.css` e `apps/mobile/src/design/tokens.ts`. `npm run design:check` detecta divergências. Não editar as saídas manualmente. O gerador usa apenas Node, sem pacote compartilhado, dependência ou ferramenta de monorepo adicional.

A Web mantém os aliases Tailwind `reuse-*`, agora derivados desses tokens. O Mobile importa cores, espaço, raios, fontes e tamanhos do arquivo gerado. `src/design/Text.tsx` fornece Inter, cor semântica e altura de linha proporcionais, preservando propriedades de acessibilidade e os estilos específicos de cada tela. Não existe compartilhamento forçado de JSX.

## Papéis visuais

| Papel                   | Valor     | Uso                                    |
| ----------------------- | --------- | -------------------------------------- |
| Fundo                   | `#F7EFDE` | Base creme                             |
| Superfície              | `#FFFFFF` | Cards e campos                         |
| Superfície suave        | `#F3E8D2` | Áreas auxiliares                       |
| Texto/navegação         | `#342A2A` | Texto principal e áreas escuras        |
| Texto secundário        | `#584C4C` | Metadados e instruções em áreas claras |
| Inverso                 | `#F7EFDE` | Texto sobre marrom                     |
| Destaque                | `#EBBBEB` | Ação principal, seleção e foco         |
| Destaque pressionado    | `#DDA6DD` | Hover da ação principal Web            |
| Borda                   | `#8F817D` | Contorno legível de campos             |
| Erro                    | `#8B2424` | Falha acompanhada de mensagem textual  |
| Secundário sobre escuro | `#D8CFC2` | Informação em navegação/cartão escuro  |

Rosa é superfície de interação com texto marrom, não cor de texto pequeno sobre creme. Os testes verificam contraste AA de texto nos pares semânticos principais e contraste mínimo 3:1 da borda sobre branco/creme; isso não substitui auditoria completa de acessibilidade de todas as telas e imagens. Cores ilustrativas de categorias, modalidades, fotografias e indicadores específicos foram preservadas quando não representam o mesmo papel semântico.

## Tipografia e escala

Inter é a fonte de corpo, controles, metadados e títulos de interface. Usar os pesos 400, 500 e 700 já disponíveis. Syne permanece na marca ReUse e nos usos expressivos existentes, como a apresentação institucional Web. Krona One é declarada/carregada na configuração Web, mas não foi encontrada como família aplicada nas telas prioritárias; não foi adicionada ao Mobile nem removida da configuração nesta Work.

Escala comum: legenda 12, rótulo 14, corpo 16, subtítulo 20, título 26 e destaque 32. São referências, não substituição indiscriminada dos tamanhos responsivos existentes. No nativo, o texto base usa entrelinha 1,5, ajustável por estilo específico; a escala do sistema permanece habilitada. A marca mantém suas proporções próprias.

Espaçamentos: 4, 8, 12, 16, 24, 32 e 48. Raios: pequeno 8, campo 20, card 16, controle 24 e cápsula 999. Controles principais têm referência de 48 de altura; alvo de toque mínimo de referência 44. Não significa que todos os controles históricos já foram convertidos ou auditados individualmente.

## Componentes e estados

- Ação principal: rosa com texto marrom e altura confortável; secundária: contorno/superfície clara ou marrom conforme o contexto Web existente. Ação destrutiva mantém sua distinção. Desabilitado deve comunicar indisponibilidade também semanticamente.
- Campos: superfície clara, texto marrom, borda legível, rótulo persistente e mensagem de erro textual. Preservar teclado, tamanho máximo e regras de validação.
- Filtros: seleção rosa, texto marrom; categorias podem rolar horizontalmente no nativo, modalidades podem quebrar linha. Não comprimir rótulos para imitar o desktop.
- Cards: superfície branca, metadados marrom auxiliar, raio 16; imagens nativas ajustadas para reservar espaço ao texto. Não ocultar modalidades/preços/condições.
- Navegação: marrom e seleção rosa. Manter barra nativa flutuante, áreas seguras, espaço final de rolagem e semântica de seleção das abas.
- Erro/vazio/carregamento: preservar mensagens, indicadores e tentativas existentes. Não apresentar demonstrações como serviços disponíveis. Google e Facebook permanecem visíveis e indisponíveis nas duas aplicações.
- Modais e confirmações continuam usando as implementações existentes de cada plataforma, sem substituição de fluxo nesta Work.
- Ícones: Lucide na Web e Ionicons no Mobile continuam; alinhar significado e rótulos acessíveis, sem trocar bibliotecas.
- Movimento: preservar os gestos e animações nativas existentes. A Web respeita preferência de movimento reduzido nas transições CSS. A revisão completa das animações de bibliotecas e de movimento reduzido nativo fica para etapa específica.

## Inventário comparativo e aplicação

Inventário baseado no código atual, no levantamento da Work 1.2 e em execução local Web/iOS. Não é nova auditoria arquitetural.

| Área              | Divergência observada                                                                                                     | Ajuste desta Work / particularidade preservada                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login             | Cores próximas duplicadas, fontes nativas e contraste dos controles divergentes; redes sociais Web eram links desativados | Tokens, Inter, botão principal coerente; Google/Facebook como botões Web realmente desabilitados, mantendo aviso e presença; login por senha intacto |
| Home              | Variações de creme/marrom, fontes e valores de espaço dispersos                                                           | Tokens nos componentes ativos, Inter em textos; Syne na marca, banners e categorias ilustradas preservados                                           |
| Vitrine/busca     | Metadados nativos muito claros e imagem larga comprimindo título; seleção da barra diferia do destaque Web                | Texto auxiliar mais legível, imagem 112×112, branco/raio/espaço comuns, título Inter e destaque rosa; filtros e regras já homologados preservados    |
| Detalhes          | Tipografia/metadados divergentes; ações de contato/edição pareciam texto avulso                                           | Tokens e ação rosa com alvo de 48; galeria e permissões inalteradas                                                                                  |
| Publicação/edição | Campos cinza/bordas muito claras e títulos com família diferente                                                          | Campos claros com contorno semântico, Inter e ação coerente; câmera, fototeca, rascunhos e upload preservados                                        |
| Perfil            | Cores e fontes de metadados/campos divergentes                                                                            | Tokens e Inter em perfil/edição; avatar, conta e validação intactos                                                                                  |
| Conversas         | Fundos Web variavam entre dois cremes; texto nativo sem fonte comum                                                       | Creme canônico e Inter no nativo; histórico, envio, polling, retry e autorização inalterados                                                         |
| Notificações      | Tipografia e valores visuais locais                                                                                       | Tokens e Inter, sem alterar contador, leitura ou destinatário                                                                                        |

Não foi criado redesign, biblioteca universal de componentes ou pacote `shared`. Arquivos históricos de telas substituídas não são reativados. Migração de cada valor residual, reorganização extensa de estilos, unificação de todas as ilustrações/ícones, nova navegação e revisão completa de acessibilidade são propostas futuras, não requisitos para estes ajustes prioritários.

## Como verificar futuras alterações

Execute `npm run design:check`, os testes de contraste em `npm run test:mobile`, lint Web e TypeScript Mobile. Confira as telas afetadas em Web estreita/desktop e na development build iOS, incluindo foco/teclado, toque, scroll, áreas seguras e estados de falha. Builds e bundles não equivalem a homologação visual; Android e aparelho físico exigem execução própria.
