# Assistente IBM do ReUse Lab

Implementação da Work 1.14. Um agente textual do IBM watsonx Orchestrate atende Web e React Native pelo mesmo backend Next.js. O banco continua restrito ao Supabase novo do laboratório. Não há callback público nem acesso da IBM ao PostgreSQL.

## Funcionamento

Web/iOS → Next autenticado → API IBM → intenção validada → seleção no ReUse → confirmação → transação Prisma.

O agente orienta sobre o produto e devolve JSON com `text` e `intent`: `ORIENTAR`, `PAUSAR`, `RETOMAR` ou `DESCONHECIDO`. As instruções atuais estão em `apps/web/assistant/reuse-lab-agent-instructions.md`. Elas são configuração do serviço; alterar o arquivo local não atualiza automaticamente a IBM.

A IBM recebe somente a pergunta, sem tokens Supabase, credenciais, identificadores de conta, listas privadas de anúncios ou histórico das conversas do produto. No trial, utilizar exclusivamente dados fictícios. A interface avisa sobre essa restrição; e-mails, tokens JWT e marcadores de chave privada evidentes são recusados antes da transmissão. Esse filtro não é um detector completo de dados pessoais.

As perguntas são independentes. O histórico do painel é temporário e local à interface; não representa um histórico de assistente sincronizado entre dispositivos. As alterações persistidas dos anúncios são compartilhadas. Não há classificador local de contingência. Falha IBM, configuração ausente ou resposta inválida produzem indisponibilidade explícita.

## Contratos autenticados

Todos os endpoints são POST, JSON limitado a 16 KB, sob `/api/v1/assistant`:

| Endpoint | Entrada | Resultado |
| --- | --- | --- |
| `/messages` | `message` (1–500 caracteres) | Texto real IBM e, se pertinente, proposta assinada e anúncios próprios elegíveis |
| `/selection` | `proposalToken`, `itemId` | Confirmação assinada contendo anúncio, ação exata e prazo |
| `/confirm` | `confirmationToken`, `decision: confirm/cancel` | Cancelamento ou estado efetivamente persistido |

Web usa os cookies HttpOnly existentes e origem canônica exata (`NEXT_PUBLIC_APP_URL`). Mobile usa Bearer verificado e pode renovar uma sessão antes de repetir a solicitação recusada por 401. Autorização inválida não recorre aos cookies. Nunca enviar `userId`, e-mail, `senderId`, sessão ou intenção como autorização do cliente.

Respostas seguem `{ data }` ou `{ error: { code, message } }`, sem cache. Erros incluem 400/413/415 para entradas inválidas, 401 para sessão inválida, 403 para origem inválida, 404 para anúncio próprio não elegível, 409 para conflito/expiração/repetição, 429 para limite e 503 para indisponibilidade.

Limites persistidos por usuário: dez perguntas/minuto; trinta seleções ou decisões/minuto. A primeira lista apresenta até cem anúncios próprios elegíveis. Esse limite foi suficiente para as contas fictícias atuais; uma evolução com maior volume deverá definir paginação.

## Confirmação e autorização

- A proposta só é emitida após uma resposta válida da API IBM. Ela fica vinculada à conta, à sessão e à intenção permitida.
- A seleção consulta novamente proprietário e estado; um identificador retornado pelo modelo não é utilizado para selecionar o anúncio.
- A confirmação possui audiência específica, assinatura HS256, prazo de cinco minutos, conta, sessão, ID, versão (`updatedAt`) e ação. Tokens legados não são intercambiáveis.
- O backend revalida a sessão e consome o registro `AssistantConfirmation` na mesma transação que atualiza o anúncio. O predicado inclui proprietário, estado de origem e versão. Conflito reverte a transação inteira.
- Cancelar consome a confirmação sem alterar anúncio. Uma confirmação usada ou expirada não executa novamente. Após falha de rede, conferir o estado antes de uma nova operação; sucesso só é mostrado após resposta persistida.
- Somente `ATIVO → INATIVO` e `INATIVO → ATIVO`. Sem lotes, alterações de imagens ou modificações em reservados/concluídos. Não houve migration nova.

O caminho demonstrativo `/api/assistente` responde 410 enquanto `REUSE_IBM_ENABLED=true`. Os widgets e ferramentas históricos permanecem fora do fluxo integrado; manter `NEXT_PUBLIC_DISABLE_IBM_WEBCHAT=true` e `NEXT_PUBLIC_SHOW_LEGACY_ASSISTANTS=false`. Não configurar os antigos segredos de delegação nem destinos acadêmicos para este agente.

## Configuração privada

Somente no servidor, em arquivo ignorado:

- `REUSE_IBM_ENABLED=true`.
- `REUSE_IBM_API_KEY`: credencial da instância própria do laboratório.
- `REUSE_IBM_CHAT_URL`: endpoint completo da instância/agente, terminando em `/v1/orchestrate/<agent-id>/chat/completions`.
- `REUSE_IBM_TRIAL_END_DATE`: data `YYYY-MM-DD` exibida pelo trial.
- `ASSISTANT_CONFIRMATION_SECRET`: chave exclusiva de pelo menos 32 caracteres.
- `RATE_LIMIT_SECRET`: segredo já utilizado pelos limites persistidos.

Não utilizar prefixos `NEXT_PUBLIC`/`EXPO_PUBLIC` para essas credenciais. O Mobile utiliza apenas a URL local da API e a autenticação Supabase já existente. O adaptador troca a chave por token IAM temporário, guarda-o só em memória, impede redirecionamentos e restringe o endpoint ao domínio IBM. Não registra corpo de erro privado, chave ou Bearer.

O recurso aprovado é o **Trial gratuito `reuse-lab`, Sydney**, criado em **04/11/2026**. O painel IBM informou expiração em **04/12/2026**, sem hora/fuso nessa tela. A proteção local interrompe chamadas no início dessa data em UTC, de modo conservador: **03/12/2026 às 21h de Recife**. Esse limite local não é a hora oficial de expiração da IBM.

O modelo fornecido no trial é **GPT-OSS 120B — OpenAI (via Groq)**, autorizado expressamente pelo usuário dentro do serviço IBM e sob os termos adicionais indicados. Não há conta/API direta Groq ou OpenAI, modelos adicionais, RAG, ferramentas, voz, agendamento ou memória do agente. O runtime em rascunho respondeu com sucesso; não foi necessário acionar Deploy no construtor IBM.

A avaliação não autoriza uso público/comercial. Não contratar plano pago, ativar complementos ou usar créditos promocionais como orçamento. A extensão educacional de noventa dias não foi concedida à conta nesta execução.

## Encerramento manual e evidências

O trial deixa de permitir uso ao vencer. A licença informa retenção adicional de trinta dias e exclusão posterior caso não seja contratado um plano pago. Nenhum upgrade ou cancelamento automático foi configurado.

Para encerrar manualmente, na conta IBM própria:

1. Abrir IBM Cloud → Lista de recursos → `reuse-lab` (watsonx Orchestrate, Sydney, Trial).
2. Conferir nome, região e plano. Preservar instruções, respostas sanitizadas, capturas e vídeos antes de encerrar.
3. Abrir **Ações → Excluir serviço**. A existência dessa opção foi verificada; ela **não foi acionada** nesta Work. Ler e concluir as confirmações que a IBM apresentar apenas se o usuário decidir encerrar.
4. Conferir a lista de recursos e faturamento após a operação. Não selecionar Upgrade, Buy Now ou extensões pagas. Desabilitar depois a configuração IBM no backend local e revisar os arquivos privados conforme decisão do usuário.

As evidências independentes do serviço estão fora do Git, em `outputs/reuse-lab-work1-14-20261104/`: respostas HTTP sanitizadas, exportação da configuração sem identidade administrativa, capturas Web, PNGs diretos do simulador, gravações nativas e manifesto de integridade. Elas permanecem utilizáveis no vídeo-pitch após o trial, sem depender de URLs assinadas ou acesso ao console. Não apresentar um build ou simulação de falha como resposta real da IBM.

## Fontes primárias

- [Trial](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=orchestrate-accessing-watsonx-trial-version)
- [Licença IBM Cloud vigente consultada](https://www.ibm.com/support/customer/csol/terms/?ref=i126-9844-08-09-2026-zz-en)
- [Modelos disponíveis](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=model-available-ai-models)
- [Termos adicionais indicados pelo construtor](https://www.ibm.com/support/customer/csol/terms/?ref=i126-9451-17-09-2026-zz-en)
- [Autenticação IBM Cloud da API](https://developer.ibm.com/apis/catalog/watsonorchestrate--custom-assistants/Generating%2Bthe%2BAccess%2BToken%2Bfor%2Bthe%2BIBM%2BCloud%2Boffering)
- [Referência IBM de runtime](https://github.com/IBM/ibm-watsonx-orchestrate-adk/blob/main/skills/wxo-builder/references/runtime-api.md)
