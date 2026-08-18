import type { Metadata } from "next";
import { DevotionalCard } from "@/components/DevotionalCard";
import { getDevocionais } from "@/lib/db";
import { faixaEtariaLabels } from "@/lib/site-config";
import type { FaixaEtaria } from "@/lib/types";

export const metadata: Metadata = {
  title: "Devocionais Diários",
};

interface PageProps {
  searchParams: { faixa?: string };
}

export default async function DevocionaisPage({ searchParams }: PageProps) {
  const todos = await getDevocionais();
  const faixaAtiva = searchParams.faixa;

  const devocionais = faixaAtiva
    ? todos.filter((d) => d.faixaEtaria.includes(faixaAtiva as FaixaEtaria))
    : todos;

  return (
    <div className="container-page py-16">
      <h1 className="font-serif text-3xl font-bold">Devocionais Diários</h1>
      <p className="mt-2 max-w-xl text-ink-light/70 dark:text-ink-dark/70">
        Reflexões curtas para começar (ou terminar) o dia com a Palavra.
        Filtre por público para encontrar o conteúdo mais adequado.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="/devocionais"
          className={`tag-pill ${!faixaAtiva ? "ring-2 ring-brand-400" : ""}`}
        >
          Todos
        </a>
        {Object.entries(faixaEtariaLabels).map(([valor, label]) => (
          <a
            key={valor}
            href={`/devocionais?faixa=${valor}`}
            className={`tag-pill ${faixaAtiva === valor ? "ring-2 ring-brand-400" : ""}`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {devocionais.map((d) => (
          <DevotionalCard key={d.slug} devocional={d} />
        ))}
      </div>

      {devocionais.length === 0 && (
        <p className="mt-10 text-sm text-ink-light/60 dark:text-ink-dark/60">
          Nenhum devocional encontrado para esse filtro ainda.
        </p>
      )}
    </div>
  );
}
