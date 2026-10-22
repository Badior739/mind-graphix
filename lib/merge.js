// Fusionne les textes par défaut (lib/content.js) avec les modifications faites dans l'espace de gestion.
// Fonction pure, sans accès à la base : les modifications sont chargées côté serveur puis transmises au site.

export const DEFAULT_SERVICE_KEYS = ["web", "app", "graphic"];

const hasText = (l) => l && typeof l.title === "string" && l.title.trim();

export function mergeContent(base, overrides, lang) {
  const t = { ...base, fixedPosters: base.gallery.posters };
  if (!overrides) return t;

  if (Array.isArray(overrides.services) && overrides.services.length) {
    const fallbackCta = base.services.items[0]?.cta || "";
    const items = overrides.services.map((s) => {
      const l = lang === "en" && hasText(s.en) ? s.en : s.fr || {};
      return {
        key: s.id,
        style: s.style || "orange",
        image: s.image || null,
        title: l.title || "",
        text: l.text || "",
        items: Array.isArray(l.items) ? l.items : [],
        prices: Array.isArray(l.prices) ? l.prices : [],
        priceNote: l.priceNote || "",
        cta: l.cta || fallbackCta,
      };
    });
    t.services = { ...base.services, items };

    // La boîte de dialogue de devis propose chaque service, y compris les nouveaux.
    const baseGroups = base.dialog.groups;
    const groups = items.map((it) => {
      const known = baseGroups.find((g) => g.key === it.key);
      return known || { key: it.key, label: it.title, options: it.items.slice(0, 6) };
    });
    t.dialog = { ...base.dialog, groups };
  }

  if (Array.isArray(overrides.posters)) {
    t.gallery = {
      ...base.gallery,
      posters: overrides.posters.map((p) => {
        const l = lang === "en" && hasText(p.en) ? p.en : p.fr || {};
        return { id: p.id, src: p.src, title: l.title || "", text: l.text || "", alt: l.alt || l.title || "" };
      }),
    };
  }
  return t;
}
