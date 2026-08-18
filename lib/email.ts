import { Resend } from "resend";
import { siteConfig } from "./site-config";

// Verso de boas-vindas fixo (independe do devocional do dia — é o que todo
// novo inscrito recebe assim que se cadastra). Troque à vontade.
const VERSICULO_BOAS_VINDAS = {
  texto:
    "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
  referencia: "Mateus 11:28",
};

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function buildWelcomeEmailHtml(nome: string): string {
  const primeiroNome = nome.trim().split(/\s+/)[0] || nome;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0; padding:0; background-color:#faf7f2; font-family: Georgia, 'Times New Roman', serif; color:#2b2620;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:12px; overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <p style="margin:0 0 4px 0; font-size:13px; letter-spacing:0.05em; text-transform:uppercase; color:#af7530; font-family: Arial, sans-serif;">
                  ${siteConfig.nome}
                </p>
                <h1 style="margin:0 0 20px 0; font-size:24px; line-height:1.3;">
                  Bem-vindo(a), ${primeiroNome}!
                </h1>
                <p style="margin:0 0 20px 0; font-size:16px; line-height:1.6;">
                  Seu cadastro foi confirmado. A partir de agora você faz parte de quem recebe
                  reflexões diárias sobre fé e vida cristã do ${siteConfig.nome}.
                </p>
                <blockquote style="margin:0 0 20px 0; padding:16px 20px; background-color:#fbf5ec; border-left:4px solid #af7530; border-radius:4px; font-style:italic; font-size:16px; line-height:1.6;">
                  "${VERSICULO_BOAS_VINDAS.texto}"
                  <br />
                  <span style="font-style:normal; font-size:13px; color:#8c5c26; font-family: Arial, sans-serif;">
                    ${VERSICULO_BOAS_VINDAS.referencia}
                  </span>
                </blockquote>
                <p style="margin:0 0 24px 0; font-size:16px; line-height:1.6;">
                  Enquanto isso, já dá pra conhecer o site e ler o devocional de hoje:
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                  <tr>
                    <td style="border-radius:8px; background-color:#af7530;">
                      <a href="${siteConfig.url}"
                         style="display:inline-block; padding:12px 24px; font-family: Arial, sans-serif; font-size:14px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:8px;">
                        Visitar o site
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0; font-size:13px; line-height:1.6; color:#6b6459; font-family: Arial, sans-serif;">
                  ${siteConfig.autor.bio}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}

function buildWelcomeEmailText(nome: string): string {
  const primeiroNome = nome.trim().split(/\s+/)[0] || nome;
  return [
    `Bem-vindo(a), ${primeiroNome}!`,
    "",
    `Seu cadastro no ${siteConfig.nome} foi confirmado.`,
    "",
    `"${VERSICULO_BOAS_VINDAS.texto}" — ${VERSICULO_BOAS_VINDAS.referencia}`,
    "",
    `Visite o site: ${siteConfig.url}`,
    "",
    siteConfig.autor.bio,
  ].join("\n");
}

/**
 * Envia o e-mail de boas-vindas a um novo inscrito. Não lança erro — se o
 * envio falhar (ou o Resend não estiver configurado), só registra um aviso
 * no log, porque o cadastro em si já foi salvo no banco e não deve falhar
 * por causa do e-mail.
 */
export async function sendWelcomeEmail(subscriber: {
  nome: string;
  email: string;
}): Promise<void> {
  const resend = getResendClient();
  const from = process.env.EMAIL_FROM;

  if (!resend || !from) {
    console.warn(
      "[email] RESEND_API_KEY ou EMAIL_FROM não configurados — e-mail de boas-vindas não enviado. Veja o .env.example."
    );
    return;
  }

  try {
    await resend.emails.send({
      from,
      to: subscriber.email,
      subject: `Bem-vindo(a) ao ${siteConfig.nome}`,
      html: buildWelcomeEmailHtml(subscriber.nome),
      text: buildWelcomeEmailText(subscriber.nome),
    });
  } catch (erro) {
    console.error("[email] Falha ao enviar e-mail de boas-vindas:", erro);
  }
}
