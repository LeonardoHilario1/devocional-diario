import Link from "next/link";
import { DevotionalCard } from "@/components/DevotionalCard";
import { ArticleCard } from "@/components/ArticleCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import {
  getDevocionais,
  getEstudos,
  getArtigos,
} from "@/lib/db";
import { materiaLabels, categoriaLabels } from "@/lib/site-config";

export default async function HomePage() {
  const [devocionais, estudos, artigos] = await Promise.all([
    getDevocionais(),
    getEstudos(),
    getArtigos(),
  ]);

  const destaque = devocionais[0];
  const proximosDevocionais = devocionais.slice(1, 4);

  return (
    <div>
      <section className="border-b border-brand-100 bg-gradient-to-b from-brand-50/60 to-transparent py-16 dark:border-brand-900/40 dark:from-brand-900/10">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="tag-pill">Devocional de hoje</span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Fé para o cotidiano, <br /> uma reflexão por vez.
            </h1>
            <p className="mt-4 max-w-lg text-ink-light/70 dark:text-ink-dark/70">
              Devocionais diários, estudos teológicos aprofundados e reflexões
              sobre fé, relacionamentos e sociedade — direto no seu e-mail.
            </p>

            {destaque && (
              <Link
                href={`/devocionais/${destaque.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
              >
                Ler &ldquo;{destaque.titulo}&rdquo; ({destaque.tempoLeituraMin} min) →
              </Link>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-serif text-lg font-semibold">
              Receba o devocional no seu e-mail
            </h2>
            <p className="mt-1 text-sm text-ink-light/60 dark:text-ink-dark/60">
              Conteúdo segmentado para sua faixa etária e interesse.
            </p>
            <div className="mt-5">
              <SubscribeForm compact />
            </div>
          </div>
        </div>
      </section>

      {proximosDevocionais.length > 0 && (
        <section className="container-page py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold">Devocionais recentes</h2>
            <Link href="/devocionais" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proximosDevocionais.map((d) => (
              <DevotionalCard key={d.slug} devocional={d} />
            ))}
          </div>
        </section>
      )}

      {estudos.length > 0 && (
        <section className="border-t border-brand-100 bg-white/50 py-16 dark:border-brand-900/40 dark:bg-black/10">
          <div className="container-page">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-serif text-2xl font-bold">Estudos teológicos</h2>
              <Link href="/teologia" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
                Ver todas as matérias →
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {estudos.slice(0, 5).map((e) => (
                <div key={e.slug} className="w-72 shrink-0">
                  <ArticleCard
                    href={`/teologia/${e.materia}/${e.slug}`}
                    eyebrow={materiaLabels[e.materia]}
                    titulo={e.titulo}
                    resumo={e.resumo}
                    tempoLeituraMin={e.tempoLeituraMin}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {artigos.length > 0 && (
        <section className="container-page py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold">Vida & Sociedade</h2>
            <Link href="/vida-sociedade" className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artigos.slice(0, 3).map((a) => (
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
        </section>
      )}
    </div>
  );
}
