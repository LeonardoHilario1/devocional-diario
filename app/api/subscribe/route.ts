import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db";
import type { FaixaEtaria } from "@/lib/types";

const FAIXAS_VALIDAS: FaixaEtaria[] = ["adolescentes", "jovens", "adultos", "familia"];
const TRILHAS_VALIDAS = ["devocionais", "estudos", "ambos"] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.nome !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ erro: "Nome e e-mail são obrigatórios." }, { status: 400 });
  }

  const nome = body.nome.trim();
  const email = body.email.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!nome || !emailValido) {
    return NextResponse.json({ erro: "Informe um nome e um e-mail válido." }, { status: 400 });
  }

  const faixaEtaria: FaixaEtaria = FAIXAS_VALIDAS.includes(body.faixaEtaria)
    ? body.faixaEtaria
    : "adultos";

  const trilha = TRILHAS_VALIDAS.includes(body.trilha) ? body.trilha : "ambos";

  const resultado = await addSubscriber({
    nome,
    email,
    faixaEtaria,
    denominacao: typeof body.denominacao === "string" ? body.denominacao : undefined,
    trilha,
  });

  if (!resultado.ok) {
    return NextResponse.json({ erro: resultado.erro }, { status: 409 });
  }

  // TODO: quando integrar um provedor de e-mail marketing (Brevo, Mailchimp,
  // ConvertKit...), chame a API dele aqui para adicionar o contato à lista
  // com as tags de segmentação (faixaEtaria + trilha), além de salvar localmente.

  return NextResponse.json({ ok: true }, { status: 201 });
}
