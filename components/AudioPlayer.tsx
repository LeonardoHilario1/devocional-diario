"use client";

export function AudioPlayer({ src, titulo }: { src: string; titulo: string }) {
  return (
    <div className="card flex flex-col gap-2 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
        Ouça este devocional
      </p>
      <audio controls preload="none" className="w-full" aria-label={titulo}>
        <source src={src} />
        Seu navegador não suporta áudio incorporado.
      </audio>
    </div>
  );
}
