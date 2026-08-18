# Renovo Diário

Site de devocionais diários, estudos teológicos e reflexões sobre vida
cristã, construído com **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

> **Banco de dados: SQLite local via Prisma.** O conteúdo (devocionais,
> estudos, artigos) e os cadastros do formulário de inscrição são lidos e
> gravados através do Prisma (`lib/db.ts` + `lib/prisma.ts`), num banco
> SQLite local (`dev.db`, não versionado no git). Para trocar por
> Postgres/MySQL em produção, veja a seção
> [Trocando o banco de dados](#trocando-o-banco-de-dados).

## Como baixar este projeto para testar

Você não precisa saber programar para colocar o site no ar no seu computador
e dar uma olhada. Duas formas de pegar os arquivos:

**Opção 1 — Baixar como ZIP (mais simples):**
1. Acesse [github.com/LeonardoHilario1/devocional-diario](https://github.com/LeonardoHilario1/devocional-diario)
2. Clique no botão verde **"Code"** → **"Download ZIP"**
3. Extraia o ZIP em uma pasta no seu computador

**Opção 2 — Clonar com Git** (se já tiver o [Git](https://git-scm.com) instalado):
```bash
git clone https://github.com/LeonardoHilario1/devocional-diario.git
cd devocional-diario
```

Depois de ter os arquivos na sua máquina, siga os passos abaixo para rodar
o site.

## Como testar o site localmente

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior (já vem com o
`npm`).

```bash
# 1. Instale as dependências
npm install

# 2. Copie o .env de exemplo (já vem pronto para SQLite local)
cp .env.example .env

# 3. Crie o banco local e rode as migrations
npx prisma migrate dev

# 4. Popule o banco com o conteúdo de exemplo
npm run db:seed

# 5. Suba o servidor de desenvolvimento
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
npm run lint       # checagem de lint (ESLint)
npm run db:seed    # repopula o banco com o conteúdo de lib/content/*.json
npm run db:studio  # abre o Prisma Studio (UI para ver/editar o banco)
```

## Estrutura

- `app/` — páginas (App Router): Home, Devocionais, Teologia, Vida & Sociedade, Sobre
- `app/api/subscribe/route.ts` — endpoint de cadastro de e-mail
- `components/` — componentes de UI reutilizáveis
- `lib/db.ts` — **camada única de acesso a dados**. Todas as páginas leem
  conteúdo através dela, via Prisma. Trocar de banco no futuro significa
  editar só `prisma/schema.prisma` + `lib/prisma.ts`, mantendo as mesmas
  assinaturas de função em `lib/db.ts`.
- `lib/prisma.ts` — instância singleton do `PrismaClient` (com o driver
  adapter do SQLite)
- `lib/content/*.json` — conteúdo de exemplo, usado por `prisma/seed.mjs`
  para popular o banco
- `lib/site-config.ts` — nome do site, bio do autor, links de redes sociais,
  labels de categorias — edite aqui para personalizar
- `prisma/schema.prisma` — schema do banco (Devocional, EstudoTeologico,
  ArtigoVidaSociedade, Subscriber)
- `prisma/seed.mjs` — popula o banco a partir de `lib/content/*.json`
- `prisma.config.ts` — configuração do Prisma CLI (caminho do schema,
  migrations e comando de seed)

## Como adicionar conteúdo hoje

Duas opções:

1. **Prisma Studio** (recomendado, sem editar JSON): `npm run db:studio`
   abre uma UI no navegador para criar/editar registros diretamente no banco.
2. **Editar os JSONs e re-rodar o seed**: edite `lib/content/devocionais.json`,
   `estudos.json` ou `artigos.json` (cada item precisa de um `slug` único,
   usado na URL) e rode `npm run db:seed` — o seed usa `upsert`, então só
   cria o que ainda não existe.

## Personalizando os links de redes sociais

Todo o Instagram, YouTube e o botão de WhatsApp que aparecem no site vêm de
um único lugar: [lib/site-config.ts](lib/site-config.ts). Não precisa mexer
em nenhuma página — basta editar esse arquivo:

```ts
export const siteConfig = {
  nome: "Renovo Diário",
  descricao: "Devocionais diários, estudos teológicos e reflexões sobre fé e vida.",
  autor: {
    nome: "Seu Nome Aqui",           // troque pelo nome do autor
    bio: "Escrevo sobre fé...",       // troque pela mini-bio
  },
  social: {
    instagram: "https://instagram.com/seuusuario",   // seu link do Instagram
    youtube: "https://youtube.com/@seuusuario",       // seu link do YouTube
    whatsappShareBase: "https://wa.me/?text=",        // não precisa mexer aqui
  },
};
```

Troque `instagram` e `youtube` pelos links reais do perfil (copie e cole a
URL direto do navegador ou do app). O `whatsappShareBase` é usado só para
montar o botão de "compartilhar no WhatsApp" em cada devocional — não é um
número de telefone, então normalmente não precisa alterar.

Depois de editar e salvar o arquivo, é só rodar `npm run dev` de novo (ou dar
refresh na página, se o servidor já estiver rodando) para ver a mudança.

## Trocando o banco de dados

O padrão local é SQLite (`dev.db`). Para usar Postgres/MySQL em produção
(Supabase, Neon, Railway etc.):

1. Em `prisma/schema.prisma`, troque `provider = "sqlite"` para
   `provider = "postgresql"` (ou `mysql`)
2. Defina `DATABASE_URL` com a connection string real no `.env` de produção
3. Troque o driver adapter em `lib/prisma.ts` e `prisma/seed.mjs` — de
   `@prisma/adapter-better-sqlite3` para `@prisma/adapter-pg` (Postgres) ou
   equivalente, e ajuste o construtor do adapter para `{ connectionString }`
4. Rode `npx prisma migrate dev --name init` contra o novo banco

## E-mail de boas-vindas

Quando alguém preenche o formulário de cadastro
(`components/SubscribeForm.tsx`), duas coisas acontecem, nessa ordem:

1. O cadastro é salvo no banco (tabela `Subscriber`, via Prisma) — nome,
   e-mail, faixa etária, denominação (opcional) e trilha de interesse.
2. Um **e-mail de boas-vindas automático** é disparado para a pessoa, com um
   versículo e um convite para conhecer o site (`lib/email.ts`, via
   [Resend](https://resend.com)).

Isso é diferente de uma campanha diária automática (mandar um devocional
novo todo dia para a lista inteira) — é só a mensagem única de "seja
bem-vindo(a)" no momento do cadastro. Se um dia você quiser evoluir para
disparos diários, [Trocando/expandindo o envio de e-mail](#trocandoexpandindo-o-envio-de-e-mail)
tem o caminho.

**Para ativar de verdade** (sem isso, o cadastro funciona normalmente, só o
e-mail não sai — fica um aviso no log do servidor):

1. Crie uma conta em [resend.com](https://resend.com) (tem plano gratuito,
   dá pra começar sem cartão de crédito).
2. No painel, gere uma **API key** e cole em `RESEND_API_KEY` no `.env`.
3. Em "Domains" no painel do Resend, verifique um domínio próprio e use um
   endereço dele em `EMAIL_FROM` (ex.: `contato@seudominio.com.br`). Sem
   domínio verificado, o Resend só deixa enviar para o e-mail da sua própria
   conta — ótimo pra testar, mas não funciona para inscritos de verdade.
4. Preencha `NEXT_PUBLIC_SITE_URL` com a URL real do site (é o link que vai
   dentro do e-mail) — em `http://localhost:3000` funciona para testar.
5. Reinicie o `npm run dev`.

O texto do e-mail (versículo, convite, bio do autor) está em
[lib/email.ts](lib/email.ts) — edite `VERSICULO_BOAS_VINDAS` e o HTML do
template à vontade.

## Trocando/expandindo o envio de e-mail

O que existe hoje é só o e-mail de boas-vindas (disparo único, na hora do
cadastro). Para automatizar o **devocional diário** para todos os inscritos:

1. Continue usando o Resend (ele também aguenta disparos em lote) ou troque
   por uma ferramenta de e-mail marketing com gestão de lista pronta —
   [Brevo](https://www.brevo.com/pt/) e [Mailchimp](https://mailchimp.com/)
   são bons exemplos com plano gratuito.
2. Crie uma rotina (um cron job, uma Vercel Cron Function, um script agendado)
   que roda todo dia, busca o devocional do dia (`getDevocionalDoDia()` em
   `lib/db.ts`) e dispara para os inscritos filtrando por `faixaEtaria` e
   `trilha` (já salvos em cada `Subscriber`).
3. Se trocar de provedor, o ponto de entrada continua sendo
   [lib/email.ts](lib/email.ts) — é só adaptar `sendWelcomeEmail` (ou
   adicionar uma função nova ao lado) para o SDK do provedor escolhido.

## Segurança

**O que já está protegido:**

- **Injeção de SQL**: todo acesso ao banco passa pelo Prisma (`lib/db.ts`),
  que sempre usa queries parametrizadas — não há nenhuma query SQL montada
  por concatenação de string em lugar nenhum do projeto.
- **Rotas expostas**: o único endpoint público de escrita é
  `POST /api/subscribe` (cadastro de e-mail). Não existe nenhuma rota que
  liste ou devolva os inscritos — os dados da tabela `Subscriber` (nome,
  e-mail, etc.) não podem ser lidos por ninguém de fora.
- **Isolamento de dados por usuário ("RLS")**: o conceito de Row Level
  Security é de bancos como Postgres/Supabase; este projeto usa SQLite sem
  esse mecanismo. Na prática, o equivalente aqui é não ter nenhuma rota que
  exponha dados de outros cadastros — o que já é o caso hoje. **Se um dia
  este banco for trocado por Postgres/Supabase** (veja
  [Trocando o banco de dados](#trocando-o-banco-de-dados)) e for adicionado
  login de usuários, ative RLS nas tabelas *e* lembre que o Prisma normalmente
  se conecta com uma credencial de administrador que ignora RLS por padrão —
  nesse caso as regras de acesso continuam precisando ser aplicadas no código
  (como já é feito hoje), não só no banco.
- **Validação e limites de entrada**: o formulário de cadastro valida e-mail,
  limita o tamanho de cada campo (nome, e-mail, denominação) e rejeita
  requisições com corpo maior que 10&nbsp;KB, evitando abusos com payloads
  gigantes.
- **Rate limiting**: `POST /api/subscribe` aceita no máximo 5 requisições por
  minuto por IP (`lib/rate-limit.ts`), para dificultar spam/flood no
  cadastro. É um limite em memória — funciona bem em um servidor único
  (self-hosted, Docker); em plataformas serverless com múltiplas instâncias
  (Vercel, por exemplo) o limite passa a ser aproximado por instância, então
  para produção nesse cenário vale trocar por um store compartilhado (ex.:
  Upstash Redis).
- **Cabeçalhos HTTP de segurança** (`next.config.mjs`): Content-Security-Policy,
  `X-Frame-Options: DENY` (impede que o site seja carregado dentro de um
  `<iframe>` em outro domínio — clickjacking), `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` e `Strict-Transport-Security`. O
  cabeçalho `X-Powered-By: Next.js` também foi desativado para não anunciar
  a versão do framework. A política é mais rígida em produção: em
  `npm run dev` ela libera `'unsafe-eval'` e `ws:` (exigidos pelo Hot Module
  Reload do Next) e não envia `Strict-Transport-Security` (que em
  `localhost`/HTTP faria o navegador forçar HTTPS na própria máquina depois).
  Se o navegador já tiver "guardado" HSTS de um teste anterior a essa
  correção e `http://localhost:3000` parar de abrir, limpe em
  `chrome://net-internals/#hsts` (campo "Delete domain security policies",
  digite `localhost`) — ou simplesmente acesse `http://127.0.0.1:3000`.
- **Segredos**: `.env` (chaves de API, string de conexão do banco) nunca é
  versionado no git — confira o `.gitignore`. Ao configurar o provedor de
  e-mail, a chave de API dele também deve ficar só no `.env`, nunca em código
  ou em variáveis `NEXT_PUBLIC_*` (essas são enviadas ao navegador — o
  oposto do que se quer para uma chave secreta).

**O que ainda precisa de atenção — dependências desatualizadas:**

`npm audit` acusa 8 vulnerabilidades de severidade alta nas dependências:

- `next@14.2.35` tem diversos CVEs corrigidos só a partir da major seguinte
  (upgrade para `next@16`). O projeto não usa as funcionalidades mais visadas
  por esses CVEs (Server Actions, Middleware, `next/image` com
  `remotePatterns`, i18n, rewrites) — reduz o risco prático, mas não zera,
  já que parte dos CVEs é no núcleo do App Router.
- `postcss` (usado só durante o build do CSS) e `deepmerge-ts` (usado
  internamente pelo Prisma CLI) têm vulnerabilidades que só importam se
  alguém conseguir injetar CSS ou config maliciosos no seu processo de
  build — baixo risco prático aqui, mas vale corrigir.

**Não rodei `npm audit fix --force`** porque ele tentaria resolver a
vulnerabilidade do `deepmerge-ts` rebaixando o Prisma para `6.12.0` — uma
versão anterior aos recursos do Prisma 7 usados neste projeto (driver
adapters, `prisma.config.ts`), o que quebraria o banco de dados configurado
agora. Atualizar o Next.js para a v15/v16 é uma mudança maior (API do App
Router, formato de config) que merece ser feita — e testada — separadamente.

## Design

- Tipografia serifada (Lora) para o corpo de leitura + sans-serif (Inter)
  para a interface, seguindo a recomendação de conforto de leitura diária
- Modo claro/escuro com persistência em `localStorage` (`components/ThemeProvider.tsx`)
- Player de áudio simples pronto em `components/AudioPlayer.tsx` — basta
  adicionar `audioUrl` a um devocional em `devocionais.json`
- Botões de compartilhamento (WhatsApp + copiar link para Stories) em
  `components/ShareButtons.tsx`
