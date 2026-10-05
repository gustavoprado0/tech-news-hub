# Tech News Hub

Portal de notícias sobre tecnologia feito com Next.js, React, TypeScript, Styled Components, Axios e Yarn Workspaces. O feed combina publicações RSS de veículos de tecnologia com as principais histórias do Hacker News.

## Requisitos

- Node.js 24 ou superior
- Yarn 1.22.22 (a versão do projeto está indicada em `packageManager`)

## Começar

```bash
yarn install
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000). O servidor lê os feeds RSS e a API pública do Hacker News; nenhuma chave de API é necessária.

## Workspaces

```text
apps/
  web/                 Aplicação Next.js (App Router e API de notícias)
packages/
  shared/              Tipos compartilhados do feed
  ui/                  Componentes e tokens visuais com Styled Components
```

Comandos úteis na raiz:

```bash
yarn dev
yarn lint
yarn typecheck
yarn build
yarn check
```

## Fontes

O endpoint `GET /api/news` reúne notícias de TechCrunch, The Verge, Ars Technica e WIRED por RSS, junto com as histórias principais do Hacker News. As fontes são carregadas em paralelo e falhas parciais são exibidas no site sem ocultar as notícias das demais fontes. A resposta é armazenada em cache por 15 minutos.

## CI/CD

O workflow `CI` executa lint, verificação de tipos e build em pull requests e pushes para `main`.

O workflow `Deploy to Vercel` publica a aplicação em produção após pushes para `main` e também pode ser iniciado manualmente. Para habilitá-lo:

1. Importe o repositório na Vercel e defina o diretório raiz do projeto como `apps/web`.
2. Adicione os secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` nas configurações do repositório GitHub.
3. Envie o projeto para a branch `main`.

## Decisões técnicas

- App Router e Styled Components com injeção de estilos compatível com SSR.
- Workspace `shared` mantém o contrato tipado da API; `ui` compartilha os componentes visuais.
- Axios é usado nas integrações HTTP no servidor e no cliente.
- As versões das dependências principais estão fixadas para builds reproduzíveis.
