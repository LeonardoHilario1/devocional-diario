-- CreateTable
CREATE TABLE "Devocional" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "versiculo" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "aplicacao" TEXT NOT NULL,
    "oracao" TEXT NOT NULL,
    "faixaEtaria" TEXT NOT NULL,
    "tempoLeituraMin" INTEGER NOT NULL,
    "audioUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EstudoTeologico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "tempoLeituraMin" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ArtigoVidaSociedade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "tempoLeituraMin" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faixaEtaria" TEXT NOT NULL,
    "denominacao" TEXT,
    "trilha" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Devocional_slug_key" ON "Devocional"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EstudoTeologico_slug_key" ON "EstudoTeologico"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArtigoVidaSociedade_slug_key" ON "ArtigoVidaSociedade"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
