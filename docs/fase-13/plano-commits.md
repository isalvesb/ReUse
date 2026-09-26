# Plano de commits da Fase 13

Todo o trabalho fica na branch `updates`. O assistente não executa `git commit`, `git push` nem publicação.

## Fluxo

1. Entre no repositório `ReUse-Web-updates`.
2. Execute `reuse status` para ver o plano.
3. Execute `reuse next` para colocar **somente o próximo grupo** no stage.
4. Revise com `git diff --cached`.
5. Execute manualmente o comando `git commit -m "..."` mostrado na tela.
6. Repita quando quiser avançar.

Se quiser desfazer apenas o stage, preservando as mudanças locais, use `reuse unstage`.

## Sequência proposta

1. `prepara fluxo e dependencias`
2. `define configuracao segura de ambiente`
3. `integra IBM Watson com intencoes permitidas`
4. `protege confirmacoes do assistente`
5. `adiciona migrations e limites de uso persistidos`
6. `adiciona API autenticada do assistente`
7. `integra assistente ao perfil`
8. `implementa chat autenticado e persistente`
9. `corrige navegacao e filtros da vitrine`
10. `protege privacidade de perfis e itens`
11. `valida dados de cadastro e login`
12. `fortalece publicacao e edicao de perfil`
13. `protege redefinicao de senha e sessoes`
14. `endurece vinculacao de contas sociais`
15. `remove credencial fixa do seed`
16. `otimiza imagens e transicoes`
17. `documenta entrega e configuracao`

Os grupos e seus arquivos são definidos em `.reuse/commit-plan.json`.
