# Homologação local do ReUse Mobile

Estas ferramentas são duplos de teste: não representam o funcionamento real de Firebase, Supabase, armazenamento, notificações ou login social. Não há integração com ReUse Web.

## Preparação segura

Utilize uma cópia independente do código e das dependências já instaladas. Não compartilhe `node_modules` gravável, `.expo`, `ios/Pods` ou pastas de build com outro ambiente. Não copie `.env`. Examine previamente o estado do repositório.

A homologação de 25/10/2026 utilizou `/private/tmp/fiap-homologacao-20261025/mobile`, com Metro em 4330 e API fictícia em 4335. Não reaproveite portas ocupadas por outro ambiente.

## API fictícia

```sh
python3 scripts/homologacao/fixture_server.py --data-dir /private/tmp/reuse-mobile-dados --port 4335
```

O servidor escuta exclusivamente em `127.0.0.1`, cria seu próprio arquivo JSON e imagens fictícias. A pasta informada deve ser exclusiva da homologação. Mantém um subconjunto do contrato de itens/storage utilizado pelo SDK, sem reproduzir autenticação, RLS, concorrência ou toda a API Supabase. Nunca o exponha em uma interface pública. Não use dados reais.

## Expo com valores fictícios

```sh
python3 scripts/homologacao/run_expo.py --project /private/tmp/reuse-mobile-copia --port 4330 --api-port 4335
```

O iniciador rejeita o diretório original, desativa dotenv, telemetria e descoberta externa do Expo, usa somente valores fictícios e mantém o modo de desenvolvimento sem autenticação já existente no aplicativo. Exige dependências previamente instaladas na cópia; não instala pacotes nem chama EAS, deploy ou push.

Na compilação nativa isolada, os plugins também precisam receber valores fictícios. O binário de homologação desativou inicialização e eventos automáticos do Facebook; não é um binário para distribuição. Não reutilize configuração demonstrativa como publicação real.

## Particularidades nativas observadas

- Expo 55.0.23, React Native 0.83.6, Xcode 27.1; iOS 27.0 em simuladores novos de iPhone 16 e iPhone SE (3ª geração).
- Build Debug usou `CODE_SIGNING_ALLOWED=NO`, `IPHONEOS_DEPLOYMENT_TARGET=15.1` e DerivedData exclusivo. Não altera assinatura/Pods do diretório original.
- A cópia dos Pods possuía apenas cabeçalhos do React precompilado. Foi necessário restaurar, somente na cópia, o artefato oficial exato `react-native-artifacts-0.83.6-reactnative-core-debug.tar.gz` do Maven Central. Não instalar uma versão diferente para contornar o problema.
- O plugin `plugins/with-ios-scenes.js` acrescenta o manifesto e o delegado de cenas ao prebuild Swift do Expo. O AppDelegate da cópia compilada recebeu o mesmo conteúdo e iniciou no iOS 27. Não executar prebuild sobre alterações nativas existentes sem examiná-las.
- Se a atualização de um modal aberto deixar a sessão de desenvolvimento inconsistente, encerrar apenas o ReUse nesse simulador e abri-lo pelo ícone. Houve uma queda de desenvolvimento com `EXC_BAD_ACCESS` durante recarga/abertura por link; não foi estabelecida causa definitiva. Aberturas diretas e jornadas posteriores passaram. Isso não valida um build Release.

As capturas são de execução real no simulador, não exportação web. A abertura do seletor não comprova seleção e upload, e a mensagem de câmera indisponível não comprova captura física. Consulte as pendências do relatório.
