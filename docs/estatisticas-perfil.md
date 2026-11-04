# Estatísticas próprias de anúncios

Work 1.12. `GET /api/v1/me/stats` exige a sessão Supabase verificada pelo backend e não aceita parâmetros de titular. Usa `actor.userId` para agrupar os próprios anúncios no PostgreSQL e responde com `Cache-Control: private, no-store`.

Contrato `data`: `totalItems`, `activeItems`, `pausedItems`, `donationItems`, `tradeItems`, `saleItems`, todos inteiros não negativos. A resposta não contém e-mails, tokens, listas de anúncios ou dados de terceiros. Falta de sessão gera 401, parâmetros geram 400, indisponibilidade gera 503; não existe escrita nesse endpoint.

- Total: todos os anúncios do proprietário, em todos os estados existentes.
- Ativos: estado `ATIVO`.
- Pausados: estado `INATIVO`.
- Por modalidade: anúncios `DOACAO`, `TROCA` e `VENDA`, em todos os estados. Na Web, os números “Trocas” e “Vendas” já tinham esse significado; não representam negócios concluídos.

O total pode ser maior que ativos + pausados quando houver registros `RESERVADO` ou `CONCLUIDO`. Nenhum fluxo desses estados foi criado ou alterado. A função pura `itemStatistics` é reutilizada pela consulta agregada do servidor e pelo resumo já existente na Web, preservando seu comportamento.

No Mobile, os cartões locais “Trocas / Itens / Avaliação” foram substituídos por **Anúncios / Ativos / Pausados**, mantendo os mesmos componentes e estilos. Não foi inventada reputação. O campo legado de avaliação permanece no domínio/Web sem uma nova implementação; não é apresentado como estatística funcional no Mobile.

O Mobile lê as contagens ao abrir/retomar o perfil e ao voltar do segundo plano. Não há promessa de atualização instantânea enquanto a tela continua aberta. Retornar ao perfil após publicação/edição consulta o banco novamente. Uma nova tentativa manual repete a leitura. Durante carregamento aparecem reticências; em erro aparecem traços e mensagem de indisponibilidade com nova tentativa, nunca zeros substitutos. Zero é exibido apenas após resposta válida para uma conta realmente sem anúncios. Respostas tardias de uma tela/conta anterior são ignoradas. O conteúdo do perfil permite rolagem para acomodar avisos e manter os controles acessíveis; mensagens de falha ficam dentro da área de conteúdo, abaixo do cabeçalho seguro.

## Verificação reproduzível

Com backend local em 127.0.0.1:4330 e o ambiente privado já configurado:

```sh
REUSE_TEST_CREDENTIALS_FILE=/caminho/privado/contas-ficticias.json node --env-file=apps/web/.env.local scripts/check-profile-statistics.mjs
```

Por padrão, compara A/B com SQL independente, recusa seleção de outro titular, simula a limpeza e confere inventário de imagens sem remoção. `--exercise-status` é opção explícita para pausar e reativar um anúncio fictício próprio existente, sem upload; só usar com autorização para esse teste. O estado original é restaurado inclusive na saída de erro, quando a conexão permite, e eventual falha de restauração é informada. O `updatedAt` do anúncio avança como numa edição normal. Não usar contas, banco ou objetos históricos.

Publicação nova e vazio legítimo são cobertos em testes isolados. A verificação real usa as duas contas já existentes e uma mudança reversível de estado; não cria anúncios ou imagens.
