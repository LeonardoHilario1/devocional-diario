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

## Como enviar os e-mails para os inscritos

O formulário de cadastro (`components/SubscribeForm.tsx`) já captura nome,
e-mail, faixa etária, denominação (opcional) e trilha de interesse
(devocionais / estudos / ambos), e salva tudo no banco de dados (tabela
`Subscriber`, via Prisma).

**Importante:** guardar o cadastro no banco não envia e-mail nenhum sozinho.
Hoje o site só *coleta* os inscritos — o disparo em si (o "e-mail que a
pessoa recebe todo dia") ainda precisa ser configurado à parte. Isso é assim
de propósito: enviar e-mail em massa exige um serviço especializado, não dá
para simplesmente usar o seu Gmail/Outlook pessoal (a maioria dos provedores
bloqueia ou marca como spam o envio em massa por uma conta pessoal).

**O que fazer:**

1. **Crie uma conta em um serviço de envio de e-mail em massa.** Alguns
   exemplos com plano gratuito para começar: [Brevo](https://www.brevo.com/pt/),
   [Mailchimp](https://mailchimp.com/), [Resend](https://resend.com/) ou
   [SendGrid](https://sendgrid.com/). Isso é diferente de criar um e-mail
   comum — é uma ferramenta que cuida de disparar milhares de e-mails sem
   cair na caixa de spam.
2. Dentro do painel desse serviço, gere uma **chave de API** (API Key) — é
   um código secreto que dá permissão para o site enviar e-mails em seu nome.
3. Escolha também o **e-mail remetente** (de onde os e-mails vão "sair"),
   por exemplo `contato@seudominio.com.br`. Alguns provedores pedem para
   verificar um domínio próprio antes de liberar o envio.
4. No arquivo `.env` do projeto, preencha:
   ```bash
   EMAIL_PROVIDER_API_KEY="a-chave-que-voce-gerou-no-passo-2"
   EMAIL_FROM="contato@seudominio.com.br"
   ```
5. No arquivo [app/api/subscribe/route.ts](app/api/subscribe/route.ts), no
   bloco marcado com `TODO`, é onde entra a chamada à API do provedor
   escolhido para criar o contato já com as tags de segmentação
   (`faixaEtaria` + `trilha`) — cada provedor tem sua própria forma de fazer
   isso (a documentação deles traz exemplos prontos para copiar).
6. Ao publicar um novo devocional, dispare a campanha para a lista/tag
   correspondente direto no painel do provedor (a maioria tem um "criar
   campanha" bem simples) — ou, se quiser automatizar esse passo também,
   dá para chamar a API do provedor para disparar sozinho.

Sem esses passos, o formulário continua funcionando normalmente (o cadastro
é salvo no banco), só que ninguém recebe e-mail até essa integração ser
feita.

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
  a versão do framework.
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
