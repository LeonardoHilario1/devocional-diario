import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-100 bg-white/60 py-12 dark:border-brand-900/40 dark:bg-black/10">
      <div className="container-page grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold text-brand-700 dark:text-brand-200">
            {siteConfig.nome}
          </p>
          <p className="mt-2 text-sm text-ink-light/70 dark:text-ink-dark/70">
            {siteConfig.descricao}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-light/60 dark:text-ink-dark/60">
            Navegue
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/devocionais" className="hover:text-brand-600">Devocionais Diários</Link></li>
            <li><Link href="/teologia" className="hover:text-brand-600">Teologia & Doutrina</Link></li>
            <li><Link href="/vida-sociedade" className="hover:text-brand-600">Vida & Sociedade</Link></li>
            <li><Link href="/sobre" className="hover:text-brand-600">Sobre o Autor</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-light/60 dark:text-ink-dark/60">
            Acompanhe
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-brand-600"
            >
              Instagram — reflexões e bastidores diários
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-brand-600"
            >
              YouTube — mensagens em vídeo
            </a>
          </div>
        </div>
      </div>

      <div className="container-page mt-10 border-t border-brand-100 pt-6 text-xs text-ink-light/50 dark:border-brand-900/40 dark:text-ink-dark/50">
        © {new Date().getFullYear()} {siteConfig.nome}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
