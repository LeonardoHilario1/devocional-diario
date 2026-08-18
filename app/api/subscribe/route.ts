import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import type { FaixaEtaria } from "@/lib/types";

const FAIXAS_VALIDAS: FaixaEtaria[] = ["adolescentes", "jovens", "adultos", "familia"];
const TRILHAS_VALIDAS = ["devocionais", "estudos", "ambos"] as const;

const MAX_BODY_BYTES = 10_000;
const MAX_NOME_LEN = 100;
const MAX_EMAIL_LEN = 254; // limite máximo de um endereço de e-mail (RFC 5321)
const MAX_DENOMINACAO_LEN = 100;

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { erro: "Muitas tentativas. Tente novamente em alguns instantes." },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ erro: "Requisição muito grande." }, { status: 413 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body.nome !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ erro: "Nome e e-mail são obrigatórios." }, { status: 400 });
  }

  const nome = body.nome.trim().slice(0, MAX_NOME_LEN);
  const email = body.email.trim().slice(0, MAX_EMAIL_LEN);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!nome || !emailValido) {
    return NextResponse.json({ erro: "Informe um nome e um e-mail válido." }, { status: 400 });
  }

  const faixaEtaria: FaixaEtaria = FAIXAS_VALIDAS.includes(body.faixaEtaria)
    ? body.faixaEtaria
    : "adultos";

  const trilha = TRILHAS_VALIDAS.includes(body.trilha) ? body.trilha : "ambos";

  const denominacao =
    typeof body.denominacao === "string"
      ? body.denominacao.trim().slice(0, MAX_DENOMINACAO_LEN) || undefined
      : undefined;

  const resultado = await addSubscriber({
    nome,
    email,
    faixaEtaria,
    denominacao,
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
