"use client";

import { useLang } from "./LangProvider";
import { useQuote } from "./QuoteProvider";
import { SITE } from "@/lib/site";

export default function Footer() {
  const { t } = useLang();
  const { openQuote } = useQuote();
  const f = t.footer;

  return (
    <footer className="overflow-hidden bg-ink text-cream">
      <div className="page-x grid gap-12 pb-10 pt-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="max-w-xl text-[clamp(1.6rem,3.2vw,2.6rem)] font-extrabold leading-tight tracking-tight">
            {f.line}
          </p>
          <button type="button" onClick={() => openQuote()} className="btn btn-orange mt-8">
            {f.cta}
          </button>
        </div>

        <nav aria-label={f.nav} className="md:col-span-5 md:justify-self-end">
          <ul className="grid grid-cols-2 gap-x-14 gap-y-3 font-semibold">
            {t.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-orange">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {f.more && (
            <ul className="mt-3 grid grid-cols-2 gap-x-14 gap-y-3 font-semibold">
              {f.more.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-orange">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-8 text-sm font-semibold text-cream/80">{f.follow}</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cream/60">
            {SITE.socials.map((so) => (
              <li key={so.name}>
                <a href={so.href} target="_blank" rel="noopener noreferrer" aria-label={`${so.name} ${so.handle}`} className="transition-colors hover:text-orange">
                  {so.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-cream/60">
            {SITE.phones.join(" / ")}
            <br />
            {SITE.city}
          </p>
        </nav>
      </div>

      <p
        aria-hidden="true"
        className="select-none whitespace-nowrap px-4 pb-[0.14em] text-center text-[clamp(2.4rem,12.4vw,12.5rem)] font-extrabold leading-none tracking-[-0.045em] text-orange"
      >
        Mind Graphix
      </p>

      <div className="border-t border-cream/15">
        <div className="page-x flex flex-col gap-2 py-6 text-sm text-cream/60 sm:flex-row sm:justify-between">
          <p>{f.rights}</p>
          {f.legal && (
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {f.legal.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-orange">{l.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
