// Jeton de session (JWT signé). Utilisable côté serveur et dans le middleware.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_HOURS = 8;
export const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-mgs" : "mgs";

function key() {
  const secret = process.env.AUTH_SECRET || (process.env.NODE_ENV !== "production" ? "dev-only-secret-change-me-0123456789abcdef" : "");
  if (secret.length < 32) throw new Error("AUTH_SECRET manquant ou trop court (32 caractères minimum).");
  return new TextEncoder().encode(secret);
}

export async function signSession(sid) {
  return new SignJWT({ sid })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(key());
}

export async function readSession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return typeof payload.sid === "string" ? { sid: payload.sid } : null;
  } catch {
    return null;
  }
}

// Jeton « porte » : délivré après saisie du code d'accès (raccourci clavier), valable 15 minutes.
// Sans lui, ni la page de connexion ni aucune page de gestion ne répond (404 identique à n'importe quelle page inconnue).
export const GATE_COOKIE = process.env.NODE_ENV === "production" ? "__Host-gate" : "gate";
export const GATE_MINUTES = 15;

export async function signGate() {
  return new SignJWT({ gate: 1 })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${GATE_MINUTES}m`)
    .sign(key());
}

export async function readGate(token) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload.gate === 1;
  } catch {
    return false;
  }
}

// Chemin secret de l'espace de gestion (variable ADMIN_PATH). Non défini en production : l'espace est désactivé.
export function adminSlug() {
  const dev = process.env.NODE_ENV !== "production" || process.env.MGS_LOCAL_DB === "1";
  const s = process.env.ADMIN_PATH || (dev ? "gestion-mgs-dev" : "");
  return /^[a-z0-9][a-z0-9-]{11,60}$/.test(s) ? s : "";
}
