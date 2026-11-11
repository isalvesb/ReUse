# Homologação ReUse Mobile — 25/10/2026

## Resultado e limites

**Homologação parcial, com jornadas internas funcionais em iOS e pendências explícitas de recursos nativos e provedores reais.** O aplicativo já possui evidências para compor uma demonstração acadêmica local de busca, Vitrine, detalhes, galeria de anúncio, publicação sem fotos, edição, perfil, rascunho e conversa demonstrativa. Não está integralmente homologado para alegar captura pela câmera, seleção e upload de fotos pela interface ou autenticação real.

O Mobile pode participar do pitch com os percursos aprovados e as simulações identificadas. Para gravar um percurso completo de câmera/login/serviços reais ainda faltam as verificações P1 abaixo. Não houve produção de pitch, apresentação, vídeo ou PDF final.

## Identificação e preservação

- Repositório confirmado por sua configuração local: `isalvesb/ReUse`, em `/Users/guicunha/wd/ReUse`.
- Estado inicial: `main`, commit `5f34ae2` (`nova tela chats; edicao de item`), sem mudanças locais. Criada a branch exclusivamente local `codex/homologacao-mobile-2026`.
- Expo 55.0.23, React Native 0.83.6, React 19.2, TypeScript 5.9. Nenhuma dependência de produto foi acrescentada ou atualizada.
- `.env`, credenciais, serviços externos e banco remoto não foram alterados. Nenhum fetch, push, PR, issue ou publicação foi necessário nesta homologação.
- Código executado em cópia independente: `/private/tmp/fiap-homologacao-20261025/mobile`, com dependências e diretório nativo separados. O build não reutilizou DerivedData de outro projeto.
- Metro em `127.0.0.1:4330`; API fictícia em `127.0.0.1:4335`, com JSON exclusivo. Firebase/Facebook/Supabase recebem somente valores fictícios; autenticação foi desviada pelo modo de desenvolvimento preexistente. Eventos automáticos do Facebook foram desativados no binário de teste.
- Simuladores novos: iPhone 16, iOS 27.0, 393×852 pontos, e iPhone SE de 3ª geração, iOS 27.0, 375×667 pontos. Não foi utilizado iPhone físico nem simulador do Flui. Os dois simuladores usam a API fictícia do Mobile; isso não representa integração com o Web.

## Matriz acadêmica e evidências

Fontes examinadas em `/Users/guicunha/Desktop/focos/*/fiap 2026/` (o asterisco pertence ao nome literal do diretório):

- `reuse-2-enunciado-1.png`: telas 40%, UX/UI 30%, AsyncStorage 15%, câmera 15%; recursos nativos onde fizerem sentido.
- `reuse-2-enunciado-2.png`: animações 20%, keyframes 15%, transições 15%, gamificação 50%; aceita planejamento, sem exigir todas as recompensas operacionais.
- `reuse-3-enunciado.png`: APIs 60%, autenticação/sessões 20%, armazenamento/cache local 20%.
- `reuse-4-enunciado.png`: modelagem de dados; não foi convertido em exigência de integração operacional Mobile/Web.
- `reuse-2-entrega-1.pdf`: oito páginas físicas; telas nas páginas 4–5, AsyncStorage e câmera nas páginas 6–7. Páginas 4–6 renderizadas para comparação; página 5 inspecionada visualmente.
- `reuse-2-entrega-2.pdf`: doze páginas; animações/transições nas páginas 3–9 e plano de gamificação nas páginas 10–11.

| Requisito ou recurso | Situação | Evidência e alcance da conclusão |
| --- | --- | --- |
| Telas e navegação React Native | Parcialmente atendido | Percursos internos executados em dois simuladores; `App.tsx`, `src/screens/*`. Telas de login/cadastro/recuperação estão no código e na entrega anterior, mas o acesso real não foi exercitado nesta revisão |
| UX/UI mobile | Parcialmente atendido | Duas dimensões nativas, correção do campo de chat coberto, opções acessíveis dos seletores e área segura da busca; sem teste com VoiceOver, Dynamic Type ou iPad |
| AsyncStorage | Atendido no escopo local exercitado | Título/categoria/modalidade/descrição/localização do rascunho e perfil preservados após recarregar; `src/Services/Storage.ts`, `Publish/restaurarRascunho`, `EditProfile/handleSave`. Fotos do rascunho não são persistidas |
| Câmera | Parcialmente atendido | Implementação e pedido de permissão executados; simulador devolveu indisponibilidade tratada por mensagem. Não comprova captura física; `Publish/abrirCamera` |
| Galeria para adicionar fotos | Parcialmente atendido | Permissão concedida e seletor iOS realmente aberto. A ferramenta não expôs controles utilizáveis para concluir a seleção; não foi injetado resultado fictício no aplicativo |
| Upload de fotos | Parcialmente atendido | Quatro testes unitários cobrem erro inicial, erro na segunda foto, leitura inválida e sucesso de duas URLs. Não equivalem a upload nativo completo nem a validação do Storage real |
| APIs de anúncios | Parcialmente atendido | SDK do aplicativo executou GET, POST e PATCH contra API fictícia local. Dois cadastros, uma edição e consultas conferidos no JSON e na interface. Supabase, RLS e concorrência reais não foram homologados |
| Autenticação e sessão | Não verificável contra provedor real | Firebase existe em `src/Services/firebaseAuth.ts`; `DEV_SKIP_AUTH` preexistente foi usado somente no ambiente de homologação. Não alegar login Google/Facebook, recuperação por e-mail ou proteção de servidor validados |
| Cache/continuidade local | Atendido nos dados exercitados | Rascunho e perfil persistidos. Não há alegação de catálogo offline, cache completo de imagens ou sessão real validada |
| Animações e gamificação | Parcialmente atendido na implementação; plano anterior localizado | Splash/transições e indicadores de publicações permanecem no app. Pontos, ranking e todas as conquistas do plano não foram presumidos implementados. Recompensas exibidas foram identificadas como ilustrativas |
| Busca, categorias e Vitrine | Atendido na demonstração local | Busca por CADEIRA, termos combinados, filtro de Roupas vazio, limpar filtros, Vitrine com três itens, filtro de vendas vazio, falha de API e recuperação; `Home`, `Showcase`, `lib/catalog.ts` |
| Detalhes e galeria do anúncio | Atendido na demonstração local | Anúncio real do servidor fictício aberto; segunda miniatura selecionada com estado acessível correspondente; `Product`, captura `reuse-mobile-ios-galeria.png` |
| Publicação e edição | Atendido na demonstração local sem novas fotos | Publicação confirmada após correção; formulário limpo; edição carregada, gravada e refletida na Vitrine; CEP inválido bloqueado; troca de edição para novo anúncio começa com formulário próprio |
| Conversas | Atendido como demonstração temporária | Envio, limpeza do campo, última mensagem no resumo, isolamento por contato e campo livre da TabBar, em duas alturas. Não há comunicação externa nem persistência após sair da área; `Chats` |
| Notificações | Não atendido como serviço em tempo real nesta demonstração | Interface informa indisponibilidade, em vez de representar falta de sessão como caixa vazia. O código usa identidade Supabase, enquanto o login principal usa Firebase; não foi criada uma integração presumida |
| Favoritos | Não encontrado | Nenhum fluxo funcional encontrado no código ou exigência específica nos materiais examinados. O coração da modalidade Doação não é um botão de favoritos. Não acrescentado ao escopo |

Não foi atribuído funcionamento histórico ao código atual. Screenshots anteriores de formulário preenchido não comprovam publicação persistida nem recebimento real de e-mail.

## Defeitos encontrados e corrigidos

| Prioridade | Defeito comprovado | Correção e reteste |
| --- | --- | --- |
| P0 no ambiente iOS atual | Queda na abertura por falta de ciclo UIScene, evidenciada no diagnóstico nativo | Plugin de cenas preserva o AppDelegate Expo e acrescenta manifesto/delegado. Mesmo Swift aplicado à cópia compilada; build aprovado e navegação nativa realizada. Não há garantia de Release/Android |
| P1 | Upload capturava erro e devolvia uma lista parcial/vazia, permitindo continuação indevida | Erro agora interrompe o cadastro. Antes: três testes de falha reprovavam e um passava; depois todos os quatro passam |
| P1 | Anúncio gravado no servidor fictício, mas tela mostrava falha de SecureStore em uma atualização posterior | Removida leitura legada de token usada apenas para incentivo. Cadastro é separado das atualizações locais; uma falha posterior informa que o anúncio foi salvo. Novo cadastro concluiu, limpou o formulário e apareceu na Vitrine |
| P1 | Total de publicações incrementado duas vezes e título de incentivo incoerente com quem já publicou | Contagem consultada novamente após gravar; removidos incrementos duplicados e corrigido texto. Três registros no servidor corresponderam a três na Vitrine e ao indicador do marco de três itens |
| P1 | Edição abria vazia: havia identificador e botão de salvar, mas nenhum carregamento do item | Carregamento do anúncio, verificação do proprietário na interface, preservação de campos/fotos, erro/retentativa e bloqueio até concluir a carga. Título alterado, confirmação exibida e Vitrine atualizada. Essa verificação cliente não substitui RLS |
| P1 | Mudança entre editar e publicar podia reutilizar o mesmo estado de formulário | Identidade própria por modo/item em `App.tsx`. Reteste: novo anúncio ficou vazio e não herdou CEP inválido ou título da edição |
| P1 | Busca e categorias não afetavam os cartões fixos; cartões não abriam os anúncios da API | Home consulta anúncios existentes, combina termos/categoria e abre detalhes por ID. Busca, filtro vazio e limpeza executados em iOS. A Home mostra até seis resultados por vez; não é uma paginação completa |
| P1 | Seletores agrupavam todas as opções em um único elemento de acessibilidade | Fundo deixa de agrupar as opções; painel modal e modalidades têm semântica. Seleção individual de Livros e Revistas e Doação concluída pelo navegador de acessibilidade do simulador |
| P1 | API indisponível aparecia como zero itens e Vitrine vazia | Mensagem específica, contagem indisponível e nova tentativa. API de teste desligada deliberadamente: erro observado; religada: botão restaurou três itens |
| P1 | Botão de mensagem não enviava; contatos compartilhavam conteúdo fixo | Estado temporário por contato, envio de texto não vazio, campo limpo e resumo atualizado. Isolamento entre os dois contatos conferido |
| P1 | TabBar cobria o campo de mensagem com teclado fechado | Espaço reservado quando chat está na navegação principal, área segura e rolagem ao final. Envio comprovado em 393×852 e 375×667, com campo visível |
| P1 | CEP novo de oito dígitos podia conservar endereço anterior; resposta antiga podia vencer consulta nova | Endereço limpo na mudança e versão da consulta para ignorar respostas atrasadas. Reteste real com CEP público 01001-000 e depois 00000-000: endereço removido, erro visível e gravação bloqueada |
| P1 | Notificações desconectadas apareciam como ausência de novidades | Estado de sessão/carregamento/falha e aviso explícito no modo demonstrativo. Não foi simulada entrega real de notificação |
| P2 | Avaliação 4.8 fixa e impacto mensal sem fonte pareciam resultados reais | Avaliação ausente indicada por traço; removido total mensal fictício; recompensas identificadas como ilustrativas |
| P2 | Rótulos internos de condições e separador solto no cartão; ações sem nome; busca sob barra de status | Condições legadas legíveis, separador condicional, nomes de perfil/edição/fotos/categorias e rolagem respeitando área segura. Retestes e captura final em iPhone SE |

## Testes e validações

- **14 testes automatizados aprovados**, zero falhas: busca (3), cenas iOS (3), preparação da edição/condições (4), upload (4). Sem acesso a banco ou autenticação reais.
- `npm run typecheck`: aprovado; `node --check` em configuração/plugin; AST Python dos iniciadores aprovado; `git diff --check` aprovado.
- O projeto não possuía comando/configuração de lint dedicado. Não foi declarado um ESLint inexistente como aprovado nem acrescentada dependência só para esse fim.
- Compatibilidade Expo verificada em modo offline: dependências consideradas alinhadas pelo comando disponível, com aviso de validação limitada sem rede. Não equivale a um Expo Doctor online completo.
- **Build nativo Debug aprovado** na cópia, Xcode 27.1, destino iPhone 16/iOS 27.0, assinatura desativada para o simulador e deployment target 15.1 por argumento. Mesmo binário executado no SE.
- **Exportação iOS/Hermes aprovada** com valores fictícios e dotenv desativado. Exportação não foi usada como substituta da execução nativa.
- Pods da cópia inicialmente continham somente cabeçalhos do React precompilado. Artefato oficial exato 0.83.6 foi restaurado exclusivamente na cópia; Pods e configuração nativa original preservados. Procedimento e limites em `scripts/homologacao/README.md`.
- ViaCEP respondeu ao CEP público de referência 01001-000 e rejeitou 00000-000. Foi uma consulta real somente de leitura, sem endereço pessoal.
- API fictícia portátil também foi conferida em porta separada: catálogo e imagens locais responderam. Ela não prova o contrato completo ou segurança do Supabase.
- Houve uma queda `EXC_BAD_ACCESS` durante recarga/abertura do cliente de desenvolvimento por link. A causa definitiva não foi estabelecida. Abertura direta pelo ícone e jornadas posteriores funcionaram. Não ocultar esse limite nem atribuí-lo sem prova ao código de negócio.

As jornadas de interface foram operadas no simulador via Device Hub; não são testes de navegador web nem testes unitários apresentados como iOS. O simulador menor foi usado para conferir busca, Vitrine, edição, validação de CEP, câmera indisponível e conversa; não repetiu integralmente todos os testes do iPhone 16.

## Evidências disponíveis

Diretório local deste chat: `output/homologacao-20261025/`.

| Arquivo | Evidência real |
| --- | --- |
| `reuse-mobile-ios-galeria.png` | Detalhe do anúncio e segunda foto selecionada no iPhone 16 |
| `reuse-mobile-ios-publicacao.png` | Confirmação de publicação após remover o erro posterior ao salvamento |
| `reuse-mobile-ios-vitrine-edicao.png` | Título revisado na listagem; captura intermediária ainda anterior à retirada da avaliação padrão |
| `reuse-mobile-ios-indisponibilidade.png` | Falha deliberada sem falsa contagem zero |
| `reuse-mobile-ios-perfil-final.png`, `reuse-mobile-ios-notificacoes-final.png` | Perfil persistido após recarga e aviso de serviço desconectado |
| `reuse-mobile-ios-chat-final.png` | Mensagem enviada, composição visível acima da TabBar, iPhone 16 |
| `reuse-mobile-ios-se-chat.png` | Composição e envio em 375×667 pontos |
| `reuse-mobile-ios-se-home.png` | Home no simulador menor |
| `reuse-mobile-ios-se-busca-final.png` | Resultado real, condição legível e título fora da barra de status |
| `reuse-mobile-ios-seletor-fotos.png` | Seletor do iOS aberto; não comprova escolha ou upload |
| `reuse-mobile-ios-camera-indisponivel.png` | Erro de câmera tratado no simulador; não comprova fotografia |
| `reuse-mobile-ios-cep-invalido.png` | Bloqueio de gravação após CEP inválido |
| `reuse-mobile-testes.txt`, `reuse-mobile-tipos.txt` | Saída dos testes e da verificação de tipos |
| `reuse-mobile-dados-ficticios.json`, `reuse-mobile-requisicoes-locais.txt` | Registros e rotas de teste, sem credenciais; comprovam operações na API fictícia |

As imagens não foram retocadas. O botão cinza de ferramentas pertence ao cliente de desenvolvimento Expo, não à interface de produto. Capturas iniciais/intermediárias não devem substituir as finais ao mostrar um defeito corrigido.

## Inventário para a participação no pitch

| Funcionalidade demonstrável | Tela/percurso | Importância | Evidência | Limitação a esclarecer |
| --- | --- | --- | --- | --- |
| Descoberta e busca | Home → busca/categoria → anúncio | Encontrar objetos para reutilização | Busca final SE, testes de catálogo e navegação iOS | Catálogo de teste; até seis cartões na Home; promoções editoriais seguem ilustrativas |
| Condição e imagens | Anúncio → segunda miniatura | Avaliar estado e aparência antes de combinar reutilização | Galeria iPhone 16 | Fotos disponibilizadas pela API fictícia; não comprova captura/upload |
| Oferta de item | Publicar → título/categoria/condição/tipo/descrição/CEP → confirmação → Vitrine | Disponibilizar um objeto com dados compreensíveis | Confirmação, JSON e Vitrine | Cadastro sem novas fotos nesta homologação; nenhuma publicação em serviço real |
| Continuidade | Preencher → recarregar → retomar; Perfil → editar → voltar | Evitar perda de preenchimento e manter identificação | Observações e perfil persistido em nova sessão | Rascunho textual; fotos não são restauradas; autenticação desviada na demonstração |
| Gerenciar anúncio | Vitrine → item → editar → salvar → Vitrine | Corrigir informações e manter anúncio consistente | Vitrine com título revisado e registros PATCH | Verificação de proprietário cliente; segurança real pendente |
| Conversa | Chats → contato → mensagem → voltar à lista | Ilustrar negociação entre pessoas | Chat final em duas alturas; resumo atualizado | Somente demonstração, temporária, sem envio a outras pessoas |
| Jornada sustentável | Publicar → marcos por quantidade | Representar motivação de participação | Marco de três itens observado após cadastros | Benefícios, ranking, pontos e todas as conquistas do plano não são operações comerciais |

Não demonstrar favoritos como existentes, notificações como entregues, recompensas como concedidas ou dados sincronizados com Web.

## Pendências priorizadas e prontidão

- **P0:** nenhum bloqueante conhecido permaneceu nos percursos locais aprovados. Isso não transforma os recursos não verificáveis em aprovados.
- **P1 antes de alegar captura/upload:** concluir seleção de foto e publicação com imagem em uma ferramenta nativa que consiga operar o seletor, e conferir câmera em ambiente com câmera disponível. A indisponibilidade do simulador e os controles não expostos impedem essa prova nesta execução.
- **P1 antes de alegar serviço real:** validar Firebase, sessão/recuperação/login social, Supabase/Storage e políticas reais somente em ambiente apropriado e autorizado. Nenhuma escrita remota foi efetuada para contornar esse impedimento.
- **P1 se notificações reais fizerem parte da apresentação:** resolver/validar o vínculo entre identidade Firebase e o serviço de notificações Supabase. O MVP local sinaliza a desconexão; não foi imposta uma nova arquitetura.
- **P1 para distribuição/reprodução nativa fora do ambiente preparado:** revisar Pods/prebuild e assinatura em uma cópia própria. O build Debug isolado não constitui distribuição iOS pronta.
- **P2:** leitor de tela, tamanhos dinâmicos de fonte, iPad e Android/dispositivo físico não exercitados; queda pontual do cliente de desenvolvimento ao recarregar por link permanece registrada, sem causa definitiva.

Nenhum novo favorito, pagamento, ranking comercial, sincronização Mobile/Web ou serviço pago foi introduzido.

## Commits locais desta homologação

- `e4f7fa1` — corrige compatibilidade iOS e falhas de publicação e edição.
- `0d66dcf` — conecta busca e conversas e corrige acessibilidade mobile.
- `ec7ce4f` — ajusta rolagem da busca à área segura do iPhone.
- O relatório, README e ferramentas locais são registrados no commit de documentação seguinte; consultar `git log` para seu identificador.

Todos permanecem exclusivamente locais. A versão atual contém correções posteriores à entrega acadêmica anterior; não se afirma que já estavam presentes na entrega histórica.
