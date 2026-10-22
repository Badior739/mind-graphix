import { legalPages } from "@/lib/legal";

export function legalMetadata(key) {
  const page = legalPages[key];
  return {
    title: `${page.title} | Mind Graphix Solution`,
    description: page.description,
    alternates: { canonical: `/${key}` },
    robots: { index: true, follow: true },
  };
}

export default function LegalPage({ pageKey }) {
  const page = legalPages[pageKey];
  return (
    <article className="page-x pb-24 pt-14 sm:pb-32 sm:pt-20">
      <a href="/" className="link-line text-sm">← Accueil</a>
      <h1 className="mt-10 max-w-3xl text-[clamp(2.4rem,5.5vw,4.5rem)]">{page.title}</h1>
      <div className="mt-10 max-w-2xl space-y-10">
        {page.sections().map((s) => (
          <section key={s.h}>
            <h2 className="text-2xl sm:text-3xl">{s.h}</h2>
            <div className="mt-3 space-y-4 text-lg text-ink/80">
              {s.p?.map((para) => <p key={para}>{para}</p>)}
              {s.ul && (
                <ul className="list-disc space-y-1 pl-6 marker:text-orange">
                  {s.ul.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
              {s.after?.map((para) => <p key={para}>{para}</p>)}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
