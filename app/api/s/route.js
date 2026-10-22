// Porte d'entrée de l'espace de gestion : vérifie le code d'accès tapé au clavier (Ctrl + Alt + B),
// puis pose un cookie « porte » de 15 minutes et indique l'adresse secrète.
// Réponse volontairement sobre ; toute erreur donne la même réponse.
import { cookies } from "next/headers";
import { query } from "@/lib/server/db";
import { hmac, ipHash, safeEqual } from "@/lib/server/crypto";
import { clientInfo, hit, sameOrigin } from "@/lib/server/request";
import { GATE_COOKIE, GATE_MINUTES, adminSlug, signGate } from "@/lib/session-token";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const no = (status = 200) => Response.json({ ok: false }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  if (!sameOrigin(request.headers)) return no(403);
  const info = clientInfo(request.headers);
  if (!hit(`gate:${info.ipHash}`, 6, 10 * 60_000)) return no(429);

  let body = {};
  try {
    const raw = await request.text();
    if (raw.length < 400) body = JSON.parse(raw);
  } catch {}

  try {
    const rows = await query(
      `SELECT count(*) n FROM auth_log WHERE kind='gate' AND ok=false AND ip_hash=$1 AND ts > now() - interval '15 minutes'`,
      [info.ipHash]
    );
    if (Number(rows[0]?.n || 0) >= 6) return no(429);
  } catch {}

  const slug = adminSlug();
  const given = String(body?.code || "").trim().toLowerCase().replace(/^\/+/, "").slice(0, 80);
  const ok = Boolean(slug) && safeEqual(hmac("gate", given), hmac("gate", slug));

  query("INSERT INTO auth_log (kind, ok, ip_hash, detail) VALUES ('gate',$1,$2,$3)", [ok, info.ipHash, ok ? "gate_ok" : "gate_bad"]).catch(() => {});
  await sleep(500 + Math.random() * 300);
  if (!ok) return no();

  (await cookies()).set(GATE_COOKIE, await signGate(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: GATE_MINUTES * 60,
  });
  return Response.json({ ok: true, url: `/${slug}` }, { headers: { "Cache-Control": "no-store" } });
}
