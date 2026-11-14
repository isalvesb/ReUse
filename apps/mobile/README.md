<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../web/public/images/logo/ReUse-creme.png" />
  <img src="assets/images/ReUse-logo-marrom.png" alt="ReUse Mobile" width="220" />
</picture>

# ReUse Mobile

**Dê um novo propósito ao que você não usa mais.**

Aplicativo acadêmico desenvolvido com **React Native e Expo**, conectado ao mesmo domínio de dados da versão Web.

[![Monorepo](https://img.shields.io/badge/Conheça_o_projeto-342A2A?style=for-the-badge&logo=github&logoColor=F7EFDE)](../../README.md)
[![Pitch](https://img.shields.io/badge/Assistir_ao_pitch-EBBBEB?style=for-the-badge&logo=youtube&logoColor=342A2A)](https://youtu.be/6i3HlwCB0co)

</div>

<p align="center">
  <img src="assets/images/cta/HeroBannerCTA.png" alt="Ilustração institucional do ReUse sobre dar um novo propósito aos objetos" width="560" />
</p>

## Uma experiência feita para o celular

A versão Mobile apresenta busca, categorias e Vitrine; detalhes com imagens e informações sobre os anúncios; criação e edição de itens; perfil, Minha Vitrine e conversas. Os anúncios são classificados como **venda, troca ou doação**.

A interface compartilha com a Web o sistema de cores, tipografia e padrões de feedback, adaptando a navegação às tarefas mais frequentes no celular.

| Camada | Tecnologias |
| --- | --- |
| Aplicação nativa | React Native, Expo e TypeScript |
| Design e interação | Figma, Inter, Syne, animações e componentes reutilizáveis |
| Autenticação e dados | Supabase e backend compartilhado Next.js/Prisma |
| Assistência | Integração experimental IBM watsonx Orchestrate via backend |

> **Escopo:** o Mobile foi exercitado em simulador iOS e em verificações de código. Não há aplicativo assinado ou publicado nas lojas. O acesso a serviços reais e ao backend depende do ambiente configurado. As imagens e os anúncios exibidos na demonstração são fictícios.

## Design

A identidade combina o marrom `#342A2A`, o creme `#F7EFDE` e o rosa `#EBBBEB`, sem recorrer à paleta verde convencional de produtos sustentáveis.

<p align="center">
  <img src="https://github.com/user-attachments/assets/3398c220-498a-450e-a4c4-c0a7cb08ee74" alt="Prancha original com símbolo e logotipo do ReUse" width="720" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6c55b8d5-00e1-41d9-b55c-49ab8a3291df" alt="Estudo tipográfico original: Syne e Inter" width="600" />
</p>

Consulte [identidade visual e acessibilidade](../../docs/design-system.md) e [registros da homologação iOS](../../docs/homologacao-ios.md).

## Executar localmente

**A partir da raiz do monorepo**, com Node.js 24.x, npm 11.x e uma development build/simulador compatível:

```bash
npm ci --install-strategy=nested --ignore-scripts
npm run generate:web

# Terminal 1: backend local
npm run dev:web

# Terminal 2: aplicativo Expo
npm run dev:mobile
```

Configure apenas as variáveis de desenvolvimento autorizadas de `apps/web/.env.example` e `apps/mobile/.env.example`. O endereço `127.0.0.1:4330` é adequado ao simulador local nas condições documentadas, **não a um celular físico remoto**. O Expo Go não substitui uma development build para os módulos nativos deste projeto.

### Qualidade

```bash
npm run test:mobile
npm run typecheck:mobile
npm run build:mobile
```

O último comando **exporta bundles**, mas não assina nem distribui um aplicativo. Veja as [instruções gerais](../../README.md) e a [documentação técnica](../../docs/README.md).

## Equipe

Guilherme Cunha · Isamara Alves · Kauane Cavalcante · Mirna Marinho

**FIAP · Web Design · 2026**

[Versão Web](../web/README.md) · [Plano de marketing digital](../../docs/plano-marketing-digital.md) · [Pitch](https://youtu.be/6i3HlwCB0co)

> A primeira sprint e seus protótipos históricos continuam acessíveis no histórico Git e na documentação do projeto. As telas e limitações daquela etapa não representam necessariamente o monorepo integrado.
