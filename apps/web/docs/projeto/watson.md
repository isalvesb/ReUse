# IBM Watson Assistant

## Escopo

O assistente está disponível somente no perfil autenticado. A rota `/api/assistente` obtém o usuário pela sessão e limita consultas e alterações aos itens cujo `sellerId` pertence a esse usuário.

As credenciais IBM ficam apenas no servidor. A interface nunca recebe a chave do serviço.

## Variáveis

```dotenv
IBM_WATSON_API_KEY=""
IBM_WATSON_ASSISTANT_ID=""
IBM_WATSON_SERVICE_URL=""
IBM_WATSON_API_VERSION="2024-08-25"
```

Quando as três primeiras variáveis estão preenchidas, cada mensagem abre uma sessão na API v2, envia o texto e encerra a sessão. Se elas estiverem vazias, o classificador local mantém o fluxo demonstrável.

## Intenções aceitas

Configure no Watson um dos nomes abaixo como intenção principal. A API também aceita `output.user_defined.reuse_intent` com o mesmo valor.

| Objetivo | Nomes reconhecidos | Exemplo |
| --- | --- | --- |
| Pausar | `pausar`, `pausar_ofertas`, `pausar_anuncios` | “Pause minhas ofertas ativas” |
| Retomar | `retomar`, `retomar_ofertas`, `reativar_anuncios` | “Reative meus anúncios” |
| Resumir | `resumir`, `resumir_vitrine`, `consultar_vitrine` | “Resuma minha vitrine” |
| Orientar | `orientar_publicacao`, `publicar_item`, `como_publicar` | “Como publicar um item?” |

Qualquer intenção diferente permanece sem ação. O texto do Watson pode ser exibido, mas somente a lista permitida no servidor pode consultar ou alterar dados.

## Confirmação e segurança

- Pausar e retomar retornam primeiro `requiresConfirmation: true` e um token assinado, válido por cinco minutos e consumível uma única vez.
- A alteração ocorre apenas quando a segunda solicitação apresenta esse token, vinculado ao usuário e à intenção autorizada.
- A confirmação não repete a chamada ao Watson e não confia em um booleano enviado pelo navegador.
- `updateMany` sempre inclui o `sellerId` da sessão.
- Pausar altera somente `ATIVO` para `INATIVO`.
- Retomar altera somente `INATIVO` para `ATIVO`.
- Mensagens vazias ou maiores que 500 caracteres são rejeitadas.
- Usuários sem sessão recebem HTTP 401.

## Evidência da entrega

Para a apresentação, registrar separadamente:

1. configuração das intenções no painel IBM;
2. conversa em que a resposta vem com `origin: "watson"`;
3. pedido de confirmação antes de uma alteração;
4. vitrine antes e depois da ação confirmada;
5. tentativa sem login retornando HTTP 401.

O modo local, sozinho, valida a experiência e a regra de negócio, mas não comprova uma chamada real ao IBM Watson.

## Estado da validação local

O classificador local foi testado pelo perfil autenticado com a pergunta “Como publicar um item?” e respondeu com a orientação esperada. Nenhuma credencial IBM foi configurada e nenhuma resposta com `origin: "watson"` foi registrada.

Portanto, a evidência atual cobre a interface e o fallback local, mas não deve ser apresentada como integração externa real com a IBM.
