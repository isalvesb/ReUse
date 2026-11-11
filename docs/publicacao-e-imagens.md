# Publicação, edição e imagens — Work 1.6

Implementação local em 03–04/11/2026. Next.js/Prisma e Supabase Auth/PostgreSQL/Storage exclusivamente do laboratório. Sem push, deploy, distribuição, integração de chat/notificações ou alteração de infraestrutura antiga.

## Regras e contratos

A Web continua a referência: título obrigatório até 120 caracteres; descrição entre 20 e 3.000; localização pública opcional até 160; seis categorias; três modalidades; quatro condições. Venda exige preço decimal positivo até 99.999.999,99, com até duas casas. Troca/doação persistem preço nulo. São obrigatórias de uma a cinco fotos, até 5 MB por arquivo e 12 MB somados. Também se considera o tamanho das fotos mantidas, inclusive assets Web antigos.

| Contrato autenticado | Finalidade |
| --- | --- |
| `POST /api/v1/items` | Publicar, com `creationKey` persistente para repetição segura |
| `GET /api/v1/me/items` | Até 100 anúncios próprios, com estados e datas |
| `GET /api/v1/me/items?id=...` | Carregar próprio anúncio para edição e prévias autorizadas |
| `POST /api/v1/me/items` | Gerar identificador de criação; não publica nem reserva anúncio |
| `PATCH /api/v1/items/:id` | Edição completa, com `updatedAt` para evitar sobrescrita obsoleta |
| `POST /api/v1/uploads` | Autorizar upload direto de um arquivo, informando tipo/tamanho |
| `POST /api/v1/uploads/:id/complete` | Conferir arquivo real antes da associação |
| `GET /api/v1/images/:id` | Resolver imagem associada conforme visibilidade/identidade |

Os contratos JSON de escrita aceitam apenas campos conhecidos; o corpo é limitado durante a leitura a 16 KB. Perfil do proprietário vem da sessão verificada. `sellerId`, e-mail, UID, URL de imagem e URI local enviados como propriedade/referência são recusados. A Web chama as mesmas funções de domínio pelas Server Actions; o Mobile usa Bearer na API, sem escrever nas tabelas.

Fotos de um anúncio existente são mantidas por `imageId`, sempre conferido contra o próprio anúncio; novas fotos por `uploadId`, sempre do ator verificado, concluídas, válidas e não expiradas. Remover uma referência durante a edição desassocia a imagem. Não há exclusão definitiva de anúncios nesta etapa.

Publicação inicia ATIVO. Preserva-se o fluxo Web comprovado de pausar/reativar (ATIVO ↔ INATIVO). RESERVADO/CONCLUIDO continuam existentes e editáveis apenas sem mudar o estado; não se inventou um novo fluxo de reserva/conclusão. API e catálogo públicos continuam expondo somente ATIVO. Consultar/editar item alheio retorna 404; conflito de versão/criação retorna 409. Repetições idênticas de criação, inclusive simultâneas, resolvem para o mesmo anúncio.

## Storage e schema

Bucket `reuse-lab-items`, **privado**, limite 5 MB, tipos JPEG/PNG/WebP/GIF. Nenhuma política de acesso direto dos clientes foi aberta. Configuração privilegiada exclusiva do servidor: `REUSE_STORAGE_SECRET`, chave secreta somente do projeto novo, em arquivo local ignorado. Nunca usar prefixos `NEXT_PUBLIC_`/`EXPO_PUBLIC_` para esse valor. O destino Auth/SQL continua bloqueado ao projeto novo.

1. Servidor autoriza caminho aleatório, sem nome de arquivo pessoal/e-mail, em `staging/<id-domínio>/<uuid>.<extensão>`.
2. Cliente envia bytes diretamente ao Storage por URL assinada, sem atravessar o corpo de uma Function Next/Vercel.
3. Servidor baixa no máximo o limite do bucket, confere tamanho exato, assinatura binária e decodificação real com Sharp, com limite de pixels. Extensão e MIME declarados não são prova suficiente.
4. Somente bytes validados são gravados em chave separada e imutável `verified/...`. A autorização de upload nunca pode sobrescrever esse objeto validado.
5. Transação associa até cinco imagens ao anúncio e reclama atomicamente os uploads para impedir dupla utilização e corrida com limpeza.

A migration aditiva `20261103000300_shared_item_uploads` acrescenta metadados de idempotência em Item, referência UUID opcional em ItemImage e ItemUpload (proprietário, chaves permanentes, tipo, tamanho, estado e validade). Relações/FKs e RLS foram registradas. `anon` e `authenticated` não recebem acesso à tabela; somente o backend dedicado. Nenhuma conta, categoria, anúncio anterior ou dado histórico foi importado, resetado ou apagado.

A primeira aplicação da migration falhou por diferença TEXT/UUID em FK. A inspeção confirmou rollback integral do DDL; o registro foi marcado como revertido e a versão corrigida aplicada. Não houve reset nem coluna parcialmente aplicada deixada para trás. A tentativa anterior a essa apenas usou diretório incorreto e não chegou ao banco.

O banco guarda chaves permanentes e URLs estáveis de resolução Next, **não URLs assinadas temporárias**. Antes de emitir URL de leitura com validade de 60 segundos, o servidor confere associação e ATIVO, ou proprietário autenticado para prévia privada. Temporários e desassociados não ganham URL pública. Um link já emitido pode continuar válido até sua expiração; isso é um limite explícito da entrega por assinatura.

A Web pula o otimizador de imagens Next apenas para essas rotas estáveis, deixando o navegador seguir diretamente a autorização curta do Storage. Isso evita servir o binário por uma Function e evita cache do otimizador sobre imagem que pode se tornar privada. Galeria e prévias existentes foram preservadas.

Sharp `0.35.4`, já instalado transitivamente, passou a dependência direta da Web para a validação real. Nenhuma versão instalada foi atualizada. Não houve novo módulo nativo.

## Falhas, órfãos e rascunhos

Uploads sem associação expiram após três horas, acima da validade do token de upload (duas horas, conforme SDK). Limite de 15 envios pendentes/verificados por conta. Imagens desassociadas ficam marcadas para limpeza após 24 horas, sem invalidar a transação de edição. A limpeza recusa referências vivas e reclama atomicamente registros expirados; também calcula a chave final determinística caso uma falha entre Storage e banco a tenha deixado sem metadado completo.

A limpeza dos expirados da conta roda antes de novo upload. A manutenção global explícita e seu modo de simulação estão em [manutenção manual de imagens](manutencao-imagens.md). Aplicação exige confirmação do projeto e autorização específica para exclusões. Não há agendamento/serviço adicional: sem novas solicitações/manutenção, arquivos órfãos podem permanecer além do prazo. A Work 1.12 validou o mecanismo sem executar exclusões remotas.

O Mobile mantém rascunho local por identidade Supabase em `reuse:publish:v16:<subject>`, com gravações ordenadas. Fotos escolhidas são copiadas ao diretório privado do aplicativo para sobreviver ao reinício. Só referências de uploads confirmados entram na publicação. Falhas preservam texto, seleção e fotos; o rascunho só é removido após sucesso confirmado. Um novo formulário é limpo após publicar, sem reutilizar a criação anterior.

Rascunhos não são sincronizados com a Web. Chaves globais históricas `draft_*` não são lidas nem apagadas: não têm titular comprovado. Não foram silenciosamente atribuídas à nova conta. Fotos locais podem permanecer no armazenamento privado após sucesso/remoção; não se removeu mídia original da fototeca. Se um envio verificado expirar antes de publicar, a foto deverá ser selecionada/enviada novamente, mantendo os demais campos. Um conflito 409 exige recarregar o anúncio antes de sobrescrever alterações.

A câmera e a seleção nativa permanecem. No iOS, o seletor solicita representação compatível para fotos HEIC; a validação final do formato continua no servidor. A fototeca do simulador foi usada com duas imagens de paisagem padrão, sem dados pessoais. A importação adicional por simctl não concluiu e foi interrompida; não foi usada como evidência de seleção/captura. Câmera física não foi executada.

## UI e limites

Vitrine Mobile: modalidades agora quebram em linhas, sem cortar “Todas as modalidades”. A área da barra flutuante e da região segura foi reservada fora da lista; a aparência e a posição da barra foram mantidas. Categoria continua com rolagem horizontal. Foi acrescentado acesso a anúncios próprios para editar, incluindo os pausados. Detalhes recarregam ao retornar ao foco após edição.

O formulário Mobile segue os campos Web e dispensa o endereço privado/CEP detalhado histórico; localização pública é opcional. Câmera, fotos, rascunhos, animações e Jornada Sustentável ilustrativa foram preservados. Nenhum benefício/gamificação ou requisito FIAP novo foi implementado.

## Evidências e alcance

Evidências fora do Git: `../outputs/reuse-lab-work1-6-20261103/`.

- Interfaces: criação iOS com duas fotos → Web; edição Web → iOS; edição iOS → Web; galeria nas duas; criação Web com imagem → catálogo Mobile. Apenas contas fictícias existentes.
- Rascunho A: falha de conexão exibida sem perda de texto/fotos e restauração após reinício do processo. Isolamento de chaves por conta coberto em teste automatizado; troca de rascunhos A/B pela interface não foi percorrida.
- HTTP/Auth/banco/Storage reais: dois uploads, conteúdo disfarçado recusado, limites, idempotência simultânea, edição, conflito obsoleto, remoção de associação, pausa/reativação, B impedida de consultar/editar/reutilizar fotos de A. Os 12 fixtures públicos, três controles, categorias e perfis permaneceram preservados. Bucket recusou leitura pública sem assinatura.
- Testes: 68 Web + 29 Mobile; ESLint Web e TypeScript Mobile. O teste de limpeza usa armazenamento simulado; não houve avanço artificial do relógio nem exclusão precoce de arquivos remotos para homologá-lo.
- Build Web com fixture de fonte offline e bundles Expo iOS/Android. Não são substitutos das jornadas nativas.

Execução nativa em development build já compilada, iPhone 16 / iOS 27.2. Sem Expo Go ou React Native Web. Não houve nova compilação Xcode pois não mudou módulo nativo. Não há homologação em aparelho físico, câmera física, Android executado, conexão móvel fraca, encerramento forçado durante bytes em trânsito ou todas as combinações/formatos na interface. A retomada após interrupção de rede foi verificada antes do upload; não foi simulada queda no meio da transferência.

Não iniciar chat, notificações ou Work 1.7. Próxima discussão recomendada: revisão de usabilidade em aparelho físico e do ciclo de manutenção de imagens antes de definir nova integração.

Referência técnica: [Storage privado](https://supabase.com/docs/guides/storage/buckets/fundamentals), [upload assinado](https://supabase.com/docs/reference/javascript/file-buckets-createsigneduploadurl). O uso de chave final separada, autorização no domínio e limpeza é uma decisão do laboratório.
