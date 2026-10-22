"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LangProvider";
import { lockScroll, unlockScroll } from "@/lib/scroll";

function PosterCard({ p, hidden, onZoom, label }) {
  return (
    <figure className="w-[var(--w)] shrink-0">
      <button
        type="button"
        tabIndex={hidden ? -1 : 0}
        data-cursor={label}
        onClick={() => onZoom(p)}
        aria-label={`${label} : ${p.title}`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-[2%] text-left"
      >
        <Image
          src={p.src}
          alt={hidden ? "" : p.alt}
          width={1254}
          height={1254}
          sizes="(min-width: 1024px) 380px, 78vw"
          unoptimized={p.src.startsWith("/media/")}
          className="h-auto w-full"
        />
      </button>
      <figcaption className="mt-4">
        <span className="block font-extrabold">{p.title}</span>
        <span className="text-sm text-ink/70">{p.text}</span>
      </figcaption>
    </figure>
  );
}

function ToolCard({ tool, more }) {
  return (
    <article className="flex min-h-[calc(var(--w)+4.5rem)] w-[var(--w)] shrink-0 flex-col justify-between rounded-[1.75rem] bg-ink p-7 text-cream sm:p-8">
      <div>
        <p className="text-sm font-semibold text-orange">{tool.kind}</p>
        <h3 className="mt-3 text-3xl lg:text-[2rem]">{tool.name}</h3>
        <p className="mt-5 text-[0.98rem] text-cream/80">{tool.text}</p>
      </div>
      <div>
      <ul className="mt-8 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-cream/30 px-3.5 py-1.5 text-sm font-semibold">
            {tag}
          </li>
        ))}
      </ul>
      {tool.href && (
        <a href={tool.href} className="mt-6 inline-block font-bold text-orange underline decoration-2 underline-offset-[6px] hover:text-cream">
          {more}
        </a>
      )}
      </div>
    </article>
  );
}

// Aperçu agrandi d'une affiche (dialogue natif : Échap, focus piégé).
function ZoomDialog({ poster, onClose }) {
  const { t } = useLang();
  const ref = useRef(null);
  const locked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !poster) return;
    if (!el.open) {
      el.showModal();
      if (!locked.current) {
        lockScroll();
        locked.current = true;
      }
    }
  }, [poster]);

  useEffect(
    () => () => {
      if (locked.current) unlockScroll();
    },
    []
  );

  function handleClosed() {
    if (locked.current) {
      unlockScroll();
      locked.current = false;
    }
    onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-label={poster ? `${t.gallery.zoomLabel} : ${poster.title}` : t.gallery.zoomLabel}
      onClose={handleClosed}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="zoom-dialog m-auto max-h-[100svh] w-[min(100%-1.5rem,52rem)] max-w-none overflow-visible bg-transparent p-0"
    >
      {poster && (
        <div className="relative">
          <Image
            src={poster.src}
            alt={poster.alt}
            width={1254}
            height={1254}
            sizes="(min-width: 832px) 832px, 100vw"
            unoptimized={poster.src.startsWith("/media/")}
            className="mx-auto h-auto max-h-[92svh] w-auto max-w-full rounded-2xl object-contain"
          />
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t.gallery.zoomClose}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream text-ink shadow-lg transition-colors hover:bg-orange"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
      )}
    </dialog>
  );
}

export default function Gallery() {
  const { t } = useLang();
  const g = t.gallery;
  const [zoom, setZoom] = useState(null);

  const set = (hidden) => (
    <div className="marquee-set" aria-hidden={hidden ? "true" : undefined}>
      {g.posters.map((p) => (
        <PosterCard key={p.id} p={p} hidden={hidden} onZoom={setZoom} label={g.enlarge} />
      ))}
      {g.tools.map((tool) => (
        <ToolCard key={tool.name} tool={tool} more={g.more} />
      ))}
    </div>
  );

  return (
    <section id="creations" className="overflow-hidden bg-[#F3EADD] py-20 sm:py-28">
      <div className="page-x grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 className="display lg:col-span-7">{g.title}</h2>
        <p className="text-ink/75 lg:col-span-5">{g.text}</p>
      </div>

      {/* Ordinateur : défilement infini, mis en pause au survol */}
      <div className="marquee mt-14 hidden lg:block">
        <div className="marquee-track">
          {set(false)}
          {set(true)}
        </div>
      </div>

      {/* Mobile et tablette : balayage au doigt */}
      <div
        className="mt-10 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto px-5 pb-6 sm:scroll-pl-8 sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden [&>*]:snap-start"
        style={{ "--w": "min(78vw, 24rem)", scrollbarWidth: "none" }}
      >
        {g.posters.map((p) => (
          <PosterCard key={p.id} p={p} onZoom={setZoom} label={g.enlarge} />
        ))}
        {g.tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} more={g.more} />
        ))}
      </div>

      <ZoomDialog poster={zoom} onClose={() => setZoom(null)} />
    </section>
  );
}
