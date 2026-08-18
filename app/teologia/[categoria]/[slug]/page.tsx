import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEstudoBySlug, getEstudos } from "@/lib/db";
import { ShareButtons } from "@/components/ShareButtons";
import { materiaLabels } from "@/lib/site-config";

interface PageProps {
  params: { categoria: string; slug: string };
}

export async function generateStaticParams() {
  const estudos = await getEstudos();
  return estudos.map((e) => ({ categoria: e.materia, slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const estudo = await getEstudoBySlug(params.slug);
  if (!estudo) return {};
  return { title: estudo.titulo, description: estudo.resumo };
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function EstudoPage({ params }: PageProps) {
  const estudo = await getEstudoBySlug(params.slug);
  if (!estudo || estudo.materia !== params.categoria) notFound();

  return (
    <article className="container-page max-w-3xl py-16">
      <Link
        href={`/teologia/${estudo.materia}`}
        className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
      >
        ← {materiaLabels[estudo.materia]}
      </Link>

      <p className="mt-4 text-sm font-medium uppercase tracking-wide text-brand-500">
        {formatarData(estudo.data)} · {estudo.tempoLeituraMin} min de leitura
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">{estudo.titulo}</h1>
      <p className="mt-4 text-lg text-ink-light/70 dark:text-ink-dark/70">{estudo.resumo}</p>

      <div className="prose-devocional mt-8 space-y-5">
        {estudo.corpo.map((par, i) => (
          <p key={i}>{par}</p>
        ))}
      </div>

      <div className="mt-10">
        <ShareButtons titulo={estudo.titulo} />
      </div>
    </article>
  );
}
