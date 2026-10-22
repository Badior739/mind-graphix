"use client";

import { useLang } from "./LangProvider";

export default function About() {
  const { t } = useLang();
  const a = t.about;

  return (
    <section id="agence" className="border-t border-ink/10 py-24 sm:py-32">
      <div className="page-x grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <h2 className="display">{a.title}</h2>
          <div className="mt-8 max-w-xl space-y-5 text-ink/80">
            <p>{a.p1}</p>
            <p>{a.p2}</p>
          </div>
        </div>

        <dl className="md:col-span-5 md:border-l md:border-ink/15 md:pl-10">
          {a.facts.map((f) => (
            <div key={f.label} className="border-b border-ink/15 py-5 first:pt-0 last:border-0">
              <dt className="text-sm font-semibold text-ink/60">{f.label}</dt>
              <dd className="mt-1 text-lg font-bold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
