import Link from "next/link";
import type { Devocional } from "@/lib/types";

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DevotionalCard({ devocional }: { devocional: Devocional }) {
  return (
    <Link href={`/devocionais/${devocional.slug}`} className="card block p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
        {formatarData(devocional.data)} · {devocional.tempoLeituraMin} min de leitura
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold">
        {devocional.titulo}
      </h3>
      <blockquote className="mt-3 border-l-2 border-brand-300 pl-3 text-sm italic text-ink-light/70 dark:text-ink-dark/70">
        &ldquo;{devocional.versiculo}&rdquo;
        <footer className="mt-1 not-italic text-xs text-ink-light/50 dark:text-ink-dark/50">
          {devocional.referencia}
        </footer>
      </blockquote>
    </Link>
  );
}
