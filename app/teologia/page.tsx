import type { Metadata } from "next";
import Link from "next/link";
import { getEstudos } from "@/lib/db";
import { materiaLabels, materiaDescricoes } from "@/lib/site-config";
import type { MateriaTeologica } from "@/lib/types";

export const metadata: Metadata = {
  title: "Teologia & Doutrina",
};

export default async function TeologiaPage() {
  const estudos = await getEstudos();
  const materias = Object.keys(materiaLabels) as MateriaTeologica[];

  return (
    <div className="container-page py-16">
      <h1 className="font-serif text-3xl font-bold">Teologia & Doutrina</h1>
      <p className="mt-2 max-w-xl text-ink-light/70 dark:text-ink-dark/70">
        Estudos organizados por matéria clássica, para um aprendizado
        sistemático da fé cristã.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {materias.map((materia) => {
          const total = estudos.filter((e) => e.materia === materia).length;
          return (
            <Link key={materia} href={`/teologia/${materia}`} className="card p-6">
              <h2 className="font-serif text-xl font-semibold">
                {materiaLabels[materia]}
              </h2>
              <p className="mt-2 text-sm text-ink-light/70 dark:text-ink-dark/70">
                {materiaDescricoes[materia]}
              </p>
              <p className="mt-4 text-xs font-medium text-brand-500">
                {total} estudo{total === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
