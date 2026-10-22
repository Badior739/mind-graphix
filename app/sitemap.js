import { SITE } from "@/lib/site";
import { projects, articles } from "@/lib/pages";

export default function sitemap() {
  const alt = { languages: { fr: SITE.url, en: `${SITE.url}/en` } };
  return [
    { url: SITE.url, alternates: alt },
    { url: `${SITE.url}/en`, alternates: alt },
    { url: `${SITE.url}/blog` },
    ...["mentions-legales", "confidentialite", "conditions-utilisation"].map((k) => ({ url: `${SITE.url}/${k}` })),
    ...articles.map((a) => ({ url: `${SITE.url}/blog/${a.slug}`, lastModified: a.date })),
    ...projects.map((p) => ({ url: `${SITE.url}/realisations/${p.slug}` })),
  ];
}
