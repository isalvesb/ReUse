# Recomendação de área para a Entrega 1

Esta análise compara áreas já implementadas no ReUse Web. A recomendação é técnica e acadêmica, mas a escolha final continua pendente de confirmação do grupo.

## Critérios usados

- aderência ao pedido de desenvolver uma área da plataforma em Next.js;
- quantidade de funcionalidades demonstráveis sem depender de serviços externos;
- evidências presentes no código;
- clareza para explicar no PDF;
- simplicidade de demonstração;
- riscos de configuração ou de falha durante a apresentação.

## Opção 1 — Vitrine pública

### Funcionalidades demonstráveis

- listagem de itens persistidos no PostgreSQL;
- busca por texto;
- filtros por categoria, condição e modalidade;
- navegação para detalhes do produto e perfil público do anunciante;
- estados de lista vazia e parâmetros de consulta na URL.

### Avaliação

- Aderência: alta. É uma área web clara e diretamente relacionada ao propósito do ReUse.
- Evidências: páginas, consultas Prisma, cartões, filtros e detalhes estão implementados.
- PDF: muito fácil de explicar com uma sequência curta de capturas.
- Demonstração: simples para visitantes sem login, desde que o banco hospedado tenha dados.
- Riscos: pode parecer menos abrangente tecnicamente; depende de banco acessível e dados demonstrativos.

## Opção 2 — Minha Vitrine: perfil, publicação e gestão de ofertas

### Funcionalidades demonstráveis

- perfil autenticado e informações do usuário;
- listagem e filtragem dos próprios itens;
- formulário de publicação;
- até cinco fotos por item;
- validações de campos, tipo, quantidade, tamanho e assinatura dos arquivos;
- modalidades de venda, troca e doação;
- persistência com Prisma/PostgreSQL;
- retorno visual de sucesso ou erro;
- assistente integrado à mesma área, apresentado separadamente na Entrega 2.

### Avaliação

- Aderência: muito alta. Forma uma área coesa da plataforma, com interface, regra de negócio e persistência.
- Evidências: código de tela, ações de servidor, validações, modelos e testes auxiliares existentes.
- PDF: permite explicar objetivo, fluxo, estrutura e resultado sem apresentar toda a plataforma.
- Demonstração: boa sequência narrativa — entrar, abrir o perfil, publicar e conferir o item na própria vitrine.
- Riscos: exige autenticação e banco configurados; upload em produção depende do armazenamento já previsto; o assistente não deve ser apresentado como Watson real antes da evidência externa.

## Opção 3 — Conversas e negociação

### Funcionalidades demonstráveis

- criação ou recuperação de conversa vinculada a um item;
- participantes comprador e vendedor;
- mensagens persistidas;
- controle de acesso aos participantes;
- notificações associadas ao fluxo.

### Avaliação

- Aderência: alta e tecnicamente interessante.
- Evidências: modelos, páginas, ações e autorização estão implementados.
- PDF: exige mais contexto para explicar corretamente usuários, item e conversa.
- Demonstração: requer duas contas ou preparação prévia dos dados.
- Riscos: maior chance de dificuldade durante uma apresentação curta e menor relação direta com o enunciado atual do que o fluxo de publicação.

## Recomendação

A opção mais forte é **Minha Vitrine: perfil, publicação e gestão de ofertas**.

Ela apresenta uma área delimitada, visualmente demonstrável e com profundidade suficiente para evidenciar Next.js, componentes, ações no servidor, Prisma, banco, validações e experiência do usuário. Também conecta naturalmente a evolução histórica do ReUse, que começou no mobile com publicação de itens e passou a uma implementação web persistente.

Para evitar um escopo amplo demais, o PDF deve tratar “Minha Vitrine” como a área escolhida. Vitrine pública, chat, autenticação e assistente podem aparecer apenas como integrações relacionadas, não como quatro áreas adicionais.

## Decisão pendente

[CONFIRMAR SE “MINHA VITRINE: PERFIL, PUBLICAÇÃO E GESTÃO DE OFERTAS” SERÁ A ÁREA DEFINITIVA]
