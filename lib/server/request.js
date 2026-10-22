import "server-only";
import { ipHash } from "./crypto";

export function clientInfo(headers) {
  const fwd = headers.get("x-forwarded-for") || "";
  const ip = (headers.get("x-real-ip") || fwd.split(",")[0] || "").trim();
  const ua = (headers.get("user-agent") || "").slice(0, 300);
  return { ip, ua, ipHash: ipHash(ip) };
}

// Refuse les requêtes envoyées depuis un autre site.
// Les navigateurs modernes envoient Sec-Fetch-Site ; à défaut, on compare Origin puis Referer à l'hôte du site.
export function sameOrigin(headers) {
  const fetchSite = headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";
  const host = headers.get("x-forwarded-host") || headers.get("host");
  const from = headers.get("origin") || headers.get("referer");
  if (!from || !host) return false;
  try {
    return new URL(from).host === host;
  } catch {
    return false;
  }
}

export const isBot = (ua) => !ua || /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python|axios|node-fetch/i.test(ua);

export function deviceOf(ua) {
  if (/ipad|tablet/i.test(ua)) return "tablette";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  return "ordinateur";
}

// Limiteur en mémoire (complète les limites enregistrées en base).
const buckets = new Map();
export function hit(key, max, windowMs) {
  const now = Date.now();
  const list = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  buckets.set(key, list);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.length || now - v[v.length - 1] > windowMs) buckets.delete(k);
  return list.length <= max;
}
