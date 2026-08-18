# Renovo Diário

Site de devocionais diários, estudos teológicos e reflexões sobre vida
cristã, construído com **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

> ⚠️ **Sem banco de dados por enquanto.** O conteúdo (devocionais, estudos,
> artigos) é lido de arquivos JSON estáticos em `lib/content/`, e os
> cadastros do formulário de inscrição são salvos em `data/subscribers.json`
> local (não versionado no git). Não há Postgres/MySQL/etc conectado — o
> projeto já vem com um `prisma/schema.prisma` pronto para quando isso for
> necessário. Veja a seção [Próximo passo: plugar um banco de dados](#próximo-passo-plugar-um-banco-de-dados).

## Como testar o site localmente

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior e npm.

```bash
# 1. Instale as dependências
npm install

# 2. Suba o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador. As páginas
recarregam automaticamente a cada alteração no código.

Para testar uma build de produção (mais próxima do que vai para o ar):

```bash
npm run build
npm run start
```

Outros comandos úteis:

```bash
npm run lint   # checagem de lint (ESLint)
```

Não é necessário configurar `.env` para rodar localmente — o `.env.example`
lista variáveis que só serão usadas quando um banco de dados e um provedor
de e-mail forem plugados no futuro.

## Estrutura

- `app/` — páginas (App Router): Home, Devocionais, Teologia, Vida & Sociedade, Sobre
- `app/api/subscribe/route.ts` — endpoint de cadastro de e-mail
- `components/` — componentes de UI reutilizáveis
- `lib/db.ts` — **camada única de acesso a dados**. Todas as páginas leem
  conteúdo através dela. Hoje ela lê de `lib/content/*.json` e grava
  inscritos em `data/subscribers.json`. Trocar a fonte de dados no futuro
  significa editar só este arquivo.
- `lib/content/*.json` — conteúdo de exemplo (devocionais, estudos, artigos)
- `lib/site-config.ts` — nome do site, bio do autor, links de redes sociais,
  labels de categorias — edite aqui para personalizar
- `prisma/schema.prisma` — schema pronto para quando for plugar um banco real

## Como adicionar conteúdo hoje

Edite os arquivos em `lib/content/`:
- `devocionais.json`
- `estudos.json`
- `artigos.json`

Cada item precisa de um `slug` único (usado na URL). Basta adicionar um novo
objeto ao array e o site já reflete a mudança.

## Próximo passo: plugar um banco de dados

O projeto já foi deixado pronto para isso:

1. `npm install prisma @prisma/client`
2. Defina `DATABASE_URL` no `.env` (Postgres do Supabase/Neon/Railway, por exemplo)
3. `npx prisma migrate dev --name init` (usa o schema em `prisma/schema.prisma`)
4. Reescreva as funções de `lib/db.ts` para usar `prisma.<modelo>.findMany()` etc,
   **mantendo as mesmas assinaturas de função** — nenhuma página precisa mudar.
5. Crie um painel simples (ou use Prisma Studio: `npx prisma studio`) para
   publicar devocionais/estudos sem editar JSON manualmente.

## Próximo passo: automação de e-mails

O formulário de cadastro (`components/SubscribeForm.tsx`) já captura:
nome, e-mail, faixa etária, denominação (opcional) e trilha de interesse
(devocionais / estudos / ambos) — os campos de segmentação pedidos no plano
original.

Hoje esses dados são salvos localmente em `data/subscribers.json`
(ignorado pelo git). Para automatizar o disparo segmentado:

1. Escolha um provedor (Brevo, Mailchimp, ConvertKit, Resend...)
2. No arquivo `app/api/subscribe/route.ts`, no bloco marcado com `TODO`,
   adicione a chamada à API do provedor para criar o contato com as tags
   de segmentação (`faixaEtaria` + `trilha`)
3. Ao publicar um novo devocional, dispare a campanha para a lista/tag
   correspondente no painel do provedor (ou via API, se quiser automatizar
   o disparo também)

## Design

- Tipografia serifada (Lora) para o corpo de leitura + sans-serif (Inter)
  para a interface, seguindo a recomendação de conforto de leitura diária
- Modo claro/escuro com persistência em `localStorage` (`components/ThemeProvider.tsx`)
- Player de áudio simples pronto em `components/AudioPlayer.tsx` — basta
  adicionar `audioUrl` a um devocional em `devocionais.json`
- Botões de compartilhamento (WhatsApp + copiar link para Stories) em
  `components/ShareButtons.tsx`
