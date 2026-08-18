import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtigoBySlug, getArtigos } from "@/lib/db";
import { ShareButtons } from "@/components/ShareButtons";
import { categoriaLabels } from "@/lib/site-config";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const artigos = await getArtigos();
  return artigos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const artigo = await getArtigoBySlug(params.slug);
  if (!artigo) return {};
  return { title: artigo.titulo, description: artigo.resumo };
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function ArtigoPage({ params }: PageProps) {
  const artigo = await getArtigoBySlug(params.slug);
  if (!artigo) notFound();

  return (
    <article className="container-page max-w-3xl py-16">
      <Link
        href={`/vida-sociedade?categoria=${artigo.categoria}`}
        className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
      >
        ← {categoriaLabels[artigo.categoria]}
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-wide text-brand-500">
        {formatarData(artigo.data)} · {artigo.tempoLeituraMin} min de leitura
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">{artigo.titulo}</h1>
      <p className="mt-4 text-lg text-ink-light/70 dark:text-ink-dark/70">{artigo.resumo}</p>

      <div className="prose-devocional mt-8 space-y-5">
        {artigo.corpo.map((par, i) => (
          <p key={i}>{par}</p>
        ))}
      </div>

      <div className="mt-10">
        <ShareButtons titulo={artigo.titulo} />
      </div>
    </article>
  );
}
