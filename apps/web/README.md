<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/images/logo/ReUse-creme.png" />
  <img src="public/images/logo/ReUse-marrom.png" alt="ReUse Web" width="230" />
</picture>

# ReUse Web

**Mais vida para o que já existe.**

Experiência Web responsiva de um marketplace acadêmico de **venda, troca e doação** de objetos usados.

[![Site](https://img.shields.io/badge/Explorar_Web-342A2A?style=for-the-badge&logo=vercel&logoColor=F7EFDE)](https://reuse-lab.vercel.app)
[![Pitch](https://img.shields.io/badge/Ver_o_pitch-EBBBEB?style=for-the-badge&logo=youtube&logoColor=342A2A)](https://youtu.be/6i3HlwCB0co)
[![Monorepo](https://img.shields.io/badge/Repositório_completo-584C4C?style=for-the-badge&logo=github&logoColor=F7EFDE)](../../README.md)

</div>

<p align="center"><img src="public/images/banners/banner-1.png" width="800" alt="Banner institucional ReUse, compartilhe, troque e reutilize" /></p>

## Experiência Web

A Web reúne navegação por categorias, Vitrine com pesquisa e filtros, detalhes de anúncios, criação e edição de itens, perfis e conversas. As modalidades são **venda, troca e doação**. A identidade visual utiliza marrom, creme e rosa, com a marca em **Syne** e os textos da interface em **Inter**.

Os fluxos de assistência permitem orientar o usuário e, quando o serviço experimental IBM está disponível, propor pausa ou retomada de anúncios próprios **com confirmação explícita**. Serviços externos dependem da configuração do ambiente.

> **Demonstração acadêmica:** anúncios, localidades, perfis e preços são fictícios. A versão hospedada pode exigir autorização da Vercel; não representa um marketplace público com negociações reais.

### Design system

<p align="center">
  <img src="https://github.com/user-attachments/assets/7464e2f7-a105-4f91-94f5-cf41d0aec458" alt="Paleta de cores do ReUse" width="740" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/36facb46-1769-4160-afbb-9c4f4d7f7d5a" alt="Linguagem de ilustrações do ReUse" width="740" />
</p>

O projeto procura tornar visíveis os estados de carregamento, erros, confirmação e cancelamento, com rótulos consistentes e navegação adaptada às larguras de tela. Veja os [tokens e decisões de interface](../../docs/design-system.md).

## Tecnologias

**Next.js, React, Prisma, PostgreSQL/Supabase, Supabase Auth/Storage** e integração experimental com **IBM watsonx Orchestrate**. A Web e o Mobile utilizam contratos compartilhados, com autenticação e autorização tratadas no backend Next.js.

Arquitetura, limitações e componentes: [documentação do monorepo](../../docs/README.md).

## Como executar

Execute **a partir da raiz do repositório**, com Node.js 24.x e npm 11.x. Use os arquivos `apps/web/.env.example` e `apps/mobile/.env.example` somente como **modelos**: defina os valores autorizados em arquivos locais ignorados pelo Git. **Não inclua credenciais nos `.env.example` nem as versione.**

```bash
npm ci --install-strategy=nested --ignore-scripts
npm run generate:web
npm run dev:web
```

Servidor local: `http://127.0.0.1:4330`.

### Verificações

```bash
npm run test:web
npm run lint:web
npm run build:web
```

Instalação, geração Prisma e build **não** são autorização para migrations ou seed em bancos existentes. Confira os detalhes de [pré-publicação](../../docs/pre-publicacao.md) e [dados demonstrativos](../../docs/demonstracao-academica.md).

## Equipe

Guilherme Cunha · Isamara Alves · Kauane Cavalcante · Mirna Marinho

**FIAP · Web Design · 2026**

[Repositório principal](../../README.md) · [Aplicação Mobile](../mobile/README.md) · [Plano de marketing digital](../../docs/plano-marketing-digital.md)

> Este README descreve o produto integrado. Registros e capturas de sprints anteriores continuam preservados no histórico Git e na documentação histórica, mas não devem ser interpretados como o estado atual da plataforma.
