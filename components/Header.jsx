"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "motion/react";
import Logo from "./Logo";
import { useLang } from "./LangProvider";
import { useQuote } from "./QuoteProvider";

export default function Header() {
  const { t, lang } = useLang();
  const { openQuote } = useQuote();
  const h = t.header;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Sur les pages internes (blog, réalisations), les liens d'ancre pointent vers l'accueil.
  const home = lang === "en" ? "/en" : "/";
  const onHome = pathname === "/" || pathname === "/en";
  const link = (href) => (onHome ? href : `${home === "/" ? "" : home}/${href}`);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md">
      <div className="page-x flex h-[72px] items-center justify-between">
        <a href={onHome ? "#" : home} aria-label={h.home}>
          <Logo />
        </a>

        <nav aria-label={h.mainNav} className="hidden items-center gap-7 xl:flex">
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={link(item.href)}
              className="text-[0.95rem] font-semibold text-ink/75 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          {onHome && <a
            href={h.other.href}
            hrefLang={h.other.lang}
            lang={h.other.lang}
            aria-label={h.other.aria}
            className="rounded-full border border-ink/25 px-3 py-1.5 text-sm font-bold transition-colors hover:bg-ink hover:text-cream"
          >
            {h.other.label}
          </a>}
          <button type="button" onClick={() => openQuote()} className="btn btn-ink !py-2.5">
            {h.cta}
          </button>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 xl:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? h.menuClose : h.menuOpen}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform duration-200 ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 bg-ink transition-transform duration-200 ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <motion.div
        aria-hidden="true"
        className="h-[3px] origin-left bg-orange"
        style={{ scaleX: progress }}
      />

      {open && (
        <nav id="menu-mobile" aria-label={h.mainNav} className="border-t border-ink/10 bg-cream xl:hidden">
          <div className="page-x flex flex-col py-3">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={link(item.href)}
                onClick={() => setOpen(false)}
                className="border-b border-ink/10 py-4 text-xl font-extrabold"
              >
                {item.label}
              </a>
            ))}
            {onHome && <a
              href={h.other.href}
              hrefLang={h.other.lang}
              lang={h.other.lang}
              className="border-b border-ink/10 py-4 text-xl font-extrabold"
            >
              {h.other.aria}
            </a>}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openQuote();
              }}
              className="btn btn-orange mt-4"
            >
              {h.cta}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
