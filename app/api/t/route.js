// Statistiques de fréquentation anonymes : pas de cookie, pas d'adresse IP conservée.
import { query } from "@/lib/server/db";
import { visitorId } from "@/lib/server/crypto";
import { clientInfo, deviceOf, hit, isBot, sameOrigin } from "@/lib/server/request";

const PATH_RE = /^\/[A-Za-z0-9\-._~\/]{0,150}$/;
const EVENTS = new Set(["quote_open", "whatsapp_click"]);
const cut = (v, n) => (typeof v === "string" ? v.replace(/[^\w.\-]/g, "").slice(0, n) : "");

export async function POST(request) {
  const h = request.headers;
  if (!sameOrigin(h)) return new Response(null, { status: 204 });
  const info = clientInfo(h);
  if (isBot(info.ua)) return new Response(null, { status: 204 });

  const raw = await request.text();
  if (raw.length > 600) return new Response(null, { status: 204 });
  let b;
  try {
    b = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 204 });
  }
  if (!PATH_RE.test(b?.path || "")) return new Response(null, { status: 204 });

  const visitor = visitorId(info.ip, info.ua);
  if (!hit(`t:${visitor}`, 40, 60_000)) return new Response(null, { status: 204 });

  try {
    if (b.type === "view") {
      const source = cut(b.utm, 30) || cut(b.ref, 60) || null;
      await query(
        "INSERT INTO visits (path, lang, visitor, country, device, source) VALUES ($1,$2,$3,$4,$5,$6)",
        [b.path, b.lang === "en" ? "en" : "fr", visitor, cut(h.get("x-vercel-ip-country") || "", 2) || null, deviceOf(info.ua), source]
      );
    } else if (EVENTS.has(b.type)) {
      await query("INSERT INTO events (type, path, visitor, label) VALUES ($1,$2,$3,$4)", [
        b.type,
        b.path,
        visitor,
        cut(b.label, 40) || null,
      ]);
    }
  } catch {
    /* les statistiques ne doivent jamais gêner le visiteur */
  }
  return new Response(null, { status: 204 });
}
