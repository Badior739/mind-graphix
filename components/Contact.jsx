"use client";

import { useLang } from "./LangProvider";
import { useQuote } from "./QuoteProvider";
import { SITE, whatsappLink } from "@/lib/site";
import { track } from "@/lib/track";

export default function Contact() {
  const { t } = useLang();
  const { openQuote } = useQuote();
  const c = t.contact;

  return (
    <section id="contact" className="bg-orange py-24 text-ink sm:py-32">
      <div className="page-x grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 className="text-[clamp(2.4rem,5.4vw,4.5rem)]">{c.title}</h2>
          <p className="mt-6 max-w-md text-lg">{c.text}</p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="text-sm font-semibold">{c.phoneLabel}</dt>
              <dd className="mt-1 text-2xl font-extrabold">
                {SITE.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block w-fit hover:underline">
                    {p}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">{c.addressLabel}</dt>
              <dd className="mt-1 text-2xl font-extrabold">{SITE.city}</dd>
            </div>
          </dl>
          <ul className="mt-8 flex flex-wrap gap-3">
            {SITE.socials.map((so) => (
              <li key={so.name}>
                <a
                  href={so.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition-colors hover:bg-ink hover:text-cream"
                >
                  {so.name} <span className="ml-2 font-medium opacity-70">{so.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="self-start rounded-[2rem] bg-cream p-7 sm:p-10 lg:col-span-6">
          <h3 className="text-3xl sm:text-4xl">{c.cardTitle}</h3>
          <p className="mt-4 text-ink/75">{c.cardText}</p>
          <button type="button" onClick={() => openQuote()} className="btn btn-ink mt-8 w-full">
            {c.openBrief}
          </button>
          <p className="my-4 text-center text-sm font-semibold text-ink/55">{c.or}</p>
          <a
            href={whatsappLink(t.fab.message)}
            onClick={() => track("whatsapp_click", { label: "contact" })}
            target="_blank"
            rel="noreferrer"
            className="btn btn-line w-full"
          >
            {c.direct}
          </a>
        </div>
      </div>
    </section>
  );
}
