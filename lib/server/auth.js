import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminBase } from "./admin-path";
import { randomUUID } from "node:crypto";
import { query } from "./db";
import { emailHash, hmac, randomCode, safeEqual } from "./crypto";
import { clientInfo } from "./request";
import { sendOtpMail } from "./mail";
import { COOKIE_NAME, SESSION_HOURS, readSession, signSession } from "../session-token";

const allowed = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function log(kind, ok, email, ipH, detail = "") {
  await query("INSERT INTO auth_log (email_hash, kind, ok, ip_hash, detail) VALUES ($1,$2,$3,$4,$5)", [
    email ? emailHash(email) : null,
    kind,
    ok,
    ipH,
    detail.slice(0, 120),
  ]).catch(() => {});
}

const count = async (sql, params) => Number((await query(sql, params))[0]?.n || 0);

// Étape 1 : envoi du code. La réponse est identique que l'adresse soit autorisée ou non.
export async function requestCode(rawEmail) {
  const info = clientInfo(await headers());
  const email = String(rawEmail || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    await sleep(300);
    return { ok: true };
  }
  const eh = emailHash(email);

  const byEmail = await count(
    `SELECT count(*) n FROM auth_log WHERE kind='otp_request' AND email_hash=$1 AND ts > now() - interval '15 minutes'`,
    [eh]
  );
  const byIp = await count(
    `SELECT count(*) n FROM auth_log WHERE kind='otp_request' AND ip_hash=$1 AND ts > now() - interval '1 hour'`,
    [info.ipHash]
  );
  if (byEmail >= 3 || byIp >= 8) {
    await log("otp_request", false, email, info.ipHash, "rate_limited");
    return { ok: true };
  }

  if (!allowed().includes(email)) {
    await log("otp_request", false, email, info.ipHash, "not_allowed");
    await sleep(400 + Math.random() * 300);
    return { ok: true };
  }

  const code = randomCode();
  await query("UPDATE otp_codes SET used = true WHERE email = $1 AND used = false", [email]);
  await query("INSERT INTO otp_codes (email, code_hash, expires_at) VALUES ($1,$2, now() + interval '10 minutes')", [
    email,
    hmac("otp", `${email}|${code}`),
  ]);
  try {
    await sendOtpMail(email, code);
    await log("otp_request", true, email, info.ipHash, "sent");
  } catch (e) {
    await log("otp_request", false, email, info.ipHash, "mail_error");
    console.error("[MGS admin] envoi du code :", e.message);
  }
  return { ok: true };
}

// Étape 2 : vérification du code, création de la session.
export async function verifyCode(rawEmail, rawCode) {
  const info = clientInfo(await headers());
  const email = String(rawEmail || "").trim().toLowerCase();
  const code = String(rawCode || "").replace(/\s/g, "");
  const fail = { ok: false, error: "Code incorrect ou expiré." };

  const recentFails = await count(
    `SELECT count(*) n FROM auth_log WHERE kind='otp_verify' AND ok=false AND ip_hash=$1 AND ts > now() - interval '15 minutes'`,
    [info.ipHash]
  );
  if (recentFails >= 10) {
    return { ok: false, error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }
  if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(code) || !allowed().includes(email)) {
    await log("otp_verify", false, email, info.ipHash, "invalid_input");
    await sleep(300);
    return fail;
  }

  const rows = await query(
    `SELECT id, code_hash FROM otp_codes WHERE email=$1 AND used=false AND expires_at > now() ORDER BY id DESC LIMIT 1`,
    [email]
  );
  if (!rows.length) {
    await log("otp_verify", false, email, info.ipHash, "no_code");
    return fail;
  }
  const otp = rows[0];
  const attempt = await query("UPDATE otp_codes SET attempts = attempts + 1 WHERE id=$1 RETURNING attempts", [otp.id]);
  if (Number(attempt[0].attempts) > 5) {
    await query("UPDATE otp_codes SET used = true WHERE id=$1", [otp.id]);
    await log("otp_verify", false, email, info.ipHash, "too_many_attempts");
    return fail;
  }
  if (!safeEqual(otp.code_hash, hmac("otp", `${email}|${code}`))) {
    await log("otp_verify", false, email, info.ipHash, "wrong_code");
    return fail;
  }
  const consumed = await query("UPDATE otp_codes SET used = true WHERE id=$1 AND used=false RETURNING id", [otp.id]);
  if (!consumed.length) return fail;

  const sid = randomUUID();
  await query(
    `INSERT INTO sessions (id, email, expires_at, ip_hash, ua) VALUES ($1,$2, now() + make_interval(hours => $3::int), $4, $5)`,
    [sid, email, SESSION_HOURS, info.ipHash, info.ua.slice(0, 200)]
  );
  const jar = await cookies();
  jar.set(COOKIE_NAME, await signSession(sid), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
  await log("otp_verify", true, email, info.ipHash, "login");
  return { ok: true };
}

// Session valide = jeton signé + session non révoquée en base + adresse toujours autorisée.
export async function getSession() {
  const jar = await cookies();
  const tok = await readSession(jar.get(COOKIE_NAME)?.value);
  if (!tok) return null;
  const rows = await query(
    "SELECT id, email FROM sessions WHERE id=$1 AND revoked=false AND expires_at > now()",
    [tok.sid]
  );
  if (!rows.length || !allowed().includes(rows[0].email)) return null;
  return { sid: rows[0].id, email: rows[0].email };
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect(adminBase());
  return s;
}

// Pour les actions : jamais de redirection, une erreur claire.
export async function assertAdmin() {
  const s = await getSession();
  if (!s) throw new Error("Session expirée. Reconnectez-vous.");
  return s;
}

export async function endSession() {
  const s = await getSession().catch(() => null);
  if (s) await query("UPDATE sessions SET revoked = true WHERE id=$1", [s.sid]);
  (await cookies()).delete(COOKIE_NAME);
}

export async function revokeAllSessions() {
  await query("UPDATE sessions SET revoked = true WHERE revoked = false");
  (await cookies()).delete(COOKIE_NAME);
}
