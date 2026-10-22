import { notFound } from "next/navigation";
import QuoteButton from "@/components/QuoteButton";
import { projects, findProject } from "@/lib/pages";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = findProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} : réalisation | ${SITE.name}`,
    description: p.intro,
    alternates: { canonical: `/realisations/${p.slug}` },
    openGraph: { title: `${p.name} | ${SITE.name}`, description: p.intro, url: `/realisations/${p.slug}`, type: "article" },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const p = findProject(slug);
  if (!p) notFound();
  const others = projects.filter((o) => o.slug !== p.slug);

  return (
    <article className="pb-24 pt-14 sm:pb-32 sm:pt-20">
      <div className="page-x">
        <a href="/#creations" className="link-line text-sm">← Toutes nos créations</a>
        <p className="mt-10 font-semibold text-orange-deep">{p.kind}</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2.6rem,6vw,5rem)]">{p.name}</h1>
        <p className="mt-6 max-w-2xl text-xl text-ink/80">{p.intro}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="rounded-full border border-ink/25 px-3.5 py-1.5 text-sm font-semibold">{t}</li>
          ))}
          <li className="rounded-full bg-ink px-3.5 py-1.5 text-sm font-semibold text-cream">{p.status}</li>
        </ul>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <h2 className="text-3xl">Le besoin</h2>
            <p className="mt-4 text-lg text-ink/80">{p.problem}</p>
            <h2 className="mt-12 text-3xl">Notre réponse</h2>
            {p.solution.map((para) => (
              <p key={para} className="mt-4 text-lg text-ink/80">{para}</p>
            ))}
          </section>
          <aside className="self-start rounded-[2rem] bg-ink p-8 text-cream lg:col-span-5">
            <h2 className="text-2xl">Ce que ça fait</h2>
            <ul className="mt-5 divide-y divide-cream/15 border-y border-cream/15">
              {p.points.map((pt) => (
                <li key={pt} className="py-3 font-semibold">{pt}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-20 rounded-[2rem] bg-orange p-8 sm:p-12">
          <h2 className="max-w-xl text-3xl sm:text-4xl">Un besoin proche du vôtre ?</h2>
          <p className="mt-3 max-w-xl text-lg">Expliquez-nous votre idée, nous vous répondons avec un devis clair.</p>
          <QuoteButton className="btn btn-ink mt-6">Démarrer un projet</QuoteButton>
        </div>

        <nav aria-label="Autres réalisations" className="mt-16">
          <h2 className="text-xl">Autres réalisations</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/realisations/${o.slug}`} className="btn btn-line">{o.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
