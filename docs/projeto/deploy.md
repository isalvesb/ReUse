# Checklist de deploy

Não há deploy criado por estas alterações. Este documento separa o que está pronto no código, o que foi validado localmente e o que ainda depende de configuração de produção.

## Estado confirmado do ambiente local

- Supabase Storage configurado com bucket público `reuse-items`; um upload real feito pelo formulário do ReUse apareceu em `reuse-items/items/`.
- Resend configurado; solicitação, recebimento do e-mail, redefinição de senha e novo login foram validados de ponta a ponta.
- Google OAuth configurado; autorização, callback, criação ou recuperação do usuário e sessão foram validados de ponta a ponta.
- Facebook OAuth configurado; autorização e consulta à Graph API funcionaram, mas a conta testada não recebeu sessão porque a API não retornou `email`, mesmo com as permissões `email` e `public_profile` concedidas.
- IBM Watson Assistant não foi configurado; somente o classificador local foi validado.
- O arquivo `.env` permaneceu ignorado e nenhuma credencial real foi encontrada nos arquivos rastreados pelo Git.

Esses resultados comprovam apenas o ambiente local testado. As credenciais reais permanecem no `.env` e não devem ser copiadas para documentação, commits ou registros de execução.

## Variáveis obrigatórias

- `DATABASE_URL`: PostgreSQL de produção.
- `SESSION_SECRET`: chave longa e exclusiva do ambiente.
- `NEXT_PUBLIC_APP_URL`: URL pública com HTTPS.
- `SEED_PASSWORD`: senha local dos usuários demonstrativos; necessária somente ao executar o seed.
- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave usada somente pelo servidor.
- `SUPABASE_STORAGE_BUCKET`: bucket público para as imagens, por padrão `reuse-items`.

Para provar uma integração real com a IBM, ainda é necessário configurar as quatro variáveis `IBM_WATSON_*` descritas em `watson.md` e registrar uma resposta com `origin: "watson"`.

As variáveis de Google, Facebook e Resend são opcionais, mas as funções correspondentes só funcionarão se estiverem configuradas no ambiente executado. Elas foram validadas apenas no `.env` local e ainda precisam ser cadastradas separadamente em qualquer ambiente de preview ou produção.

## Armazenamento de imagens

Em desenvolvimento, as imagens ficam em `public/uploads/items`. Esse diretório não é adequado a ambientes serverless e está ignorado pelo Git.

Em produção, `src/lib/uploads.js` exige Supabase Storage. O bucket deve existir e permitir leitura pública; a chave `service_role` não pode ser exposta ao navegador. O servidor valida tipo e tamanho e aceita JPG, PNG, WebP ou GIF de até 5 MB por arquivo e 12 MB no total.

A integração validada usa a chave JWT legada `service_role`, enviada nos headers `apikey` e `Authorization: Bearer`. A nova chave no formato `sb_secret_...` não foi validada com essa implementação. Migrar para esse formato exige adaptar os headers e repetir os testes de upload e exclusão antes de trocar a credencial.

O bucket público permite leitura das imagens por URL, mas não torna uploads e exclusões públicos. Essas operações continuam autenticadas no servidor.

## Ordem sugerida

1. Criar PostgreSQL e aplicar as migrations.
2. Criar o bucket público do Supabase Storage.
3. Cadastrar todas as variáveis no provedor de hospedagem.
4. Executar `npm run check` localmente.
5. Fazer o primeiro deploy em ambiente de preview.
6. Validar cadastro, login, publicação com foto, vitrine e chat.
7. Validar as quatro intenções do assistente e a confirmação de ações.
8. Registrar evidências e só então promover para produção.

As migrations `20260926000100_add_session_version`, `20260926000200_add_rate_limit_buckets`, `20260926000300_add_chat_indexes` e `20260926000400_add_assistant_confirmations` são obrigatórias. A primeira permite revogar sessões anteriores quando uma senha é redefinida. A segunda persiste limites de uso sem armazenar os e-mails ou IDs originais. A terceira indexa participantes e histórico do chat. A quarta impede o reuso de confirmações assinadas do assistente. Sessões criadas antes da primeira mudança deixam de ser aceitas e os usuários precisam entrar novamente.

## Critérios de aceite

- Build de produção concluído sem erros.
- Imagem continua disponível após novo deploy.
- Usuário não autenticado não acessa ações do assistente.
- Uma conta não consegue alterar itens de outra conta.
- Pausar e retomar exigem confirmação.
- A resposta com Watson configurado informa `origin: "watson"`.
- Falha do Watson não executa mutação silenciosamente.
- URLs públicas do Supabase são aceitas pelo `next/image` no build que recebe `SUPABASE_URL`.
- Tokens de redefinição ficam armazenados apenas como hash e links anteriores são invalidados.
- Conversas e mensagens persistem no PostgreSQL e só ficam acessíveis aos participantes.
- Login, cadastro, recuperação, assistente e envio de mensagens aplicam limites de uso persistidos.

## Limitação diagnosticada do Facebook

O callback exige um e-mail antes de criar ou vincular uma conta. Essa decisão evita identidades incompletas e vínculos inseguros.

No teste local, a Meta autorizou o fluxo e registrou `email: granted`, mas `/me?fields=id,name,email` retornou apenas `id` e `name`. Nessa situação, o ReUse encerra o fluxo com uma mensagem orientando o uso de outro método de login. Isso não é evidência de erro no callback nem de credenciais inválidas.

Não deve ser criado e-mail fictício a partir do ID do Facebook. Qualquer futura estratégia sem e-mail exigirá uma decisão explícita sobre modelo de identidade, recuperação de conta e vinculação com usuários existentes.

## Dependências conhecidas

O Next.js foi atualizado de `16.3.2` para `16.3.6`, removendo o alerta crítico encontrado durante a validação. A auditoria ainda informa três alertas altos na cadeia de ferramentas do Prisma, por meio de `deepmerge-ts`. O npm oferece apenas uma correção forçada com downgrade do Prisma para `6.12.0`; ela não foi aplicada sem uma análise de compatibilidade específica.

O chat usa os modelos `Conversation` e `Message` do PostgreSQL. O rate limiting usa buckets persistidos no mesmo banco; para uma escala muito maior, ele pode ser substituído por um serviço dedicado sem alterar os fluxos públicos.
