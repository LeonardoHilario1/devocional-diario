import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDevocionais, getDevocionalBySlug } from "@/lib/db";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ShareButtons } from "@/components/ShareButtons";
import { faixaEtariaLabels } from "@/lib/site-config";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const devocionais = await getDevocionais();
  return devocionais.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const devocional = await getDevocionalBySlug(params.slug);
  if (!devocional) return {};
  return { title: devocional.titulo, description: devocional.versiculo };
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function DevocionalPage({ params }: PageProps) {
  const devocional = await getDevocionalBySlug(params.slug);
  if (!devocional) notFound();

  return (
    <article className="container-page max-w-3xl py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-500">
        {formatarData(devocional.data)} · {devocional.tempoLeituraMin} min de leitura
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">{devocional.titulo}</h1>

      <div className="mt-3 flex flex-wrap gap-2">
        {devocional.faixaEtaria.map((f) => (
          <span key={f} className="tag-pill">
            {faixaEtariaLabels[f]}
          </span>
        ))}
      </div>

      {devocional.audioUrl && (
        <div className="mt-6">
          <AudioPlayer src={devocional.audioUrl} titulo={devocional.titulo} />
        </div>
      )}

      <blockquote className="prose-devocional mt-8 border-l-4 border-brand-300 pl-5 italic">
        &ldquo;{devocional.versiculo}&rdquo;
        <footer className="mt-2 text-sm font-medium not-italic text-brand-600 dark:text-brand-300">
          {devocional.referencia}
        </footer>
      </blockquote>

      <div className="prose-devocional mt-8 space-y-5">
        {devocional.corpo.map((par, i) => (
          <p key={i}>{par}</p>
        ))}
      </div>

      <div className="card mt-10 p-6">
        <h2 className="font-serif text-lg font-semibold">Aplicação prática</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          {devocional.aplicacao.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-serif text-lg font-semibold">Oração</h2>
        <p className="prose-devocional mt-3 text-base">{devocional.oracao}</p>
      </div>

      <div className="mt-10">
        <ShareButtons titulo={devocional.titulo} />
      </div>
    </article>
  );
}
