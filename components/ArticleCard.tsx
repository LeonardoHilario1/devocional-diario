import Link from "next/link";

interface ArticleCardProps {
  href: string;
  eyebrow: string;
  titulo: string;
  resumo: string;
  tempoLeituraMin: number;
}

export function ArticleCard({
  href,
  eyebrow,
  titulo,
  resumo,
  tempoLeituraMin,
}: ArticleCardProps) {
  return (
    <Link href={href} className="card block p-6">
      <span className="tag-pill">{eyebrow}</span>
      <h3 className="mt-3 font-serif text-lg font-semibold">{titulo}</h3>
      <p className="mt-2 text-sm text-ink-light/70 dark:text-ink-dark/70">
        {resumo}
      </p>
      <p className="mt-4 text-xs font-medium text-brand-500">
        {tempoLeituraMin} min de leitura
      </p>
    </Link>
  );
}
