# Work 1.4 — homologação iOS nativa

**Registro histórico de homologação em simulador (2026).** Os resultados documentam as condições e versões testadas naquela sessão, não certificam distribuição em lojas, dispositivos físicos ou o ambiente Web hospedado. Veja o [índice da documentação](README.md) para o panorama atual.


Ambiente: Xcode 27.2 (27B52), iPhone 16 simulado, iOS 27.2. Development build própria Expo/React Native, compilada por Xcode, instalada por CoreSimulator e executada com Hermes/Metro. Sem Expo Go, React Native Web, EAS, publicação ou conta Apple paga.

## Procedimento local validado

Com os ambientes privados da Work 1.3 já configurados exclusivamente para o Supabase novo, inicie `npm run dev:web` na raiz. Para o Metro, dentro de `apps/mobile`, use:

```sh
NODE_OPTIONS=--dns-result-order=ipv4first npm exec -- expo start --dev-client --localhost --port 8081
```

No simulador, `127.0.0.1:4330` acessa o backend no Mac. Os servidores ficam limitados ao loopback. A preferência IPv4 é local ao processo: evita o Metro escutar apenas em `::1` enquanto o simulador procura `127.0.0.1`.

O `expo run:ios` desta versão preparou os arquivos nativos/Pods, mas não reconheceu o novo Device Hub do Xcode 27. Após a geração de `ios/ReUse.xcworkspace` e instalação dos Pods, a compilação utilizou:

```sh
RCT_NO_LAUNCH_PACKAGER=1 xcodebuild -workspace ios/ReUse.xcworkspace -scheme ReUse -configuration Debug -sdk iphonesimulator -destination 'id=UDID_DO_SIMULADOR' -derivedDataPath /private/tmp/reuse-lab-work14-derived CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=- IPHONEOS_DEPLOYMENT_TARGET=15.1 build
```

O mínimo 15.1 já é o padrão do projeto; aplicá-lo também aos alvos auxiliares dos Pods evita mínimos antigos rejeitados pelo Xcode 27. A assinatura padrão do Xcode para simulador é necessária ao Keychain/SecureStore. Não use `CODE_SIGNING_ALLOWED=NO` nem adicione manualmente um grupo Keychain diferente dos entitlements simulados gerados pelo Xcode.

Instale a `.app` de Debug e inicie `com.guicunhasou.reuse` com `xcrun simctl install/launch` no dispositivo escolhido. O desenvolvimento pode solicitar confirmação para abrir o link local do development client. Isso não produz aplicativo de distribuição.

## Defeito corrigido

O runtime nativo não disponibiliza `AbortSignal.timeout`. A chamada de Auth falhava antes de alcançar o serviço. `fetchWithTimeout` usa `AbortController` e timer cancelado ao finalizar, respeitando também cancelamento do chamador. O mesmo adaptador atende o Supabase Auth e a API de perfil. Quatro testes novos cobrem conclusão, timeout, cancelamento e falha de rede, sem depender de `AbortSignal.timeout`.

## Jornadas comprovadas

- Login A e leitura do perfil real compartilhado.
- Edição de nome/biografia pelo iOS, observada na Web; edição pela Web, observada na tela nativa ao reabrir o perfil.
- Encerramento do processo e novo processo, sem reinstalação: a sessão A foi recuperada pelo SecureStore real e o perfil carregou sem novo login.
- Home/segundo plano e retorno ao mesmo aplicativo, preservando sessão e perfil.
- Renovação explícita e rotação de refresh token dentro do runtime nativo, com nova sessão persistida no SecureStore.
- Vencimento controlado de `expires_at` no armazenamento nativo, seguido de renovação automática e preservação da identidade. O relógio do Mac e a configuração remota não foram alterados.
- Logout no runtime nativo, limpeza do SecureStore e rejeição HTTP 401 ao reutilizar o token capturado em memória antes do logout.
- Login B após logout A, exibindo o perfil B. Isolamento e rejeição de identificadores de A em requisições B também verificados pela API real.

Uma instrumentação temporária, externa à entrega, executou as verificações controladas de sessão usando os módulos reais de Auth, API e SecureStore. Registrou somente booleanos e status HTTP num coletor em loopback. Ela foi removida e `App.tsx` restaurado integralmente antes do commit. O vencimento controlado testa metadados do SDK; a rejeição de JWT autenticamente expirado foi comprovada separadamente por HTTP, com relógio real. Não se afirma espera nativa de uma hora até vencer um JWT.

## Validação e limites

58 testes Web e 24 Mobile passaram; lint Web e TypeScript Mobile passaram. Dez grupos de testes HTTP do contrato compartilhado passaram, além da rejeição de JWT real expirado. A compilação nativa e as jornadas de interface são evidências distintas.

A homologação cobre o simulador indicado, não aparelho físico, release, assinatura de distribuição, reinstalação ou todas as versões iOS. As reinstalações de preparação ocorreram antes do login; o teste de persistência não reinstalou o app. Catálogo, chat, imagens, notificações, design, bancos históricos e infraestrutura remota ficaram fora do escopo. Os arquivos nativos gerados permanecem locais e ignorados; nenhum material de assinatura foi versionado.
