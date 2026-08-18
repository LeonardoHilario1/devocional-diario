import fs from "node:fs/promises";
import path from "node:path";
import type {
  ArtigoVidaSociedade,
  CategoriaVidaSociedade,
  Devocional,
  EstudoTeologico,
  FaixaEtaria,
  MateriaTeologica,
  Subscriber,
} from "./types";

import devocionaisData from "./content/devocionais.json";
import estudosData from "./content/estudos.json";
import artigosData from "./content/artigos.json";

/**
 * Camada de acesso a dados.
 *
 * Hoje: lê conteúdo de arquivos JSON locais e grava inscritos em
 * data/subscribers.json (arquivo local, ignorado pelo git).
 *
 * Quando plugar um banco de verdade (ver prisma/schema.prisma):
 * troque o corpo de cada função abaixo por uma chamada equivalente
 * ao Prisma Client (ex.: `prisma.devocional.findMany()`), mantendo
 * as MESMAS assinaturas — assim nenhuma página/componente precisa mudar.
 */

const devocionais = devocionaisData as Devocional[];
const estudos = estudosData as EstudoTeologico[];
const artigos = artigosData as ArtigoVidaSociedade[];

function porDataDesc<T extends { data: string }>(a: T, b: T) {
  return new Date(b.data).getTime() - new Date(a.data).getTime();
}

// ---------- Devocionais ----------

export async function getDevocionais(): Promise<Devocional[]> {
  return [...devocionais].sort(porDataDesc);
}

export async function getDevocionalDoDia(): Promise<Devocional | null> {
  const lista = await getDevocionais();
  return lista[0] ?? null;
}

export async function getDevocionalBySlug(
  slug: string
): Promise<Devocional | null> {
  return devocionais.find((d) => d.slug === slug) ?? null;
}

export async function getDevocionaisPorFaixaEtaria(
  faixa: FaixaEtaria
): Promise<Devocional[]> {
  const lista = await getDevocionais();
  return lista.filter((d) => d.faixaEtaria.includes(faixa));
}

// ---------- Estudos teológicos ----------

export async function getEstudos(): Promise<EstudoTeologico[]> {
  return [...estudos].sort(porDataDesc);
}

export async function getEstudoBySlug(
  slug: string
): Promise<EstudoTeologico | null> {
  return estudos.find((e) => e.slug === slug) ?? null;
}

export async function getEstudosPorMateria(
  materia: MateriaTeologica
): Promise<EstudoTeologico[]> {
  const lista = await getEstudos();
  return lista.filter((e) => e.materia === materia);
}

// ---------- Vida & Sociedade ----------

export async function getArtigos(): Promise<ArtigoVidaSociedade[]> {
  return [...artigos].sort(porDataDesc);
}

export async function getArtigoBySlug(
  slug: string
): Promise<ArtigoVidaSociedade | null> {
  return artigos.find((a) => a.slug === slug) ?? null;
}

export async function getArtigosPorCategoria(
  categoria: CategoriaVidaSociedade
): Promise<ArtigoVidaSociedade[]> {
  const lista = await getArtigos();
  return lista.filter((a) => a.categoria === categoria);
}

// ---------- Inscritos (newsletter) ----------

const SUBSCRIBERS_PATH = path.join(process.cwd(), "data", "subscribers.json");

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_PATH, "utf-8");
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

export async function addSubscriber(
  input: Omit<Subscriber, "criadoEm">
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const atuais = await readSubscribers();

  if (atuais.some((s) => s.email.toLowerCase() === input.email.toLowerCase())) {
    return { ok: false, erro: "Este e-mail já está cadastrado." };
  }

  const novo: Subscriber = { ...input, criadoEm: new Date().toISOString() };

  await fs.mkdir(path.dirname(SUBSCRIBERS_PATH), { recursive: true });
  await fs.writeFile(
    SUBSCRIBERS_PATH,
    JSON.stringify([...atuais, novo], null, 2),
    "utf-8"
  );

  return { ok: true };
}
