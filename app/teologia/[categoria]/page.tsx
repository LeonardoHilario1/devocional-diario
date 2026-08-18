import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEstudosPorMateria } from "@/lib/db";
import { materiaLabels, materiaDescricoes } from "@/lib/site-config";
import type { MateriaTeologica } from "@/lib/types";

interface PageProps {
  params: { categoria: string };
}

export async function generateStaticParams() {
  return Object.keys(materiaLabels).map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const label = materiaLabels[params.categoria];
  return { title: label ?? "Teologia & Doutrina" };
}

export default async function MateriaPage({ params }: PageProps) {
  const materia = params.categoria as MateriaTeologica;
  if (!materiaLabels[materia]) notFound();

  const estudos = await getEstudosPorMateria(materia);

  return (
    <div className="container-page py-16">
      <Link href="/teologia" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
        ← Todas as matérias
      </Link>
      <h1 className="mt-3 font-serif text-3xl font-bold">{materiaLabels[materia]}</h1>
      <p className="mt-2 max-w-xl text-ink-light/70 dark:text-ink-dark/70">
        {materiaDescricoes[materia]}
      </p>

      <div className="mt-10 space-y-4">
        {estudos.map((e) => (
          <Link key={e.slug} href={`/teologia/${materia}/${e.slug}`} className="card block p-6">
            <h2 className="font-serif text-xl font-semibold">{e.titulo}</h2>
            <p className="mt-2 text-sm text-ink-light/70 dark:text-ink-dark/70">{e.resumo}</p>
            <p className="mt-3 text-xs font-medium text-brand-500">{e.tempoLeituraMin} min de leitura</p>
          </Link>
        ))}

        {estudos.length === 0 && (
          <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">
            Ainda não há estudos publicados nesta matéria.
          </p>
        )}
      </div>
    </div>
  );
}
