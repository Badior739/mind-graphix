import "server-only";

// Envoi du code de connexion par e-mail.
//  1. SMTP (ex. Gmail avec un « mot de passe d'application ») si SMTP_HOST est défini : aucun quota gênant, aucun domaine requis.
//  2. Sinon Resend (https://resend.com) si RESEND_API_KEY est défini.
//  3. En développement (ou essai local), le code s'affiche simplement dans le terminal.
const subject = (code) => `Votre code de connexion : ${code}`;
const text = (code) =>
  `Votre code de connexion à l'espace de gestion Mind Graphix : ${code}\n\nIl est valable 10 minutes et ne fonctionne qu'une fois.\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.`;
const html = (code) =>
  `<div style="font-family:Arial,sans-serif;max-width:420px"><p>Votre code de connexion à l'espace de gestion Mind Graphix :</p><p style="font-size:34px;font-weight:700;letter-spacing:8px;margin:16px 0">${code}</p><p style="color:#555">Valable 10 minutes, utilisable une seule fois.<br>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p></div>`;

export async function sendOtpMail(to, code) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "Mind Graphix <onboarding@resend.dev>";

  if (process.env.SMTP_HOST) {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });
    await transport.sendMail({ from, to, subject: subject(code), text: text(code), html: html(code) });
    return true;
  }

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: subject(code), text: text(code), html: html(code) }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Envoi du code impossible (${res.status}).`);
    return true;
  }

  if (process.env.NODE_ENV !== "production" || process.env.MGS_LOCAL_DB === "1") {
    console.log(`\n[MGS admin] Code de connexion pour ${to} : ${code}\n`);
    return true;
  }
  throw new Error("Aucun service d'e-mail configuré (SMTP_HOST ou RESEND_API_KEY).");
}
