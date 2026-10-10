# Assistente ReUse (watsonx Orchestrate)

Passo a passo pra criar o agente que roda o assistente da ReUse, pelo
navegador (console web do watsonx Orchestrate).

Atenção: watsonx Orchestrate não tem plano gratuito permanente, só um
**trial de 30 dias sem cartão de crédito**. Depois disso vira pago. Se der
problema de prazo, dá pra voltar pro Watson Assistant (que tem plano Lite
gratuito de verdade) sem perder o resto da integração — só a parte do
agente em si muda.

O assistente faz duas coisas:

- Executa ação de verdade na plataforma: pausar/reativar ofertas ativas,
  listar os itens publicados pelo usuário e marcar notificações como lidas.
- Responde dúvida comum sobre como usar a plataforma: como cadastrar um
  item (venda/troca/doação) e qual a diferença entre esses três tipos.

## 1. Criar a conta

Criar conta em https://www.ibm.com/products/watsonx-orchestrate e iniciar
o trial de 30 dias.

## 2. Importar a ferramenta (OpenAPI)

O arquivo `reuse-tools-openapi.yaml` já está apontando pro domínio de
produção (`https://re-use-web-bay.vercel.app`). No console do Orchestrate,
procure a opção de adicionar/importar uma ferramenta a partir de um arquivo
OpenAPI e suba esse arquivo. Na configuração de autenticação da ferramenta,
use o tipo API key com o valor que vai em `ORCHESTRATE_TOOLS_SECRET` no
`.env` (local **e** nas variáveis de ambiente do projeto na Vercel) — o
Orchestrate manda essa chave sempre no header `x-api-key` (não dá pra
trocar o nome do header).

## 3. Criar o agente

Criar um novo agente e preencher:

- **Nome:** Assistente ReUse
- **Descrição:** Assistente virtual da ReUse, uma plataforma de troca,
  doação e venda de itens usados. Executa ações reais na plataforma e
  orienta o usuário sobre como usar os recursos da ReUse.
- **Instruções:**

```
Você é o assistente virtual da ReUse. No começo da conversa você recebe o
ID do usuário logado — use esse ID sempre que for chamar uma ferramenta
que precise de "userId", sem nunca perguntar isso ao usuário.

Quando chamar uma ferramenta:
- Pedido para pausar ofertas/anúncios ativos -> pausar_ofertas
- Pedido para reativar ofertas/anúncios pausados -> reativar_ofertas
- Pedido para ver/listar os itens publicados -> listar_ofertas
- Pedido para marcar notificações como lidas/limpar notificações -> marcar_notificacoes_lidas

Depois de chamar a ferramenta, responda usando a mensagem que ela
devolveu, sem inventar informação adicional.

Quando só responder com texto (sem ferramenta):
- "Como cadastro um item para troca/doação/venda?" -> explique o passo a
  passo: ir em Publicar item, escolher o tipo de negociação (venda, troca
  ou doação), preencher título, categoria, condição e uma descrição com
  pelo menos 20 caracteres, informar o preço se for venda, adicionar até
  5 fotos e publicar.
- "Qual a diferença entre venda, troca e doação?" -> venda tem preço
  definido, troca é item por item, doação é sem custo; o contato entre as
  partes acontece pelo chat da plataforma, na página do produto.

Se o usuário perguntar algo fora desses temas, diga que ainda não sabe
responder isso e explique o que você consegue fazer.
```

- **Mensagem de boas-vindas:** Oi! Eu sou o assistente da ReUse. Posso
  pausar/reativar suas ofertas, listar seus itens, marcar notificações
  como lidas, ou explicar como usar a plataforma.
- **Ferramentas:** adicionar as 4 que vieram do `reuse-tools-openapi.yaml`
  (`pausar_ofertas`, `reativar_ofertas`, `listar_ofertas`,
  `marcar_notificacoes_lidas`).

Depois de criar, publicar/deployar o agente — a opção costuma ficar perto
de "Publish" ou "Deploy" na tela do agente.

## 4. Preencher o `.env` da ReUse

```
ORCHESTRATE_APIKEY=a-api-key-da-sua-instancia (Settings > API details)
ORCHESTRATE_CHAT_URL=...
ORCHESTRATE_TOOLS_SECRET=o-mesmo-valor-usado-na-ferramenta-no-passo-2
```

Sobre `ORCHESTRATE_CHAT_URL`: depois de publicar o agente, procure em
Settings > API details (ou na própria tela do agente) por um exemplo de
requisição pra conversar com ele via API — é a URL de lá que entra aqui.
Se só existir a opção de chat web embutido (Channels > Web chat), me avisa
que eu troco o widget customizado pelo embed oficial do Orchestrate.

## Onde está o código

- `src/lib/orchestrate.js` — chamada ao endpoint de chat do agente
  (ajustar conforme o passo 4 acima).
- `src/app/api/orchestrate/message/route.js` — recebe a mensagem do
  widget, pega o usuário logado e manda pro agente.
- `src/app/api/orchestrate/tools/*/route.js` — as 4 ferramentas que o
  Orchestrate chama (uma rota por ação), protegidas pelo header
  `x-api-key` (`ORCHESTRATE_TOOLS_SECRET`).
- `src/lib/orchestrate-actions.js` — lógica de cada ação no banco (Prisma).
- `src/components/AssistantWidget.js` — o chat flutuante, incluído em
  `src/app/layout.js`.
- `watsonx-orchestrate/reuse-tools-openapi.yaml` — spec das ferramentas.
