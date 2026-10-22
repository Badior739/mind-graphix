import { content } from "./content";
import { SITE } from "./site";

export function buildMetadata(lang) {
  const t = content[lang];
  return {
    metadataBase: new URL(SITE.url),
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    alternates: {
      canonical: t.path,
      languages: { fr: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      title: SITE.name,
      description: t.meta.ogDescription,
      url: t.path,
      siteName: SITE.name,
      locale: t.ogLocale,
      type: "website",
    },
  };
}
