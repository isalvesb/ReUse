# Conteúdo autorizado do laboratório

A publicação contém somente a branch `main` do monorepo, os históricos de aplicação importados e os arquivos estruturais revisados. Backups integrais, stashes, refs de preservação, reflogs, arquivos locais de ambiente, configurações Google e material de assinatura ficam fora da publicação.

Foi autorizada especificamente a manutenção histórica das configurações públicas de cliente Firebase API key, Supabase `anon` key e Facebook client token já identificadas. Seus valores não são reproduzidos nesta documentação. Identificadores públicos de projeto e OAuth existentes continuam como parte da configuração histórica. Nenhuma configuração histórica foi usada para acessar serviços.

Um destinatário fixo em uma versão histórica da rota Web de recuperação de senha foi substituído por `teste@example.com`, somente na cópia de importação. O valor anterior não deve existir nos objetos alcançáveis pela branch publicada. O mapa dos commits é documental; não são publicadas refs que apontem aos commits Web antigos substituídos.

As atribuições dos autores e a topologia dos commits foram preservadas. Exemplos, fixtures e metadados de procedência/licença das dependências permanecem identificados em seu contexto. A revisão não constitui auditoria das políticas dos bancos ou dos provedores externos.

Não incluir segredos de servidor, chaves `service_role`, tokens administrativos, chaves privadas, dados pessoais de usuários, `.env` reais, certificados, keystores ou configurações locais de assinatura. A exceção histórica não se estende a novos valores.

Os originais e os backups completos permanecem externos ao repositório e não foram reescritos. Não configurar deploy, conectar provedores ou executar operações de banco como consequência desta fundação.
