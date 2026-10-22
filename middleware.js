// Garde du site.
//
// Espace de gestion :
//  - il n'existe qu'à une adresse secrète (variable ADMIN_PATH). Le nom interne du dossier (/gestion-mgs) n'est jamais joignable ;
//  - sans « porte » (raccourci clavier + code d'accès) ni session, cette adresse répond 404, comme n'importe quelle page inconnue ;
//  - ordinateur uniquement, pas de cache, jamais indexé, politique de sécurité stricte avec jeton unique.
// La vérification complète de la session (non révoquée en base) est refaite côté serveur à chaque page et chaque action.
import { NextResponse } from "next/server";
import { COOKIE_NAME, GATE_COOKIE, adminSlug, readGate, readSession } from "@/lib/session-token";

const MOBILE = /Android|iPhone|iPad|iPod|Mobile|Windows Phone|Opera Mini/i;
const INTERNAL = "/gestion-mgs";
const isProd = process.env.NODE_ENV === "production";

const PUBLIC_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const adminCsp = (nonce) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

function notFound(request) {
  const url = request.nextUrl.clone();
  url.pathname = "/_introuvable";
  url.search = "";
  const res = NextResponse.rewrite(url);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Le nom interne n'est jamais accessible de l'extérieur.
  if (pathname === INTERNAL || pathname.startsWith(`${INTERNAL}/`)) return notFound(request);

  const slug = adminSlug();
  const isAdmin = slug && (pathname === `/${slug}` || pathname.startsWith(`/${slug}/`));

  if (!isAdmin) {
    const res = NextResponse.next();
    if (isProd) res.headers.set("Content-Security-Policy", PUBLIC_CSP);
    return res;
  }

  const sessionTok = await readSession(request.cookies.get(COOKIE_NAME)?.value);
  const gateOk = await readGate(request.cookies.get(GATE_COOKIE)?.value);
  if (!sessionTok && !gateOk) return notFound(request);

  const nonce = btoa(crypto.randomUUID());
  const csp = isProd ? adminCsp(nonce) : "";
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-nonce", nonce);
  if (csp) reqHeaders.set("content-security-policy", csp);

  const finish = (res) => {
    if (csp) res.headers.set("Content-Security-Policy", csp);
    res.headers.set("Cache-Control", "no-store, max-age=0");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    return res;
  };

  const rest = pathname.slice(slug.length + 1); // "" ou "/tableau"…
  const to = (path) => {
    const url = request.nextUrl.clone();
    url.pathname = `${INTERNAL}${path}`;
    return url;
  };

  const ua = request.headers.get("user-agent") || "";
  if (MOBILE.test(ua)) return finish(NextResponse.rewrite(to("/ordinateur"), { request: { headers: reqHeaders } }));

  // Pages internes : session obligatoire (la porte seule ne suffit que pour la page de connexion).
  if (rest !== "" && rest !== "/" && !sessionTok) {
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}`;
    url.search = "";
    return finish(NextResponse.redirect(url));
  }

  return finish(NextResponse.rewrite(to(rest === "/" ? "" : rest), { request: { headers: reqHeaders } }));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|images/|media/).*)"],
};
