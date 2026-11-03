# Entrega 2 — Assistente virtual com IBM Watson

> Rascunho de conteúdo. A integração real com IBM Watson ainda não foi comprovada. Não converter em PDF final enquanto houver placeholders pendentes.

## Capa

**Projeto:** ReUse
**Entrega:** Assistente virtual e automação de tarefas
**Instituição:** FIAP
**Turma:** [INSERIR TURMA]
**Integrantes:** [CONFIRMAR INTEGRANTES EM ORDEM ALFABÉTICA]
**Data:** [INSERIR DATA DA ENTREGA]

## 1. Objetivo

O assistente do ReUse foi projetado para orientar dúvidas recorrentes e permitir ações relacionadas à vitrine do usuário. As tarefas que alteram dados exigem autenticação e confirmação explícita antes da execução.

## 2. Estado comprovado atualmente

O código da integração com IBM Watson Assistant está implementado, mas nenhuma credencial IBM foi configurada e nenhuma resposta real com origem `watson` foi registrada.

O modo disponível e validado até o momento é um classificador local de demonstração. Ele permite testar a interface e as regras de negócio, mas não deve ser apresentado como evidência de integração externa com a IBM.

## 3. Orientações implementadas

### Como publicar um item

O assistente orienta o usuário a acessar a publicação, adicionar até cinco fotos, preencher título, categoria, condição, modalidade e descrição e, por fim, confirmar a publicação.

**Exemplo de solicitação:** “Como publicar um item?”

[INSERIR EVIDÊNCIA DE ORIENTAÇÃO RESPONDIDA PELO WATSON]

## 4. Tarefas automatizadas

### Resumir a vitrine

Consulta a quantidade de ofertas ativas, pausadas, reservadas e concluídas do usuário autenticado.

### Pausar ofertas ativas

Solicita confirmação antes de alterar ofertas com status ativo para inativo.

### Retomar ofertas pausadas

Solicita confirmação antes de alterar ofertas com status inativo para ativo.

As alterações são limitadas aos itens cujo `sellerId` corresponde ao usuário da sessão.

## 5. Fluxo técnico

```text
Interface do assistente
        ↓
POST /api/assistente
        ↓
Autenticação e limite de uso
        ↓
IBM Watson, quando configurado
ou classificador local de demonstração
        ↓
Lista de intenções permitidas pelo servidor
        ↓
Orientação, consulta ou pedido de confirmação
        ↓
Execução limitada aos dados do usuário autenticado
```

## 6. Segurança das ações

- o assistente está disponível somente no perfil autenticado;
- mensagens vazias ou acima do limite são rejeitadas;
- existe limitação persistida de solicitações;
- somente intenções previstas pelo servidor podem executar funções;
- pausar e retomar exigem token assinado;
- a confirmação expira em cinco minutos e só pode ser usada uma vez;
- o token é vinculado ao usuário e à intenção;
- as alterações filtram os itens pelo proprietário da sessão;
- uma falha no Watson retorna indisponibilidade e não executa mutação silenciosa.

## 7. Comunicação do modo ativo

A interface não anuncia mais o Watson como disponível antes de comprovar a origem da resposta.

- antes da primeira resposta: “Origem ainda não verificada”;
- fallback local: “Demonstração local”;
- resposta real identificada pela API: “Watson conectado”.

## 8. Evidências de código existentes

- `src/components/ReuseAssistant.js`: interface e comunicação do modo ativo;
- `src/app/api/assistente/route.js`: autenticação, classificação e execução;
- `src/lib/watson.js`: comunicação preparada para a API v2;
- `src/lib/assistant-intents.mjs`: intenções permitidas e fallback local;
- `src/lib/assistant-confirmation-store.mjs`: confirmação persistida e de uso único;
- `test/assistant-intents.test.mjs`: classificação e mapeamento das intenções;
- `test/assistant-confirmation.test.mjs`: validações do token de confirmação.

## 9. Evidências externas ainda necessárias

- [INSERIR PRINT DA CONFIGURAÇÃO DAS INTENÇÕES/AÇÕES NO IBM WATSON]
- [INSERIR EVIDÊNCIA DE RESPOSTA REAL DO WATSON]
- [INSERIR RESPOSTA DA API COM `origin: "watson"`]
- [INSERIR EVIDÊNCIA DA AÇÃO EXECUTADA]
- [INSERIR ESTADO DA VITRINE ANTES DA AÇÃO]
- [INSERIR PEDIDO E CONFIRMAÇÃO DA AÇÃO]
- [INSERIR ESTADO DA VITRINE DEPOIS DA AÇÃO]
- [INSERIR EVIDÊNCIA DE ACESSO SEM LOGIN RETORNANDO HTTP 401]
- [INSERIR URL DO DEPLOY]
- [CONFIRMAR URL DO REPOSITÓRIO PÚBLICO APÓS O MERGE]

## 10. Roteiro sugerido de demonstração futura

1. Entrar com um usuário que possua ao menos uma oferta ativa.
2. Mostrar o status “Watson conectado” após uma resposta real.
3. Pedir uma orientação de publicação.
4. Solicitar o resumo da vitrine.
5. Solicitar a pausa das ofertas.
6. Mostrar que nenhuma alteração acontece antes da confirmação.
7. Confirmar a ação.
8. Atualizar a vitrine e comprovar a mudança.
9. Repetir o token para comprovar que ele não pode ser reutilizado.

Esse roteiro somente poderá ser marcado como executado depois da configuração real do serviço.

## 11. Conclusão-base

O ReUse possui uma interface de assistente integrada às regras da plataforma, com orientação, consultas e tarefas protegidas por confirmação. A comprovação do requisito IBM Watson continua pendente e deverá ser acrescentada somente após uma resposta real e uma ação integrada serem registradas.

[REVISAR A CONCLUSÃO APÓS A VALIDAÇÃO REAL DO WATSON]

## Checklist antes do PDF final

- [ ] configurar o IBM Watson sem expor credenciais;
- [ ] registrar resposta real com origem `watson`;
- [ ] comprovar uma orientação;
- [ ] comprovar uma tarefa com antes e depois;
- [ ] validar o fluxo no ambiente hospedado;
- [ ] confirmar integrantes e ordem alfabética;
- [ ] inserir URLs finais;
- [ ] remover todos os placeholders;
- [ ] não apresentar o fallback local como integração IBM.
