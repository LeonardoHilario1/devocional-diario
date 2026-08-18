import "dotenv/config";
import prismaClientPkg from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { PrismaClient } = prismaClientPkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function readJson(relativePath) {
  const raw = await readFile(path.join(__dirname, "..", relativePath), "utf-8");
  return JSON.parse(raw);
}

async function main() {
  const devocionais = await readJson("lib/content/devocionais.json");
  const estudos = await readJson("lib/content/estudos.json");
  const artigos = await readJson("lib/content/artigos.json");

  for (const d of devocionais) {
    await prisma.devocional.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        titulo: d.titulo,
        data: new Date(d.data),
        versiculo: d.versiculo,
        referencia: d.referencia,
        corpo: JSON.stringify(d.corpo),
        aplicacao: JSON.stringify(d.aplicacao),
        oracao: d.oracao,
        faixaEtaria: JSON.stringify(d.faixaEtaria),
        tempoLeituraMin: d.tempoLeituraMin,
        audioUrl: d.audioUrl ?? null,
      },
    });
  }

  for (const e of estudos) {
    await prisma.estudoTeologico.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        titulo: e.titulo,
        materia: e.materia,
        resumo: e.resumo,
        corpo: JSON.stringify(e.corpo),
        data: new Date(e.data),
        tempoLeituraMin: e.tempoLeituraMin,
      },
    });
  }

  for (const a of artigos) {
    await prisma.artigoVidaSociedade.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        titulo: a.titulo,
        categoria: a.categoria,
        resumo: a.resumo,
        corpo: JSON.stringify(a.corpo),
        data: new Date(a.data),
        tempoLeituraMin: a.tempoLeituraMin,
      },
    });
  }

  console.log(
    `Seed concluído: ${devocionais.length} devocionais, ${estudos.length} estudos, ${artigos.length} artigos.`
  );
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
