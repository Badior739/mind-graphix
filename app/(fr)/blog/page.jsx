import { articles } from "@/lib/pages";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `Blog | ${SITE.name}`,
  description: "Conseils simples pour créer un site, une application ou des visuels pour votre activité.",
  alternates: { canonical: "/blog" },
};

const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPage() {
  return (
    <div className="page-x pb-24 pt-14 sm:pb-32 sm:pt-20">
      <h1 className="max-w-3xl text-[clamp(2.6rem,6vw,5rem)]">Le blog.</h1>
      <p className="mt-6 max-w-xl text-xl text-ink/80">Des conseils concrets pour réussir votre présence en ligne.</p>
      <ul className="mt-14 divide-y divide-ink/15 border-y border-ink/15">
        {articles.map((a) => (
          <li key={a.slug}>
            <a href={`/blog/${a.slug}`} className="group block py-8">
              <p className="text-sm font-semibold text-ink/60">
                {fmt.format(new Date(a.date))} · {a.read} de lecture
              </p>
              <h2 className="mt-2 text-2xl transition-colors group-hover:text-orange-deep sm:text-3xl">{a.title}</h2>
              <p className="mt-2 max-w-2xl text-ink/75">{a.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
