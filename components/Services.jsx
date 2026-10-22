"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { WebMockup, PhoneMockup, BrandMockup } from "./Mockups";
import { useLang } from "./LangProvider";
import { useQuote } from "./QuoteProvider";

const POSTER = "h-auto w-full rounded-[3%] shadow-[0_30px_60px_-26px_rgba(21,22,27,0.65)]";

// Style de chaque service (les textes viennent de lib/content.js).
const LOOK = {
  web: { tone: "bg-orange text-ink", rule: "border-ink/25", cta: "btn-ink", poster: "web" },
  app: { tone: "bg-ink text-cream", rule: "border-cream/25", cta: "btn-orange", poster: "apps" },
  graphic: { tone: "bg-[#EADFCF] text-ink", rule: "border-ink/20", cta: "btn-ink", poster: null },
};

// Styles proposés dans l'espace de gestion pour les services ajoutés.
const STYLE = {
  orange: LOOK.web,
  ink: LOOK.app,
  beige: LOOK.graphic,
};

function lookOf(service) {
  return STYLE[service.style] || LOOK[service.key] || LOOK.web;
}

function usePoster(id) {
  const { t } = useLang();
  return t.fixedPosters.find((p) => p.id === id);
}

// Visuel d'un service ajouté : l'image choisie dans l'espace de gestion.
function CustomVisual({ src, alt }) {
  if (!src) return null;
  return (
    <div className="relative mx-auto aspect-[1/0.98] w-full max-w-[32rem]">
      <div className="absolute right-[8%] top-0 w-[72%] rotate-[3deg]">
        <Image src={src} alt={alt} width={1254} height={1254} sizes="360px" unoptimized className={POSTER} />
      </div>
    </div>
  );
}

function Prices({ service, from, rule, compact }) {
  if (!service.prices.length && !service.priceNote) return null;
  return (
    <div className={`${compact ? "mt-4" : "mt-6"} flex flex-wrap gap-x-8 gap-y-3`}>
      {service.prices.map((p) => (
        <p key={p.label} className="leading-tight">
          <span className="block text-sm font-semibold opacity-75">
            {p.label} · {from}
          </span>
          <span className={`${compact ? "text-xl" : "text-2xl"} font-extrabold`}>{p.value}</span>
        </p>
      ))}
      {service.priceNote && <p className={`text-sm font-semibold opacity-75 ${rule}`}>{service.priceNote}</p>}
    </div>
  );
}

/* ---------- Ordinateur : panneaux empilés ---------- */

function DesktopVisual({ k, image, title }) {
  const web = usePoster("web");
  const apps = usePoster("apps");

  if (image) return <CustomVisual src={image} alt={title} />;
  if (k === "web") {
    return (
      <div className="relative mx-auto aspect-[1/0.98] w-full max-w-[32rem]">
        <div className="absolute right-0 top-0 w-[58%] rotate-[4deg]">
          <Image src={web.src} alt={web.alt} width={1254} height={1254} sizes="300px" className={POSTER} />
        </div>
        <div className="absolute bottom-0 left-0 w-[78%]">
          <WebMockup />
        </div>
      </div>
    );
  }
  if (k === "app") {
    return (
      <div className="relative mx-auto aspect-[1/0.98] w-full max-w-[32rem]">
        <div className="absolute right-0 top-0 w-[62%] rotate-[4deg]">
          <Image src={apps.src} alt={apps.alt} width={1254} height={1254} sizes="310px" className={POSTER} />
        </div>
        <div className="absolute bottom-0 left-[3%] w-[37%] -rotate-[3deg]">
          <PhoneMockup />
        </div>
      </div>
    );
  }
  if (k === "graphic") return <BrandMockup />;
  return null;
}

function Panel({ service, index, total, progress, reduce, from }) {
  const { openQuote } = useQuote();
  const look = lookOf(service);
  const last = index === total - 1;
  const scale = useTransform(progress, [index / total, (index + 1) / total], [1, reduce || last ? 1 : 0.94]);

  return (
    <div className="sticky" style={{ top: `${88 + index * 18}px` }}>
      <motion.article
        style={{ scale, transformOrigin: "50% 0%" }}
        className={`grid min-h-[min(36rem,calc(100svh-190px))] grid-cols-12 items-center gap-12 rounded-[2rem] p-14 ${look.tone}`}
      >
        <div className="col-span-6">
          <h3 className="text-[clamp(2.4rem,4.2vw,3.9rem)]">{service.title}</h3>
          <p className="mt-6 max-w-md text-lg opacity-85">{service.text}</p>
          <ul className={`mt-8 max-w-md border-t ${look.rule}`}>
            {service.items.map((item) => (
              <li key={item} className={`border-b py-3 font-semibold ${look.rule}`}>
                {item}
              </li>
            ))}
          </ul>
          <Prices service={service} from={from} />
          <button type="button" onClick={() => openQuote(service.key)} className={`btn mt-8 ${look.cta}`}>
            {service.cta}
          </button>
        </div>
        <div className="col-span-6 flex items-center justify-center">
          <DesktopVisual k={service.key} image={service.image} title={service.title} />
        </div>
      </motion.article>
    </div>
  );
}

function DesktopServices({ items, from }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="mt-14 hidden space-y-10 lg:block">
      {items.map((s, i) => (
        <Panel key={s.key} service={s} index={i} total={items.length} progress={scrollYProgress} reduce={reduce} from={from} />
      ))}
    </div>
  );
}

/* ---------- Mobile : onglets + balayage, une seule carte à l'écran ---------- */

// Sur mobile, une seule affiche en miniature à côté du titre : la carte reste courte.
const MOBILE_POSTER = { web: "web", app: "apps", graphic: "quote" };

function MobileVisual({ k, image, title }) {
  const p = usePoster(MOBILE_POSTER[k]) || null;
  const src = image || p?.src;
  if (!src) return null;
  return (
    <div className="w-[34%] max-w-[8.5rem] shrink-0 rotate-[4deg]">
      <Image
        src={src}
        alt={image ? title : p.alt}
        width={1254}
        height={1254}
        unoptimized={Boolean(image)}
        sizes="136px"
        className="h-auto w-full rounded-[4%] shadow-[0_18px_36px_-18px_rgba(21,22,27,0.7)]"
      />
    </div>
  );
}

function MobileServices({ items, label, from }) {
  const { openQuote } = useQuote();
  const listRef = useRef(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = listRef.current;
    const first = el?.children[0];
    if (!first) return;
    const step = first.offsetWidth + 16;
    setActive(Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / step))));
  }

  function go(i) {
    const el = listRef.current;
    const child = el?.children[i];
    if (!child) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: child.offsetLeft - 20, behavior: smooth ? "smooth" : "auto" });
    setActive(i);
  }

  return (
    <div className="mt-10 lg:hidden">
      <div className="page-x">
        <div role="group" aria-label={label} className="flex gap-2 overflow-x-auto pb-1">
          {items.map((s, i) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={active === i}
              onClick={() => go(i)}
              className={`shrink-0 rounded-full border px-3.5 py-2.5 text-[0.9rem] font-bold transition-colors duration-200 ${
                active === i ? "border-ink bg-ink text-cream" : "border-ink/25 text-ink"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={listRef}
        onScroll={onScroll}
        className="relative mt-5 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-4 sm:px-8 sm:scroll-pl-8 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((s) => {
          const look = lookOf(s);
          return (
            <article
              key={s.key}
              className={`flex w-[86vw] max-w-[26rem] shrink-0 snap-start flex-col rounded-[1.75rem] p-5 ${look.tone}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="pt-1 text-[2.1rem]">{s.title}</h3>
                <MobileVisual k={s.key} image={s.image} title={s.title} />
              </div>
              <p className="mt-3 text-[0.97rem] leading-relaxed opacity-85">{s.text}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.items.map((item) => (
                  <li key={item} className={`rounded-full border px-3 py-1 text-[0.8rem] font-semibold ${look.rule}`}>
                    {item}
                  </li>
                ))}
              </ul>
              <Prices service={s} from={from} compact />
              <button type="button" onClick={() => openQuote(s.key)} className={`btn mt-5 w-full ${look.cta}`}>
                {s.cta}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLang();
  const s = t.services;

  return (
    <section id="services" className="pb-24 sm:pb-32">
      <div className="page-x">
        <h2 className="display max-w-3xl">{s.title}</h2>
      </div>
      <div className="page-x">
        <DesktopServices items={s.items} from={s.from} />
      </div>
      <MobileServices items={s.items} label={s.tabs} from={s.from} />
    </section>
  );
}
