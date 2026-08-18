export type FaixaEtaria = "adolescentes" | "jovens" | "adultos" | "familia";

export interface Devocional {
  slug: string;
  titulo: string;
  data: string; // ISO date: "2026-08-18"
  versiculo: string;
  referencia: string;
  corpo: string[]; // parágrafos
  aplicacao: string[];
  oracao: string;
  faixaEtaria: FaixaEtaria[];
  tempoLeituraMin: number;
  audioUrl?: string;
}

export type MateriaTeologica =
  | "bibliologia-hermeneutica"
  | "teologia-sistematica"
  | "historia-da-igreja"
  | "teologia-biblica-exegese"
  | "teologia-pratica-pastoral";

export interface EstudoTeologico {
  slug: string;
  titulo: string;
  materia: MateriaTeologica;
  resumo: string;
  corpo: string[];
  data: string;
  tempoLeituraMin: number;
}

export type CategoriaVidaSociedade =
  | "relacionamentos"
  | "politica"
  | "cultura-trabalho";

export interface ArtigoVidaSociedade {
  slug: string;
  titulo: string;
  categoria: CategoriaVidaSociedade;
  resumo: string;
  corpo: string[];
  data: string;
  tempoLeituraMin: number;
}

export interface Subscriber {
  nome: string;
  email: string;
  faixaEtaria: FaixaEtaria;
  denominacao?: string;
  trilha: "devocionais" | "estudos" | "ambos";
  criadoEm: string;
}
