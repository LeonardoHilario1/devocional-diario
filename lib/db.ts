import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type {
  ArtigoVidaSociedade,
  CategoriaVidaSociedade,
  Devocional,
  EstudoTeologico,
  FaixaEtaria,
  MateriaTeologica,
  Subscriber,
} from "./types";

/**
 * Camada de acesso a dados.
 *
 * Lê e grava conteúdo (devocionais, estudos, artigos) e inscritos via
 * Prisma, no banco SQLite local definido por DATABASE_URL (ver
 * prisma/schema.prisma). Como SQLite não tem colunas de array/enum nativas,
 * os campos `corpo`, `aplicacao` e `faixaEtaria` são gravados como JSON
 * string e convertidos de volta para array aqui.
 *
 * Para trocar por Postgres/MySQL no futuro: troque o `provider` em
 * prisma/schema.prisma, ajuste DATABASE_URL, rode uma nova migration —
 * as funções abaixo (e as assinaturas) continuam as mesmas.
 */

function toDevocional(row: {
  slug: string;
  titulo: string;
  data: Date;
  versiculo: string;
  referencia: string;
  corpo: string;
  aplicacao: string;
  oracao: string;
  faixaEtaria: string;
  tempoLeituraMin: number;
  audioUrl: string | null;
}): Devocional {
  return {
    slug: row.slug,
    titulo: row.titulo,
    data: row.data.toISOString().slice(0, 10),
    versiculo: row.versiculo,
    referencia: row.referencia,
    corpo: JSON.parse(row.corpo),
    aplicacao: JSON.parse(row.aplicacao),
    oracao: row.oracao,
    faixaEtaria: JSON.parse(row.faixaEtaria),
    tempoLeituraMin: row.tempoLeituraMin,
    audioUrl: row.audioUrl ?? undefined,
  };
}

function toEstudo(row: {
  slug: string;
  titulo: string;
  materia: string;
  resumo: string;
  corpo: string;
  data: Date;
  tempoLeituraMin: number;
}): EstudoTeologico {
  return {
    slug: row.slug,
    titulo: row.titulo,
    materia: row.materia as MateriaTeologica,
    resumo: row.resumo,
    corpo: JSON.parse(row.corpo),
    data: row.data.toISOString().slice(0, 10),
    tempoLeituraMin: row.tempoLeituraMin,
  };
}

function toArtigo(row: {
  slug: string;
  titulo: string;
  categoria: string;
  resumo: string;
  corpo: string;
  data: Date;
  tempoLeituraMin: number;
}): ArtigoVidaSociedade {
  return {
    slug: row.slug,
    titulo: row.titulo,
    categoria: row.categoria as CategoriaVidaSociedade,
    resumo: row.resumo,
    corpo: JSON.parse(row.corpo),
    data: row.data.toISOString().slice(0, 10),
    tempoLeituraMin: row.tempoLeituraMin,
  };
}

// ---------- Devocionais ----------

export async function getDevocionais(): Promise<Devocional[]> {
  const rows = await prisma.devocional.findMany({ orderBy: { data: "desc" } });
  return rows.map(toDevocional);
}

export async function getDevocionalDoDia(): Promise<Devocional | null> {
  const row = await prisma.devocional.findFirst({ orderBy: { data: "desc" } });
  return row ? toDevocional(row) : null;
}

export async function getDevocionalBySlug(
  slug: string
): Promise<Devocional | null> {
  const row = await prisma.devocional.findUnique({ where: { slug } });
  return row ? toDevocional(row) : null;
}

export async function getDevocionaisPorFaixaEtaria(
  faixa: FaixaEtaria
): Promise<Devocional[]> {
  const lista = await getDevocionais();
  return lista.filter((d) => d.faixaEtaria.includes(faixa));
}

// ---------- Estudos teológicos ----------

export async function getEstudos(): Promise<EstudoTeologico[]> {
  const rows = await prisma.estudoTeologico.findMany({ orderBy: { data: "desc" } });
  return rows.map(toEstudo);
}

export async function getEstudoBySlug(
  slug: string
): Promise<EstudoTeologico | null> {
  const row = await prisma.estudoTeologico.findUnique({ where: { slug } });
  return row ? toEstudo(row) : null;
}

export async function getEstudosPorMateria(
  materia: MateriaTeologica
): Promise<EstudoTeologico[]> {
  const rows = await prisma.estudoTeologico.findMany({
    where: { materia },
    orderBy: { data: "desc" },
  });
  return rows.map(toEstudo);
}

// ---------- Vida & Sociedade ----------

export async function getArtigos(): Promise<ArtigoVidaSociedade[]> {
  const rows = await prisma.artigoVidaSociedade.findMany({ orderBy: { data: "desc" } });
  return rows.map(toArtigo);
}

export async function getArtigoBySlug(
  slug: string
): Promise<ArtigoVidaSociedade | null> {
  const row = await prisma.artigoVidaSociedade.findUnique({ where: { slug } });
  return row ? toArtigo(row) : null;
}

export async function getArtigosPorCategoria(
  categoria: CategoriaVidaSociedade
): Promise<ArtigoVidaSociedade[]> {
  const rows = await prisma.artigoVidaSociedade.findMany({
    where: { categoria },
    orderBy: { data: "desc" },
  });
  return rows.map(toArtigo);
}

// ---------- Inscritos (newsletter) ----------

export async function addSubscriber(
  input: Omit<Subscriber, "criadoEm">
): Promise<{ ok: true } | { ok: false; erro: string }> {
  try {
    await prisma.subscriber.create({
      data: {
        nome: input.nome,
        email: input.email.toLowerCase(),
        faixaEtaria: input.faixaEtaria,
        denominacao: input.denominacao,
        trilha: input.trilha,
      },
    });
    return { ok: true };
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2002"
    ) {
      return { ok: false, erro: "Este e-mail já está cadastrado." };
    }
    throw erro;
  }
}
