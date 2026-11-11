# Work 1.3 — identidade e perfil compartilhados

Implementação local na branch `work/1-3-contas-perfis`. Sem push, PR, deploy ou distribuição. A validação nativa em aparelho ainda é necessária; bundles e prévia React Native Web não a substituem.

## Ambiente e preparação

O único destino autorizado é o projeto Supabase `reuse-lab`, ref `mqvlgrxwuirgjutqltpv`, organização `guicunhasou`, North Virginia (`us-east-1`). Criado em Free, Nano, com limite de gastos ativo e sem complementos pagos. Os projetos antigos permanecem fora deste fluxo. A renomeação foi feita pelo usuário; ele optou por manter a região atual. As condições do plano devem ser conferidas novamente antes de qualquer futura alteração de infraestrutura.

1. Execute `npm ci --ignore-scripts` e `npm run generate:web` na raiz. Nenhum dos comandos migra o banco.
2. Preencha os `.env.local` a partir de cada `.env.example`, com os valores privados do projeto novo. Não reutilize ambientes históricos.
3. Web: URL e chave pública de Auth, URL SQL do papel limitado `reuse_lab_runtime`, segredo exclusivo para rate limit. Não há chave privilegiada de Auth no runtime Web.
4. Mobile: URL e chave pública de Auth e endereço da API Next. Nunca inclua senha SQL, chave secreta ou service-role em `EXPO_PUBLIC_*`.
5. Execute `npm run dev:web` e `npm run dev:mobile`. O backend local usa porta 4330. Em aparelho, `127.0.0.1` identifica o próprio aparelho: a verificação nativa exige endereço LAN do computador e configuração de rede local apropriada. HTTP é permitido pelo cliente somente em desenvolvimento; distribuição futura exige HTTPS.

Somente duas contas fictícias foram provisionadas por administração, confirmadas sem convite ou mensagem de e-mail. Credenciais são locais, externas ao Git. Cadastro público, acesso anônimo, vinculação manual e provedores sociais estão desativados. Não há recuperação real por e-mail nesta etapa.

## Identidade, sessão e autorização

- Supabase Auth é o único emissor aceito para as contas novas. Login legado Web e Firebase não participam do caminho ativo. Rotas antigas de cadastro/recuperação e OAuth não criam sessões ou usuários.
- A Web usa cookies de acesso/renovação HttpOnly, SameSite Lax e Secure em produção. `src/proxy.js` renova o token antes da renderização quando ausente/próximo da expiração. O conteúdo da sessão não é repassado ao React cliente.
- O Mobile usa SecureStore nativo com fragmentos pequenos e manifesto gravado por último. Não salva tokens no AsyncStorage. A prévia Web usa apenas memória e perde a sessão ao recarregar; isso não representa persistência nativa.
- O SDK renova em primeiro plano; ao retornar do segundo plano reinicia a renovação. A API tenta uma renovação/repetição após 401 e encerra a sessão local se a autorização continuar inválida. Falhas 503 não são confundidas com logout.
- JWT de acesso: uma hora conforme configuração efetiva do projeto. O domínio limita cada sessão a sete dias a partir de seu primeiro uso no backend, mesmo com refresh. Depois disso é preciso entrar novamente.
- O servidor valida assinatura JWKS (ES256/RS256), emissor, audiência, expiração, papel e UUIDs; confirma também o usuário no provedor. E-mail/UID fornecidos pelo cliente e o bypass demonstrativo não autorizam nenhuma operação.
- Logout revoga a sessão no domínio e tenta revogá-la no provedor. Reutilizar um JWT de uma sessão revogada não reativa o acesso. Outras sessões/dispositivos permanecem ativos. No Mobile, a sessão local é removida mesmo se a rede falhar; sem rede, revogação remota não pode ser garantida até expiração/retorno do serviço.

## Domínio e banco

`User.authSubject` é UUID único ligado ao subject verificado do Supabase. O provisionamento por upsert é idempotente, não procura/vincula usuários por um e-mail enviado pelo cliente e não sobrescreve o perfil já editado. `DomainAuthSession` registra sessão, proprietário, criação e revogação. Os campos existentes de usuário são preservados; `passwordHash` não autentica contas novas.

Migrations novas: `20261103000100_shared_auth_profile` e `20261103000200_backend_only_access`. As sete migrations anteriores criam o schema reaproveitado vazio. Não houve importação nem seed histórico.

O runtime utiliza papel SQL com CRUD nas tabelas de domínio, sem superusuário, bypass de RLS, DDL ou acesso a `auth.users`. As tabelas de domínio têm RLS com política somente para esse backend; usuários `anon`/`authenticated` não têm acesso direto. A autorização por proprietário é feita no domínio Next. A Data API foi desativada na criação. Nenhum bucket/upload foi configurado.

Para instalações futuras, o operador usa uma conexão administrativa privada, de sessão, ao projeto novo e executa explicitamente `npm run db:migrate --workspace=@reuse/web`. O script valida host, ref, banco, usuário e porta antes de iniciar `prisma migrate deploy`. Depois configura privadamente a senha/login do papel de runtime. Não use a URL administrativa no aplicativo. Não execute `db:seed` ou `migrate dev` por conta própria nesta base.

## Contrato `/api/v1`

| Método e caminho | Entrada | Resultado |
| --- | --- | --- |
| GET `/api/v1/me` | Bearer; nenhum identificador/parâmetro | `{ data: profile }` do próprio usuário |
| PATCH `/api/v1/me` | Bearer; JSON com `name` e/ou `bio` | Perfil atualizado |
| POST `/api/v1/session/logout` | Bearer | `{ data: { signedOut: true } }` |

Perfil: `id`, `name`, `email`, `location`, `bio`, `avatarUrl`, `rating`, `createdAt`, `updatedAt`. IDs de domínio são strings CUID existentes; datas são ISO UTC. Sem subject de Auth, senha, hash, token ou campos internos. Erros: `{ error: { code, message } }`; 400 para entradas inválidas, 401 para sessão inválida/encerrada, 413 para corpo excessivo, 415 para formato e 503 para indisponibilidade. Respostas de perfil não são armazenadas em cache público.

Nome obrigatório, até 100 caracteres; biografia até 1000, vazia vira `null`. Outros campos são recusados. A Web chama as mesmas funções de domínio por Server Actions. Atualização cruzada aparece ao reabrir/focar o perfil Mobile ou atualizar/navegar na Web; não há sincronização realtime.

## Limites da entrega

Avatar e localização ficam preservados; somente nome e biografia são editáveis. E-mail é somente leitura. As representações padrão de avatar continuam diferentes entre as plataformas. Perfis públicos existentes da Web continuam exibindo somente seus campos públicos; o endpoint privado não oferece consulta a terceiros.

O catálogo Mobile histórico ainda depende de acesso direto a tabelas e fica indisponível no projeto novo protegido. Não foi conectado aos dados antigos nem convertido para API nesta etapa. Contadores não comprovam integração de anúncios, avaliações ou trocas. Chat/notificações, imagens, Resend, IBM, login social, design e publicação permanecem fora do escopo.

## Verificação reproduzível

`npm run check`, `npm run build:web` e `npm run build:mobile` verificam as respectivas camadas. Para o teste de integração real, inicie a Web local e defina `REUSE_TEST_CREDENTIALS_FILE` como caminho de um JSON privado contendo `auth_url`, `publishable_key`, `account_a_email`, `account_a_password`, `account_b_email`, `account_b_password`, `account_a_id` e `account_b_id`; execute `npm run test:integration`. O script recusa outra API que não o loopback de teste, altera exclusivamente perfis fictícios e não imprime credenciais.

Separar sempre testes de unidade, HTTP real, interface Web/React Native Web, export Hermes e execução nativa. Reiniciar um adaptador em teste não comprova reiniciar o aplicativo num aparelho.

## Resultados desta execução (03/11/2026)

| Camada | Evidência |
| --- | --- |
| Instalação | `npm ci --ignore-scripts` reproduzido; conjuntos de versões anteriores preservados |
| Testes Web | 58 passaram (48 existentes + 10 de identidade/perfil/sessão) |
| Testes Mobile | 20 passaram (14 existentes + 6 de armazenamento/contrato/renovação/logout) |
| Verificações estáticas | ESLint Web e TypeScript Mobile passaram |
| Web | Build Webpack passou; fontes locais de teste usadas na compilação offline; sem migration durante build |
| Expo | Export Hermes iOS + Android passou; não produz binário assinado/instalável |
| HTTP real | 10 grupos de verificações de perfil/isolamento e 4 de expiração/renovação/logout Web passaram |
| Interfaces | Conta A em Web + prévia React Native Web; edição refletida nos dois sentidos após recarregar/refocar. Conta B entrou nas duas e exibiu seu perfil distinto. Logout verificado |
| Persistência nativa | Adaptador SecureStore reaberto em teste, inclusive sessão longa/Unicode; reinício real de app em aparelho ainda não comprovado |
| Preservação | Fontes originais, arquivos Git, branches, refs e os três stashes correspondem aos manifestos anteriores |

A validação da API executa o cliente Mobile transpilado contra Auth, Next e PostgreSQL reais de teste. A prévia das telas usou um servidor temporário exclusivamente de loopback, externo ao Git, para servir o export React Native Web e encaminhar `/api/v1` ao Next. Não houve deploy nem configuração CORS permanente. O ambiente Mobile foi restaurado para a API 4330 após o export da prévia.

A primeira verificação por HTTP revelou que o proxy de renovação precisava acompanhar a pasta `src/app`: foi movido para `src/proxy.js`, incluído no build e comprovado com JWT de provedor realmente expirado. A prévia Mobile também permitiu corrigir a verificação de perfil concorrente com a navegação no login; o perfil é consultado por sua tela autenticada e cada operação continua autorizada pelo servidor.

Não se declara a integração integralmente homologada em ambiente nativo. A próxima verificação é instalar/executar em aparelho ou simulador e comprovar reinício, segundo plano, renovação e logout com o armazenamento real. Nenhuma etapa seguinte foi iniciada.
