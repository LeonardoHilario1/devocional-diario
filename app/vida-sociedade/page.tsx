import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { getArtigos } from "@/lib/db";
import { categoriaLabels } from "@/lib/site-config";
import type { CategoriaVidaSociedade } from "@/lib/types";

export const metadata: Metadata = {
  title: "Vida & Sociedade",
};

interface PageProps {
  searchParams: { categoria?: string };
}

export default async function VidaSociedadePage({ searchParams }: PageProps) {
  const todos = await getArtigos();
  const categoriaAtiva = searchParams.categoria as CategoriaVidaSociedade | undefined;

  const artigos = categoriaAtiva
    ? todos.filter((a) => a.categoria === categoriaAtiva)
    : todos;

  return (
    <div className="container-page py-16">
      <h1 className="font-serif text-3xl font-bold">Vida & Sociedade</h1>
      <p className="mt-2 max-w-xl text-ink-light/70 dark:text-ink-dark/70">
        Relacionamentos, política e cultura sob a perspectiva da fé cristã no
        dia a dia.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="/vida-sociedade"
          className={`tag-pill ${!categoriaAtiva ? "ring-2 ring-brand-400" : ""}`}
        >
          Todos
        </a>
        {Object.entries(categoriaLabels).map(([valor, label]) => (
          <a
            key={valor}
            href={`/vida-sociedade?categoria=${valor}`}
            className={`tag-pill ${categoriaAtiva === valor ? "ring-2 ring-brand-400" : ""}`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artigos.map((a) => (
          <ArticleCard
            key={a.slug}
            href={`/vida-sociedade/${a.slug}`}
            eyebrow={categoriaLabels[a.categoria]}
            titulo={a.titulo}
            resumo={a.resumo}
            tempoLeituraMin={a.tempoLeituraMin}
          />
        ))}
      </div>
    </div>
  );
}
