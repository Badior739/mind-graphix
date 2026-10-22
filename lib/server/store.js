import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { query } from "./db";
import { content } from "../content";

/* ---------- Contenu modifiable (services, affiches) ---------- */

export async function getOverrides() {
  try {
    const rows = await query("SELECT key, value FROM site_content WHERE key IN ('services','posters')", []);
    if (!rows.length) return null;
    const out = {};
    for (const r of rows) out[r.key] = typeof r.value === "string" ? JSON.parse(r.value) : r.value;
    return out;
  } catch {
    return null; // base indisponible : le site s'affiche avec les textes d'origine
  }
}

export async function saveContent(key, value) {
  await query(
    `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, JSON.stringify(value)]
  );
}

export async function resetContent(key) {
  await query("DELETE FROM site_content WHERE key=$1", [key]);
}

const STYLE_OF = { web: "orange", app: "ink", graphic: "beige" };

const langPart = (s) => ({
  title: s.title,
  text: s.text,
  items: [...s.items],
  prices: s.prices.map((p) => ({ ...p })),
  priceNote: s.priceNote || "",
  cta: s.cta,
});

export function defaultServices() {
  return content.fr.services.items.map((s, i) => ({
    id: s.key,
    style: STYLE_OF[s.key] || "orange",
    image: null,
    fr: langPart(s),
    en: langPart(content.en.services.items[i]),
  }));
}

export function defaultPosters() {
  return content.fr.gallery.posters.map((p, i) => ({
    id: p.id,
    src: p.src,
    fr: { title: p.title, text: p.text, alt: p.alt },
    en: { title: content.en.gallery.posters[i].title, text: content.en.gallery.posters[i].text, alt: content.en.gallery.posters[i].alt },
  }));
}

/* ---------- Validation stricte de ce que l'interface envoie ---------- */

const str = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "");
const list = (v, n, max) => (Array.isArray(v) ? v.slice(0, n).map((x) => str(x, max)).filter(Boolean) : []);
const ID_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
const MEDIA_RE = /^\/media\/[0-9a-f-]{36}$/;

function cleanLang(l, withExtras = true) {
  l = l && typeof l === "object" ? l : {};
  const out = { title: str(l.title, 80), text: str(l.text, 400) };
  if (withExtras) {
    out.items = list(l.items, 8, 120);
    out.prices = (Array.isArray(l.prices) ? l.prices.slice(0, 4) : [])
      .map((p) => ({ label: str(p?.label, 60), value: str(p?.value, 40) }))
      .filter((p) => p.label && p.value);
    out.priceNote = str(l.priceNote, 80);
    out.cta = str(l.cta, 40);
  }
  return out;
}

export function validateServices(input) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 8) throw new Error("Entre 1 et 8 services.");
  const seen = new Set();
  return input.map((s) => {
    const id = str(s?.id, 41);
    if (!ID_RE.test(id) || seen.has(id)) throw new Error("Identifiant de service invalide.");
    seen.add(id);
    const fr = cleanLang(s.fr);
    if (!fr.title) throw new Error("Chaque service doit avoir un titre en français.");
    const style = ["orange", "ink", "beige"].includes(s.style) ? s.style : "orange";
    const image = typeof s.image === "string" && MEDIA_RE.test(s.image) ? s.image : null;
    return { id, style, image, fr, en: cleanLang(s.en) };
  });
}

export function validatePosters(input) {
  if (!Array.isArray(input) || input.length > 30) throw new Error("30 images au maximum.");
  const seen = new Set();
  return input.map((p) => {
    const id = str(p?.id, 41);
    if (!ID_RE.test(id) || seen.has(id)) throw new Error("Identifiant d'image invalide.");
    seen.add(id);
    const src = str(p?.src, 80);
    if (!(MEDIA_RE.test(src) || /^\/images\/[a-z0-9-]+\.webp$/.test(src))) throw new Error("Source d'image invalide.");
    const fr = cleanLang(p.fr, false);
    fr.alt = str(p.fr?.alt, 200);
    const en = cleanLang(p.en, false);
    en.alt = str(p.en?.alt, 200);
    if (!fr.title) throw new Error("Chaque image doit avoir un titre.");
    return { id, src, fr, en };
  });
}

/* ---------- Images (stockées dans la base, re-encodées en WebP) ---------- */

export async function saveImage(buffer, originalName) {
  if (buffer.length > 3 * 1024 * 1024) throw new Error("Image trop lourde (3 Mo maximum).");
  const img = sharp(buffer, { limitInputPixels: 40_000_000, failOn: "error" });
  const meta = await img.metadata();
  if (!["jpeg", "png", "webp"].includes(meta.format)) throw new Error("Formats acceptés : JPG, PNG, WebP.");
  const data = await img
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const id = randomUUID();
  const name = str(originalName, 80).replace(/\.[a-z0-9]+$/i, "") || "image";
  await query("INSERT INTO media (id, name, mime, data, bytes) VALUES ($1,$2,'image/webp',decode($3,'hex'),$4)", [id, name, data.toString("hex"), data.length]);
  return { id, name, bytes: data.length };
}

export const listMedia = () => query("SELECT id, name, bytes, created_at FROM media ORDER BY created_at DESC LIMIT 200", []);

export async function getMedia(id) {
  const rows = await query("SELECT mime, data FROM media WHERE id=$1", [id]);
  if (!rows[0]) return null;
  let data = rows[0].data;
  if (typeof data === "string") data = Buffer.from(data.replace(/^\\x/, ""), "hex");
  else data = Buffer.from(data);
  return { mime: rows[0].mime, data };
}

export async function deleteMedia(id) {
  await query("DELETE FROM media WHERE id=$1", [id]);
  const src = `/media/${id}`;
  // Retire l'image des services et de la galerie qui l'utilisaient.
  const o = await getOverrides();
  if (o?.posters) await saveContent("posters", o.posters.filter((p) => p.src !== src));
  if (o?.services) await saveContent("services", o.services.map((s) => (s.image === src ? { ...s, image: null } : s)));
}
