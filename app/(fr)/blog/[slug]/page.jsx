import { notFound } from "next/navigation";
import QuoteButton from "@/components/QuoteButton";
import { articles, findArticle } from "@/lib/pages";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) return {};
  return {
    title: `${a.title} | ${SITE.name}`,
    description: a.description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { title: a.title, description: a.description, url: `/blog/${a.slug}`, type: "article", publishedTime: a.date },
  };
}

const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = findArticle(slug);
  if (!a) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <article className="page-x pb-24 pt-14 sm:pb-32 sm:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <a href="/blog" className="link-line text-sm">← Le blog</a>
      <p className="mt-10 text-sm font-semibold text-ink/60">
        {fmt.format(new Date(a.date))} · {a.read} de lecture
      </p>
      <h1 className="mt-3 max-w-3xl text-[clamp(2.2rem,5vw,4rem)]">{a.title}</h1>

      <div className="mt-10 max-w-2xl space-y-5 text-lg text-ink/85">
        {a.blocks.map((b, i) => {
          if (b.h) return <h2 key={i} className="pt-6 text-2xl sm:text-3xl">{b.h}</h2>;
          if (b.ul)
            return (
              <ul key={i} className="space-y-2 border-l-4 border-orange pl-5 font-semibold">
                {b.ul.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            );
          return <p key={i}>{b.p}</p>;
        })}
      </div>

      <div className="mt-16 max-w-2xl rounded-[2rem] bg-orange p-8 sm:p-10">
        <h2 className="text-3xl">Un projet en tête ?</h2>
        <p className="mt-3 text-lg">Décrivez-le en quelques questions, nous vous répondons avec un devis clair.</p>
        <QuoteButton className="btn btn-ink mt-6">Démarrer un projet</QuoteButton>
      </div>
    </article>
  );
}
