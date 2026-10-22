"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLang } from "./LangProvider";

export default function Method() {
  const { t } = useLang();
  const m = t.method;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="methode" className="py-24 sm:py-32">
      <div className="page-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="display">{m.title}</h2>
            <p className="mt-6 max-w-md text-lg text-ink/75">{m.intro}</p>

            <div className="mt-10 rounded-[1.75rem] bg-ink p-7 text-cream">
              <h3 className="text-xl text-orange">{m.promisesTitle}</h3>
              <ul className="mt-4 space-y-3">
                {m.promises.map((p) => (
                  <li key={p} className="flex gap-3 font-semibold">
                    <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 text-orange" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div ref={ref} className="relative lg:col-span-7">
          <div className="absolute bottom-6 left-[1.35rem] top-6 w-[3px] bg-ink/12" aria-hidden="true">
            <motion.div className="h-full origin-top bg-orange" style={{ scaleY: fill }} />
          </div>

          <ol className="space-y-12">
            {m.steps.map((step, i) => (
              <li key={step.title} className="relative pl-16 sm:pl-20">
                <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-lg font-extrabold text-cream ring-8 ring-cream">
                  {i + 1}
                </span>
                <h3 className="text-[1.9rem] sm:text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-xl text-lg text-ink/75">{step.text}</p>
                <p className="mt-5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-[#F3EADD] px-5 py-2.5 text-[0.95rem]">
                  <span className="font-bold text-orange-deep">{m.getsLabel}</span>
                  <span className="font-semibold">{step.gets}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
