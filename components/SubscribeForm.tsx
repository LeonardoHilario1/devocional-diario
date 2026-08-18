"use client";

import { useState, type FormEvent } from "react";
import type { FaixaEtaria } from "@/lib/types";
import { faixaEtariaLabels } from "@/lib/site-config";

type Status = "idle" | "loading" | "sucesso" | "erro";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMensagem("");

    const form = new FormData(e.currentTarget);
    const payload = {
      nome: String(form.get("nome") || ""),
      email: String(form.get("email") || ""),
      faixaEtaria: String(form.get("faixaEtaria") || "adultos") as FaixaEtaria,
      denominacao: String(form.get("denominacao") || "") || undefined,
      trilha: String(form.get("trilha") || "ambos") as
        | "devocionais"
        | "estudos"
        | "ambos",
    };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("erro");
        setMensagem(data.erro ?? "Não foi possível concluir o cadastro.");
        return;
      }

      setStatus("sucesso");
      setMensagem("Cadastro realizado! Você vai receber o conteúdo por e-mail.");
      e.currentTarget.reset();
    } catch {
      setStatus("erro");
      setMensagem("Erro de conexão. Tente novamente em instantes.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="flex flex-col gap-1">
          <label htmlFor="nome" className="text-sm font-medium">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            required
            className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none ring-brand-400 focus:ring-2 dark:border-brand-800 dark:bg-[#1c1912]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none ring-brand-400 focus:ring-2 dark:border-brand-800 dark:bg-[#1c1912]"
          />
        </div>
      </div>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-3"}`}>
        <div className="flex flex-col gap-1">
          <label htmlFor="faixaEtaria" className="text-sm font-medium">
            Faixa etária
          </label>
          <select
            id="faixaEtaria"
            name="faixaEtaria"
            className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none ring-brand-400 focus:ring-2 dark:border-brand-800 dark:bg-[#1c1912]"
            defaultValue="adultos"
          >
            {Object.entries(faixaEtariaLabels).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="trilha" className="text-sm font-medium">
            Interesse principal
          </label>
          <select
            id="trilha"
            name="trilha"
            className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none ring-brand-400 focus:ring-2 dark:border-brand-800 dark:bg-[#1c1912]"
            defaultValue="ambos"
          >
            <option value="devocionais">Apenas Devocionais</option>
            <option value="estudos">Estudos Aprofundados</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="denominacao" className="text-sm font-medium">
            Denominação (opcional)
          </label>
          <input
            id="denominacao"
            name="denominacao"
            className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none ring-brand-400 focus:ring-2 dark:border-brand-800 dark:bg-[#1c1912]"
          />
        </div>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-fit">
        {status === "loading" ? "Enviando..." : "Quero receber por e-mail"}
      </button>

      {mensagem && (
        <p
          className={`text-sm ${
            status === "sucesso" ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensagem}
        </p>
      )}
    </form>
  );
}
