# Diagnóstico dos alertas de dependências

Data da consulta: 4 de outubro de 2026.

## Resumo

O comando `npm audit --omit=dev` informa três ocorrências de severidade alta, mas elas representam uma única vulnerabilidade transitiva propagada pela cadeia do Prisma:

```text
prisma@6.19.3
└── @prisma/config@6.19.3
    └── deepmerge-ts@7.1.5
```

Nenhum pacote, versão ou lockfile foi alterado durante esta análise.

## Vulnerabilidade

- Pacote vulnerável: `deepmerge-ts` em versões anteriores à 8.0.0.
- Versão instalada: `7.1.5`.
- Identificador: [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx).
- Classificação do npm: alta.
- CWE: CWE-674, recursão sem controle adequado.
- Comportamento: grafos de objetos recursivos podem provocar exaustão da pilha durante uma operação de merge.
- Versão corrigida do pacote afetado: `deepmerge-ts` 8.0.0 ou superior.

O relatório também lista `@prisma/config` e `prisma` porque eles conduzem até a dependência vulnerável. Portanto, não são três vulnerabilidades independentes.

## Situação da cadeia do Prisma

Na data da consulta, `@prisma/config` 7.10.0 ainda declarava `deepmerge-ts` 7.1.5. A versão indicada pelo dist-tag `latest` do Prisma era uma pré-release 8.0.0-rc.19, e a cadeia consultada ainda estava dentro da faixa indicada pelo alerta. Assim, não foi identificada uma atualização oficial direta e estável do Prisma que, por si só, comprovadamente eliminasse o problema.

O `npm audit` oferece `prisma@6.12.0` como correção forçada. Essa opção está fora da faixa atualmente declarada e representa um downgrade em relação à versão 6.19.3. Ela não foi executada.

## Impacto provável no ReUse Web

O risco prático atual é menor do que a classificação genérica pode sugerir porque `deepmerge-ts` chega ao projeto por `@prisma/config`, utilizado principalmente pelas ferramentas e pela leitura da configuração do Prisma. Não foi encontrado uso direto desse pacote no código das rotas do ReUse nem passagem de objetos enviados por usuários para essa função de merge.

O cenário mais plausível é uma negação de serviço durante comandos de desenvolvimento, geração do cliente ou build caso uma configuração recursiva maliciosa ou incorreta alcance a biblioteca. Não há evidência de que requisições comuns do site possam acionar diretamente essa vulnerabilidade.

Essa avaliação reduz a exposição provável, mas não transforma o alerta em inexistente. A cadeia deve continuar sendo acompanhada.

## Estratégias futuras

### 1. Aguardar correção oficial na cadeia do Prisma — recomendada

Atualizar Prisma e `@prisma/client` juntos quando uma versão estável passar a depender de `deepmerge-ts` 8 ou remover a dependência vulnerável.

- Benefício: mantém a combinação suportada pelo fornecedor.
- Risco: o alerta permanece até a publicação da correção.
- Validação necessária: geração do cliente, migrations em banco descartável, testes e build.

### 2. Atualizar para uma nova versão principal estável do Prisma

Considerar somente depois que a versão corrigida estiver estável e houver tempo para revisar as mudanças de compatibilidade.

- Benefício: pode resolver a cadeia e manter suporte futuro.
- Risco: mudanças incompatíveis em configuração, geração do cliente ou migrations.
- Validação necessária: ambiente isolado, comparação de schema e migrations, testes de CRUD e build.

### 3. Usar `overrides` para forçar `deepmerge-ts` 8

Não recomendado sem confirmação do Prisma, pois troca uma dependência principal sob `@prisma/config` por uma versão de outra major.

- Benefício: pode remover o alerta sem trocar toda a versão do Prisma.
- Risco: incompatibilidade silenciosa em comandos de configuração ou geração.

### 4. Reclassificar a CLI `prisma` como dependência de desenvolvimento

Pode reduzir a superfície considerada em instalações de produção, mas não elimina a vulnerabilidade do ambiente de desenvolvimento e pode afetar provedores que executam `prisma generate` no `postinstall`.

- Benefício: separação mais correta entre cliente de runtime e ferramenta de desenvolvimento.
- Risco: falha de geração durante instalação ou deploy se o provedor omitir dependências de desenvolvimento.

### 5. Executar `npm audit fix --force`

Não recomendado. A solução atual propõe downgrade para Prisma 6.12.0 e pode desalinhar `prisma` e `@prisma/client`, alterar o lockfile e introduzir regressões.

## Recomendação

Manter as versões atuais por enquanto, registrar a aceitação temporária do risco e acompanhar uma correção oficial do Prisma. Quando ela existir, atualizar `prisma` e `@prisma/client` juntos em uma alteração isolada, com banco de teste e validação completa. Não usar `--force`, downgrade ou `overrides` no estado atual.
