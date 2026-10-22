import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

function secret() {
  const s = process.env.AUTH_SECRET || (process.env.NODE_ENV !== "production" ? "dev-only-secret-change-me-0123456789abcdef" : "");
  if (s.length < 32) throw new Error("AUTH_SECRET manquant ou trop court (32 caractères minimum).");
  return s;
}

export const hmac = (label, value) => createHmac("sha256", secret()).update(`${label}|${value}`).digest("hex");

export function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export const randomCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

// Empreinte non réversible de l'adresse IP : jamais l'IP elle-même dans la base.
export const ipHash = (ip) => hmac("ip", ip || "inconnue").slice(0, 24);
export const emailHash = (email) => hmac("email", email).slice(0, 24);

// Visiteur anonyme : change chaque jour, impossible à suivre d'un jour à l'autre.
export function visitorId(ip, ua) {
  const day = new Date().toISOString().slice(0, 10);
  return hmac(`visitor|${day}`, `${ip}|${ua}`).slice(0, 20);
}
