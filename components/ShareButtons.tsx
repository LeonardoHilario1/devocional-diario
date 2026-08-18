"use client";

interface ShareButtonsProps {
  titulo: string;
}

export function ShareButtons({ titulo }: ShareButtonsProps) {
  function compartilharWhatsapp() {
    const url = window.location.href;
    const texto = encodeURIComponent(`${titulo}\n${url}`);
    window.open(`https://wa.me/?text=${texto}`, "_blank", "noopener,noreferrer");
  }

  async function copiarLink() {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copiado! Pronto para colar nos Stories do Instagram.");
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={compartilharWhatsapp} className="btn-ghost">
        Compartilhar no WhatsApp
      </button>
      <button onClick={copiarLink} className="btn-ghost">
        Copiar link para os Stories
      </button>
    </div>
  );
}
