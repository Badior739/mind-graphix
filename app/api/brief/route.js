// Reçoit le brief envoyé depuis la boîte de dialogue de devis.
//
// Le visiteur est de toute façon envoyé vers WhatsApp : cette route garde une trace du brief
// dans la base (espace de gestion, onglet « Demandes »).
// Facultatif : transmettre aussi chaque brief à une autre API, avec dans Vercel :
//   MGS_ADMIN_API_URL  : adresse de l'API qui reçoit les demandes (méthode POST, JSON)
//   MGS_ADMIN_API_KEY  : clé secrète envoyée en « Authorization: Bearer … » (facultatif)
import { query } from "@/lib/server/db";
import { clientInfo, hit, sameOrigin } from "@/lib/server/request";

const clean = (value, max) =>
  typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : "";

const cleanList = (value, maxItems, maxLen) =>
  Array.isArray(value) ? value.slice(0, maxItems).map((v) => clean(v, maxLen)).filter(Boolean) : [];

export async function POST(request) {
  if (!sameOrigin(request.headers)) return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  const info = clientInfo(request.headers);
  if (!hit(`brief:${info.ipHash}`, 6, 10 * 60_000)) {
    return Response.json({ ok: false, error: "too_many" }, { status: 429 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Champ piège : un humain ne le remplit jamais.
  if (clean(body?.company, 100)) return Response.json({ ok: true, forwarded: false });

  const brief = {
    lang: body?.lang === "en" ? "en" : "fr",
    name: clean(body?.name, 80),
    phone: clean(body?.phone, 30),
    projects: cleanList(body?.projects, 5, 60),
    needs: cleanList(body?.needs, 12, 80),
    delay: clean(body?.delay, 60),
    message: clean(body?.message, 1500),
  };

  if (!brief.name || brief.projects.length === 0) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  let saved = false;
  try {
    await query(
      `INSERT INTO briefs (name, phone, projects, needs, delay, message, lang) VALUES ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7)`,
      [brief.name, brief.phone, JSON.stringify(brief.projects), JSON.stringify(brief.needs), brief.delay, brief.message, brief.lang]
    );
    saved = true;
  } catch (e) {
    console.error("[brief] enregistrement impossible :", e.message);
  }

  const target = process.env.MGS_ADMIN_API_URL;
  if (!target) return Response.json({ ok: true, saved, forwarded: false });

  try {
    const key = process.env.MGS_ADMIN_API_KEY;
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({ source: "mgs-site", receivedAt: new Date().toISOString(), ...brief }),
      signal: AbortSignal.timeout(6000),
    });
    return Response.json({ ok: true, saved, forwarded: res.ok });
  } catch {
    return Response.json({ ok: true, saved, forwarded: false });
  }
}
