# Chat e notificações compartilhados — Work 1.7

Web e Mobile utilizam `chat-domain.mjs`, PostgreSQL/Prisma e a identidade Supabase já integrada. O Mobile demonstrativo foi substituído e a antiga consulta direta de notificações/Realtime foi removida da tela. Não há WebSockets, push, e-mail nem serviço novo.

## Contratos autenticados `/api/v1`

| Método e caminho                       | Entrada / resultado                                                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GET `/conversations`                   | `limit` 1–50 (30 padrão), `cursor`; conversas próprias, participante público, anúncio, prévia e não lidas |
| POST `/conversations`                  | `{itemId}`; cria ou recupera por anúncio + interessado                                                    |
| GET `/conversations/:id/messages`      | Mesma paginação; mensagens em ordem cronológica, conversa e próxima página anterior                       |
| POST `/conversations/:id/messages/key` | Chave UUID aleatória no servidor, usada pelo Mobile sem nova dependência nativa                           |
| POST `/conversations/:id/messages`     | `{content,clientKey}`; mensagem confirmada persistida                                                     |
| POST `/conversations/:id/read`         | `{throughMessageId}`; lê notificações recebidas até a mensagem efetivamente consultada                    |
| GET `/notifications`                   | Página própria e contagem total de não lidas                                                              |
| POST `/notifications/:id/read`         | Leitura idempotente somente da própria notificação                                                        |
| POST `/notifications/read`             | Marcar todas as notificações atuais do usuário como lidas                                                 |

Envelope `{data}` ou `{error:{code,message}}`, IDs string, datas ISO UTC e respostas privadas sem cache. 400/413/415 para entrada inválida; 401 sessão ausente/encerrada; 404 uniforme para conversa/notificação inacessível; 409 para reuso conflitante da chave; 429 para limite; 503 sanitizado para indisponibilidade. IDs privados de terceiros, e-mails, tokens e hashes não compõem os DTOs de chat. O identificador público e o nome/avatar do interlocutor são apresentados aos participantes.

## Regras e consistência

- Interessado inicia conversa apenas em anúncio ATIVO de outra conta. O vendedor e o interessado vêm do banco e da sessão. Conversa existente continua acessível aos participantes após pausa, como na Web anterior.
- Cada consulta, envio e leitura verifica participação/destinatário. Não há `senderId`, `buyerId`, `sellerId` ou e-mail aceitos como autorização.
- Texto simples de 1–1000 caracteres após trim, sem controles binários. Campos adicionais são recusados. JSON de escrita limitado a 16 KB.
- Uma transação cria mensagem, notificação genérica e atividade da conversa. A notificação não copia conteúdo privado e identifica inequivocamente conversa/mensagem.
- Chave UUID por tentativa lógica, única por remetente: mesmo conteúdo/conversa retorna a mensagem existente; outro conteúdo/conversa recebe 409. Concorrência recupera o registro vencedor. Clientes mantêm a chave durante retry em memória.
- Limites persistidos: 30 mensagens/minuto e 30 novas conversas/minuto por usuário. API ainda limita leituras a 180/minuto e demais operações a 60/minuto. Retornos 429 exigem aguardar; não há retry automático agressivo.
- Mensagens e notificações usam cursor `(createdAt,id)`, ordem estável e sem offset. Conversas usam `(lastActivityAt,id)`; como a atividade é mutável, a atualização da primeira página recupera conversas recém-movidas. Não é um snapshot imutável.
- Leitura automática apenas na conversa aberta/visível, até o último ID carregado. Abertura de notificação marca somente aquela notificação antes da navegação. Novas mensagens posteriores não são incluídas no marcador anterior.

## Atualização e experiência

Web: conversa atualizada a cada cinco segundos com documento visível; notificações/contador a cada dez segundos e ao retornar foco. Mobile: consultas sequenciais a cada cinco segundos em Chats e dez em notificações/perfil, somente com tela focada e AppState ativo. Um pedido já em andamento pode terminar após a transição; não se iniciam novos polls em segundo plano. A referência é a API oficial [AppState](https://reactnative.dev/docs/appstate).

A comunicação depende da próxima consulta e da rede; não é instantânea. Há carregamento, vazio, erro, retry, histórico anterior, envio pendente e preservação do texto após falha. Sem confirmação o cliente não mostra a mensagem como enviada. Autenticação 401 tenta renovar uma vez; persistindo, encerra a sessão local. Sessão e histórico confirmado sobrevivem ao reinício; texto ainda não enviado não é um rascunho persistido entre processos. Não há recibo de leitura por mensagem para o interlocutor, presença online nem status de entrega externos.

O chat nativo preserva cores, componentes, tab bar, áreas seguras e teclado. A região do compositor fica fora da barra flutuante. Navegação por anúncio e por notificação usa ID da conversa, sem e-mail.

## Banco e operação

Migration aditiva `20261104000100_shared_chat_notifications`: `conversations.lastActivityAt` com preenchimento a partir das mensagens existentes; `messages.clientKey` opcional/índice único por remetente; referências opcionais de conversa/mensagem na notificação e índices de paginação. Notificações históricas ficam sem vínculo inferido: um item pode ter vários interessados. RLS/grants existentes não são ampliados. Nada é aplicado no build.

Somente projeto novo `reuse-lab`; nenhum reset, manutenção de imagens, mudança de Storage, plano ou serviço externo. Duas contas/perfis e anúncios/imagens anteriores preservados. Uma terceira identidade fictícia controlada foi criada exclusivamente para provar o bloqueio de não participante; credenciais ficam fora do Git. Os testes criam apenas mensagens e notificações fictícias, sem apagar registros.

## Verificação reproduzível

`npm run check`, `npm run build:web` (fixture local de fontes quando necessário), `npm run build:mobile` e `node scripts/check-chat.mjs`. O script real exige `REUSE_TEST_CREDENTIALS_FILE` e `REUSE_CHAT_THIRD_ACCOUNT_FILE`, ambos locais fora do repositório; verifica o projeto explicitamente e usa somente a API em 127.0.0.1:4330. Cria a identidade C apenas se seu arquivo ainda não existir e encerra as próprias sessões ao terminar. Não executar os scripts antigos de escrita/upload para esta regressão: eles podem iniciar a manutenção de imagens fora do escopo.

As jornadas efetivamente percorridas, capturas, resultados e limitações ficam no relatório externo da Work 1.7. Build e teste automatizado não substituem execução de interface.
