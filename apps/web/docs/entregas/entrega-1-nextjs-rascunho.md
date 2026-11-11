# Entrega 1 — Área desenvolvida em Next.js

> Rascunho de conteúdo. Não converter em PDF final enquanto houver placeholders pendentes.

## Capa

**Projeto:** ReUse
**Entrega:** Desenvolvimento de uma área da plataforma com Next.js
**Área proposta:** Minha Vitrine — perfil, publicação e gestão de ofertas
**Instituição:** FIAP
**Turma:** [INSERIR TURMA]
**Integrantes:** [CONFIRMAR INTEGRANTES EM ORDEM ALFABÉTICA]
**Data:** [INSERIR DATA DA ENTREGA]

## 1. Apresentação do ReUse

O ReUse é uma plataforma de economia circular criada para facilitar a venda, a troca e a doação de itens. A aplicação busca prolongar a vida útil de produtos e aproximar pessoas interessadas em reutilização e consumo consciente.

## 2. Área selecionada

A área recomendada para esta entrega é **Minha Vitrine**, formada pelo perfil autenticado, pela publicação de novos itens e pela gestão visual das ofertas do próprio usuário.

[CONFIRMAR ÁREA ESCOLHIDA ANTES DE FINALIZAR O TEXTO]

### Objetivo da área

Permitir que uma pessoa autenticada consulte suas ofertas e publique itens para venda, troca ou doação em um fluxo único e coerente com a proposta do ReUse.

## 3. Funcionalidades implementadas

- exibição das informações do perfil autenticado;
- visualização dos itens pertencentes ao usuário;
- filtros por modalidade: todos, doações, trocas e vendas;
- formulário de publicação de item;
- inclusão de até cinco fotografias;
- seleção de categoria, condição e modalidade de negociação;
- preço obrigatório somente para itens de venda;
- descrição com tamanho mínimo e limites máximos de campos;
- validação de quantidade, formato, tamanho e assinatura dos arquivos enviados;
- persistência de itens e imagens com Prisma e PostgreSQL;
- mensagens de sucesso e erro;
- integração da área com a vitrine pública, perfil público e assistente.

## 4. Tecnologias utilizadas

- Next.js 16.3.6 com App Router;
- React 19.2.8;
- Prisma 6.19.3;
- PostgreSQL;
- Tailwind CSS 4;
- `next/image` para apresentação otimizada das imagens;
- ações de servidor e rotas da aplicação para operações autenticadas.

## 5. Organização da implementação

### Interface

- `src/app/perfil/page.js`: carregamento da área autenticada;
- `src/app/perfil/PerfilClient.js`: interface do perfil, filtros e publicação;
- `src/components/ProfileHeader.js`: cabeçalho do perfil;
- `src/components/ProfileItemCard.js`: apresentação dos itens;
- `src/components/PhotoButton.js`: seleção de imagens;
- `src/components/ConditionButton.js`: escolha de condição.

### Regras e persistência

- `src/app/perfil/actions.js`: validação e publicação dos itens;
- `src/lib/uploads.js`: validação e armazenamento das imagens;
- `prisma/schema.prisma`: modelos persistidos no PostgreSQL;
- `prisma/migrations/`: evolução versionada do banco.

## 6. Fluxo principal

1. A pessoa entra em sua conta.
2. Acessa “Minha Vitrine”.
3. Consulta e filtra os próprios itens.
4. Seleciona “Publicar Novo Item”.
5. Adiciona fotos e informa os dados do item.
6. Escolhe venda, troca ou doação.
7. Confirma a publicação.
8. O item persistido passa a integrar a vitrine do usuário.

## 7. Usabilidade e acessibilidade

A área utiliza rótulos associados aos campos, validações antes da persistência, mensagens de erro anunciadas a tecnologias assistivas, feedback de sucesso e foco visível na navegação por teclado. A identidade visual existente foi mantida, com ajuste pontual de contraste em textos secundários.

## 8. Evidências a inserir

- [INSERIR PRINT DA ÁREA “MINHA VITRINE”]
- [INSERIR PRINT DO FORMULÁRIO DE PUBLICAÇÃO]
- [INSERIR PRINT DAS VALIDAÇÕES]
- [INSERIR PRINT DO ITEM PUBLICADO]
- [INSERIR PRINT DA APLICAÇÃO HOSPEDADA]
- [INSERIR URL DO DEPLOY]
- [CONFIRMAR URL DO REPOSITÓRIO PÚBLICO APÓS O MERGE]

## 9. Hospedagem

A hospedagem ainda não foi comprovada. Esta seção deve ser preenchida somente depois da publicação e da validação do endereço público.

**URL:** [INSERIR URL DO DEPLOY]
**Data da validação:** [INSERIR DATA]
**Fluxos validados no endereço público:** [LISTAR SOMENTE FLUXOS REALMENTE TESTADOS]

## 10. Verificações técnicas existentes

No estado atual do código:

- lint concluído sem erros;
- 22 testes automatizados aprovados;
- build de produção concluído;
- rotas autenticadas protegidas contra acesso sem sessão.

Essas verificações são locais e não substituem a validação da futura hospedagem.

## 11. Conclusão-base

A área Minha Vitrine demonstra a evolução do ReUse para uma aplicação web com interface, regras de negócio e persistência integradas. O fluxo reúne consulta das ofertas e publicação de novos itens, mantendo o objetivo de incentivar venda, troca e doação.

[REVISAR A CONCLUSÃO APÓS A VALIDAÇÃO DO DEPLOY]

## Checklist antes do PDF final

- [ ] confirmar área escolhida;
- [ ] confirmar integrantes e ordem alfabética;
- [ ] atualizar URL do repositório após o merge;
- [ ] inserir URL do deploy;
- [ ] validar os fluxos no ambiente hospedado;
- [ ] inserir capturas legíveis;
- [ ] remover todos os placeholders;
- [ ] conferir se nenhuma integração foi declarada sem evidência.
