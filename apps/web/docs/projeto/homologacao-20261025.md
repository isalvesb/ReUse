# Homologação ReUse Web — 25/10/2026

## Resultado

Pronto para preparar a demonstração e o pitch usando o ambiente local isolado. A entrega publicada ainda depende de autorização de publicação, configuração do banco e reteste dos provedores reais. Mobile e Web permanecem independentes; esta homologação não comprova sincronização entre eles.

Base inicial: branch `codex/conclusao-academica-2026`, commit `cc1901e`, diretório limpo. A cópia temporária anterior já não existia e foi reconstruída a partir do código atual, com cópia independente das dependências, sem alterar .next do checkout nem seus arquivos .env.

## Ambiente e segurança

- Cópia: `/private/tmp/fiap-homologacao-20261025/reuse`.
- HTTP: `127.0.0.1:4327`; PostgreSQL exclusivo: `127.0.0.1:55447`, base e usuário `reuse_homologacao`.
- Runner `local-demo.mjs`: credenciais externas removidas, usuários fictícios, IBM real desabilitada e uploads exclusivamente locais.
- Instância descartável na porta 4328 apontou para uma porta local sem PostgreSQL para testar indisponibilidade. Não foi necessário desligar banco algum.
- Sete migrations e seed foram aplicados somente ao banco novo local. O build não executa migrations.

## Interface efetivamente exercitada

| Área | Resultado |
| --- | --- |
| Navegação | Home, Vitrine, categorias, modalidades, Sobre, recuperação, perfil, edição, produto, chat e notificações. Perfil/chat/notificações sem sessão levam ao login |
| Responsividade | Navegador em 1440×900, 390×844 e 320×844; páginas principais sem transbordamento horizontal persistente |
| Conta | Cadastro fictício, logout e login por e-mail; nome, localização, avatar ilustrado e biografia editados e preservados após recarga |
| Publicação | Erro sem foto, correção e publicação com duas imagens; formulário limpa após sucesso; novo rascunho após sucesso preservado em nova falha |
| Imagens | Imagens enviadas depois do build aparecem no anúncio; miniatura 2 muda a seleção; detalhes preservam título, modalidade, condição, localização e descrição |
| Busca e filtros | Busca pelo anúncio encontra um resultado; busca pelo formulário mobile após a correção; filtro de categoria incompatível gera estado vazio; modalidades e categorias também percorridas |
| Conversas | João fictício iniciou conversa sobre o anúncio; anunciante recebeu, respondeu e as duas mensagens permaneceram no histórico |
| Notificações | Publicação e recebimento de mensagem geraram notificações; marcar todas como lidas executado |
| Assistente | Origem exibida como demonstração local; cancelar solicitação, pausar e reativar com confirmação exercitados |
| Indisponibilidade | Home e Vitrine com destino de banco local inexistente exibem aviso claro, sem apresentar catálogo vazio ou contagem zero como resultado conhecido |

## Defeitos encontrados e corrigidos

1. **P1 — perda de rascunho:** uma resposta de erro do server action disparava reset automático de campos, apagando título/categoria/localização e deixando dados parciais. O envio mantém o rascunho em falha; só troca a chave dos campos depois de uma publicação confirmada. Preserva também preço em novo erro após uma publicação anterior. Evidência: reteste real com cinco campos preservados, publicação bem-sucedida e segundo rascunho de venda mantendo título e R$ 123,45.
2. **P1 — busca ausente no mobile:** o único formulário de pesquisa usava `hidden ... md:flex`, sem equivalente nas larguras menores. A mesma busca agora aparece abaixo da navegação mobile, com nome acessível e controle de envio com área de toque adequada. Testado no navegador a 390 pixels pelo formulário, com um resultado encontrado e filtro subsequente vazio.
3. **P1 — contagem falsa em indisponibilidade:** a Vitrine informava zero itens mesmo com falha no banco. Agora a contagem é substituída por texto de consulta indisponível; estado vazio continua reservado a consultas concluídas.

## Testes técnicos

- **48 testes automatizados aprovados**, zero falhas; lint sem erros.
- Build de produção final concluído na cópia independente, usando configuração local segura.
- `npm run demo -- verify`: integração HTTP + PostgreSQL aprovada para sessão, delegação, confirmação persistida, uso único, isolamento entre contas, rejeição de userId fornecido pelo cliente e reativação. Cria e remove somente seus próprios dados descartáveis.
- `git diff --check` sem erros.
- Console do navegador sem erros durante os percursos funcionais anteriores ao teste deliberado de indisponibilidade.

A preservação de rascunho e a busca mobile foram retestadas na interface após o build corrigido. Os 48 testes de regras não são apresentados como cobertura automatizada desses fluxos de interface.

## Evidências

No diretório `output/homologacao-20261025` deste chat:

- `reuse-desktop-home.png`, `reuse-desktop-chat.png`;
- `reuse-mobile-produto.png`, `reuse-mobile-chat-final.png`;
- `reuse-mobile-busca-final.png`, `reuse-mobile-indisponibilidade.png`;
- `reuse-observacoes-browser.json`, com URLs, larguras reais e observações de navegação.

As fotografias pequenas de teste são blocos de cor criados como fixtures, explicitamente associados a um anúncio fictício; não representam um produto real. A captura `reuse-indisponibilidade-antes.png` registra a inconsistência anterior à correção.

## Pendências e limites

- **P1 para a entrega publicada:** conferir conexão e logs do ambiente de hospedagem e validar o banco real somente após autorização. A rejeição de pooler identificada na auditoria anterior não foi usada para executar qualquer mudança remota.
- **P1 externo:** OAuth Google/Facebook, e-mail de recuperação, Supabase Storage e IBM real não foram homologados nesta revisão. A tela de recuperação foi inspecionada, mas nenhum e-mail foi enviado. Assistente local não prova resposta IBM.
- **P2:** ampliar validação com leitor de tela, Safari e aparelho físico. Chat usa atualização periódica, sem garantia de comunicação instantânea.
- Exibição de avaliações e curadoria demonstrativa não significa operação comercial validada; não há checkout/pagamentos ou integração operacional com o app mobile.

Nenhum push, PR, issue, deploy, notificação às integrantes, alteração de credenciais ou banco remoto foi realizado. Nenhum pitch, slide, vídeo ou PDF final foi produzido.
