# Manutenção manual de imagens do laboratório

Work 1.12. Exclusivamente o projeto Supabase novo `mqvlgrxwuirgjutqltpv`, bucket privado `reuse-lab-items`. Nenhum agendamento foi criado. O comando manual funciona mesmo sem novos uploads; o gatilho existente antes de uploads continua limitado ao próprio usuário.

## Retenção e proteção

Preservados os prazos existentes: solicitações pendentes/verificadas expiram em três horas; imagens desassociadas recebem 24 horas. A limpeza respeita `expiresAt` já persistido e não antecipa prazos. `ATTACHED` nunca é candidato. Uma associação viva em `ItemImage` também impede a seleção, mesmo se o estado do upload estiver inconsistente.

A simulação e a execução usam o mesmo filtro. Uma transação por registro mantém o bloqueio de sua aquisição até o término da remoção e da transação. Isso protege a retomada de `CLEANING` contra trabalhadores concorrentes. A publicação existente só pode adquirir um upload `VERIFIED`, próprio e ainda válido; um candidato expirado ou em limpeza não pode ser publicado. A associação é conferida novamente antes da remoção.

A remoção contempla a chave temporária e a verificada (inclusive a chave determinística de uma confirmação interrompida). Somente após sucesso do Storage o registro é eliminado. Erro de transporte ou transação mantém o registro para nova tentativa; falha de um candidato não interrompe os seguintes. Se o processo parar depois da remoção dos bytes e antes do commit, uma tentativa posterior pode repetir a remoção dos mesmos caminhos, sem tocar em imagens associadas. A API de remoção do Storage aceita caminhos já ausentes.

## Procedimento

1. Confirmar branch, ambiente e projeto do laboratório. O arquivo local ignorado `apps/web/.env.local` contém a conexão restrita de runtime e a configuração do Storage. Nunca copiar seus valores para terminal, relatórios ou Git. O comando recusa banco de outro projeto antes de conectar.
2. Executar **somente simulação** por padrão:

   ```sh
   node --env-file=apps/web/.env.local apps/web/scripts/cleanup-item-uploads.mjs --dry-run
   ```

   A saída contém projeto, quantidade de registros expirados elegíveis e tamanho do próximo lote; não contém chaves de objetos, senhas ou URLs assinadas. Um registro pode ser candidato sem que bytes tenham chegado ao Storage. A simulação não chama `remove`, não altera estados e não reserva os candidatos.

3. Conferir a saída e a autorização específica para exclusões. A Work 1.12 **não autorizou nem executou limpeza global real**. Quando houver autorização explícita futura, o comando é:

   ```sh
   node --env-file=apps/web/.env.local apps/web/scripts/cleanup-item-uploads.mjs --apply --confirm-project=mqvlgrxwuirgjutqltpv
   ```

   `--apply` sozinho e argumentos desconhecidos são recusados. A execução revalida elegibilidade e associações; a simulação anterior não é garantia de que o conjunto permaneceu igual.

4. Examinar `removed`, `skipped` e `failed`. O lote é limitado a 50, ordenado por expiração e identificador. Falhas geram saída de processo diferente de zero. Não executar repetição ilimitada; em falhas persistentes, investigar a conexão e as permissões, simular novamente e conferir os registros remanescentes. Não relaxar as proteções para esvaziar o lote.

## Limites

- O mecanismo trata uploads rastreados em `ItemUpload`; não varre nem apaga arbitrariamente todo o bucket. Objetos sem registro ou resíduos temporários de uploads já associados exigem investigação própria; não são autorizados como órfãos apenas pelo nome ou pela idade.
- Sem chamada manual ou novo upload não há execução automática por relógio. Expiração torna um registro elegível, não garante sua exclusão imediata.
- O bloqueio transacional abrange uma chamada de rede ao Storage: máximo de 15 segundos por transação e espera de até 5 segundos por bloqueio. Lotes podem levar tempo; não inserir o comando no build nem em uma requisição pública.
- Um futuro agendamento precisará de operador/identidade restrita, prazo de execução compatível, exclusão de execuções sobrepostas, alertas de falha e revisão explícita de custos e permissões. Nada disso foi configurado nesta Work.
- Testes destrutivos usam bancos em memória e Storage simulado. Na validação real desta Work, só foram feitos inventários e simulações, sem exclusões.
