"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";

export default function Faq() {
  const { t } = useLang();
  const f = t.faq;
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="border-t border-ink/10 py-24 sm:py-32">
      <div className="page-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <h2 className="display lg:col-span-5">{f.title}</h2>

        <div className="lg:col-span-7">
          {f.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-ink/15 first:border-t">
                <h3 className="text-lg tracking-normal">
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left leading-snug"
                  >
                    {item.q}
                    <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-ink" />
                      <span
                        className={`absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-ink transition-transform duration-300 ${
                          isOpen ? "scale-y-0" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pb-6 text-ink/80">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
