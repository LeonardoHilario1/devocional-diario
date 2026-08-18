export const siteConfig = {
  nome: "Renovo Diário",
  descricao: "Devocionais diários, estudos teológicos e reflexões sobre fé e vida.",
  // Usada no e-mail de boas-vindas (lib/email.ts) para montar o link do site.
  // Troque pelo domínio real quando o site estiver publicado.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  autor: {
    nome: "Seu Nome Aqui",
    bio: "Escrevo sobre fé, teologia e vida cristã no dia a dia.",
  },
  social: {
    instagram: "https://instagram.com/seuusuario",
    youtube: "https://youtube.com/@seuusuario",
    whatsappShareBase: "https://wa.me/?text=",
  },
};

export const materiaLabels: Record<string, string> = {
  "bibliologia-hermeneutica": "Bibliologia & Hermenêutica",
  "teologia-sistematica": "Teologia Sistemática",
  "historia-da-igreja": "História da Igreja",
  "teologia-biblica-exegese": "Teologia Bíblica & Exegese",
  "teologia-pratica-pastoral": "Teologia Prática & Pastoral",
};

export const materiaDescricoes: Record<string, string> = {
  "bibliologia-hermeneutica":
    "Como a Bíblia foi formada, métodos de interpretação e contexto histórico.",
  "teologia-sistematica":
    "Cristologia, Pneumatologia, Soteriologia, Escatologia e Doutrina de Deus.",
  "historia-da-igreja":
    "Patrística, Reforma Protestante e o cristianismo ao longo dos séculos.",
  "teologia-biblica-exegese":
    "Estudos versículo a versículo de livros bíblicos específicos.",
  "teologia-pratica-pastoral":
    "Liderança, discipulado, aconselhamento e vida devocional.",
};

export const categoriaLabels: Record<string, string> = {
  relacionamentos: "Relacionamentos",
  politica: "O Cristão e a Política",
  "cultura-trabalho": "Cultura & Trabalho",
};

export const faixaEtariaLabels: Record<string, string> = {
  adolescentes: "Adolescentes",
  jovens: "Jovens",
  adultos: "Adultos",
  familia: "Família",
};
