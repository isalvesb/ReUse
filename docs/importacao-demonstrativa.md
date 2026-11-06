# Lote demonstrativo — Work 1.18

Importação administrativa local, separada dos fluxos de publicação do produto. Não executa migrations, reset, atualização de registros anteriores, limpeza global ou alteração de contas. Nenhuma execução ocorre em builds.

## Conteúdo e procedência

O lote `reuse-lab-work118-20261106` contém 36 anúncios históricos selecionados e 44 novos objetos, com 82 imagens WebP. Foram recebidos 12 PNGs, mas dois eram cópias idênticas da prancha 02: a prancha 01 (quatro eletrônicos) não estava disponível. A meta de 84 permanece pendente desses quatro originais; o lote atual tem 80.

As 25 imagens históricas recortadas derivam das seis pranchas cuja geração no ChatGPT foi confirmada pelo usuário. Onze objetos com fotografias Google/Mobile de procedência não verificada receberam 13 novas imagens IA, incluindo uma galeria ilustrativa de três ângulos. As fotografias problemáticas foram preservadas nas fontes privadas e não foram importadas. Origem IA não certifica marcas, modelos, materiais, funcionamento, autoria exclusiva ou direito de uso comercial de elementos representados. Esta autorização refere-se ao catálogo fictício do laboratório.

Os novos recortes preservam as proporções e a resolução dos quadrantes; removem apenas a divisória central. Os históricos mantêm os retângulos usados nas prévias anteriores. WebP qualidade 92, sem ampliação. O manifesto privado registra origem, recorte, dimensões e SHA-256. Todos os anúncios indicam sua natureza fictícia e a imagem ilustrativa. Localizações são generalizadas e fictícias; nenhum usuário histórico foi importado.

Dois históricos RESERVADO e dois CONCLUIDO preservam seus estados, ficando fora da vitrine pública. Os três Mobile sem status receberam ATIVO e condições normalizadas. O importador utiliza o validador puro de campos do domínio com suporte aos estados históricos; não altera as transições ou regras da API pública de criação.

Distribuição: Eletrônicos 12, Roupas 13, Móveis 14, Livros 14, Sapatos 13 e Outros 14; 39 vendas, 21 trocas e 20 doações. Cada conta fictícia recebeu 40 anúncios. O laboratório passou de 20 para 100 registros (93 públicos), preservando os anteriores.

## Arquivos privados

Fora do Git, no diretório de evidências da Work 1.18:

- `LOTE-MANIFESTO.json`: metadados, IDs determinísticos `lab118-*`, conta fictícia A/B, imagens e hashes.
- `IMAGENS-MANIFESTO.json`, `ORIGINAIS-MANIFESTO.json`, `RECORTES-HISTORICOS.json`, `GERACOES-IA.json`: procedência e correspondências.
- `IMPORTACAO-JOURNAL.json`: hash do manifesto, chaves exatas e versões pós-importação.
- `catalogo.html`: conferência privada dos 80 anúncios e suas imagens.

A salvaguarda privada contém `catalogo-anterior.json`, 21 imagens anteriores e seus hashes, os PNGs recebidos e as fontes IA. É uma cópia independente em diretório separado, no mesmo disco físico; não protege contra perda do Mac. A reconstrução dos arquivos foi conferida em pasta temporária isolada. Não se executou restauração sobre PostgreSQL nem exclusão remota para testá-la.

## Execução controlada

Na raiz do monorepo, informe caminhos absolutos para os três arquivos privados. Nunca copie seus segredos para o repositório.

```sh
node apps/web/scripts/import-demo-batch.mjs dry-run "$MANIFESTO" "$SNAPSHOT" "$DIARIO"
node apps/web/scripts/import-demo-batch.mjs apply "$MANIFESTO" "$SNAPSHOT" "$DIARIO"
node apps/web/scripts/import-demo-batch.mjs verify "$MANIFESTO" "$SNAPSHOT" "$DIARIO"
node apps/web/scripts/import-demo-batch.mjs rollback-dry-run "$MANIFESTO" "$SNAPSHOT" "$DIARIO"
```

A configuração privada existente é lida somente no servidor local. O comando confirma o banco e Auth do projeto `mqvlgrxwuirgjutqltpv` antes de consultar/escrever. Resolve exclusivamente as duas identidades fictícias já existentes, confere categorias centrais, bytes reais, decodificação, limites, duplicações e colisões.

O Storage recebe objetos imutáveis com `upsert:false`; eventuais colisões exigem igualdade de SHA-256. O diário registra todas as chaves antes dos envios. As associações e os registros são inseridos em uma transação, após verificar novamente a salvaguarda. Imagens ficam ATTACHED em bucket privado, com referências persistentes `/api/v1/images/:uploadId`; acesso continua sujeito ao status/proprietário. Não há invocação da limpeza de uploads antigos.

Repetição integral com os mesmos dados não cria registros nem reenvia imagens. Divergências são recusadas, sem sobrescrita. Falha de upload deixa somente objetos deste lote identificados no diário e nenhuma inserção parcial no PostgreSQL. Um novo apply pode retomar esses objetos somente se seus bytes forem iguais. Falha após commit pode reconstruir o recibo a partir dos registros verificados. Um manifesto alterado exige revisão; não use apply como editor de anúncios.

## Reversão exclusiva do lote

A reversão real **não foi executada** na homologação. O dry-run não exclui nada.

1. Preservar manifesto, diário e snapshot. Suspender apenas novas operações locais sobre este lote durante a janela de reversão.
2. Executar `rollback-dry-run`. Qualquer edição posterior, mudança de versão, imagem divergente, conversa ou notificação ligada aos anúncios bloqueia a reversão. Não contornar o bloqueio: preservar o novo conteúdo e decidir manualmente.
3. Quando efetivamente desejado e autorizado, executar:

```sh
node apps/web/scripts/import-demo-batch.mjs rollback "$MANIFESTO" "$SNAPSHOT" "$DIARIO" --confirm-batch=reuse-lab-work118-20261106
```

O comando bloqueia as linhas dos anúncios e revalida relações dentro da transação. Exclui apenas as associações, os anúncios e os ItemUploads enumerados pelo lote. Não altera os 20 anteriores nem usuários. Recusa cascatas sobre conversas/notificações.

4. A reversão do banco deixa intencionalmente os bytes no bucket privado e registra `storageCleanupPending` no diário. Para remover esses objetos posteriormente, é necessária uma operação separada e estritamente limitada às chaves do diário, após confirmar ausência de qualquer ItemUpload/ItemImage associado e igualdade de hash. Não selecionar por prefixos amplos, não executar limpeza global e não excluir arquivos anteriores. Nenhuma remoção de Storage foi realizada nesta Work.
5. Conferir os hashes dos registros anteriores e as contagens protegidas após a reversão. A salvaguarda anterior permanece intacta.

Para completar a prancha 01, preparar quatro IDs `lab118-p01-q1` a `lab118-p01-q4` em manifesto complementar revisado, com novo diário e salvaguarda própria. Não reescrever o manifesto/diário do lote já importado.
