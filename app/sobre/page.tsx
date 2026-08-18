import type { Metadata } from "next";
import { SubscribeForm } from "@/components/SubscribeForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sobre o Autor",
};

export default function SobrePage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-serif text-3xl font-bold">Sobre</h1>

      <div className="card mt-8 p-8">
        <h2 className="font-serif text-xl font-semibold">{siteConfig.autor.nome}</h2>
        <p className="mt-3 text-ink-light/70 dark:text-ink-dark/70">
          {siteConfig.autor.bio}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="btn-ghost">
            Instagram
          </a>
          <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" className="btn-ghost">
            YouTube
          </a>
        </div>
      </div>

      <div className="card mt-8 p-8">
        <h2 className="font-serif text-xl font-semibold">Fale comigo</h2>
        <p className="mt-2 text-sm text-ink-light/70 dark:text-ink-dark/70">
          Quer sugerir um tema, tirar uma dúvida ou apenas dizer olá? Cadastre-se
          abaixo e responda o e-mail de boas-vindas — leio todas as mensagens.
        </p>
        <div className="mt-6">
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}
