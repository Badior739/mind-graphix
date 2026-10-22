import Hero from "./Hero";
import Statement from "./Statement";
import Services from "./Services";
import Gallery from "./Gallery";
import Method from "./Method";
import About from "./About";
import Faq from "./Faq";
import Contact from "./Contact";
import { content } from "@/lib/content";
import { SITE } from "@/lib/site";

// Données structurées pour Google : l'agence et sa foire aux questions.
function jsonLd(lang) {
  const t = content[lang];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: SITE.name,
        url: lang === "en" ? `${SITE.url}/en` : SITE.url,
        description: t.meta.description,
        telephone: SITE.phones[0],
        areaServed: "Burkina Faso, West Africa",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bobo-Dioulasso",
          addressCountry: "BF",
        },
        logo: `${SITE.url}/images/logo.png`,
        sameAs: SITE.socials.map((so) => so.href),
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

export default function HomePage({ lang }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }}
      />
      <Hero />
      <Statement />
      <Services />
      <Gallery />
      <Method />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
