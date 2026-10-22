"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";

// Maquettes dessinées en code : décoratives, sans capture d'écran ni chiffre inventé.
// Les tailles utilisent des unités de conteneur (cqw) pour rester lisibles à toutes les largeurs.

export function WebMockup() {
  const { t } = useLang();
  const m = t.services.mockup.web;
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden rounded-2xl bg-cream text-ink shadow-[0_40px_90px_-35px_rgba(21,22,27,0.75)] ring-1 ring-ink/10 [container-type:inline-size]"
    >
      <div className="flex items-center gap-[1.6cqw] border-b border-ink/10 bg-white px-[3.5cqw] py-[2.4cqw]">
        <span className="h-[1.9cqw] w-[1.9cqw] rounded-full bg-ink/20" />
        <span className="h-[1.9cqw] w-[1.9cqw] rounded-full bg-ink/20" />
        <span className="h-[1.9cqw] w-[1.9cqw] rounded-full bg-ink/20" />
        <span className="ml-[2cqw] flex-1 rounded-full bg-ink/5 px-[3cqw] py-[0.8cqw] text-[2.4cqw] font-medium text-ink/55">
          {m.url}
        </span>
      </div>

      <div className="p-[5cqw]">
        <div className="flex items-center justify-between">
          <span className="h-[5cqw] w-[5cqw] rounded-[1.2cqw] bg-orange" />
          <span className="flex gap-[2.4cqw]">
            <span className="h-[1cqw] w-[7cqw] rounded-full bg-ink/20" />
            <span className="h-[1cqw] w-[7cqw] rounded-full bg-ink/20" />
            <span className="h-[1cqw] w-[7cqw] rounded-full bg-ink/20" />
          </span>
        </div>

        <div className="mt-[5cqw] grid grid-cols-5 items-center gap-[4cqw]">
          <div className="col-span-3">
            <p className="text-[5.4cqw] font-extrabold leading-[1.05] tracking-tight">{m.title}</p>
            <span className="mt-[2.4cqw] block h-[1cqw] w-4/5 rounded-full bg-ink/15" />
            <span className="mt-[1.4cqw] block h-[1cqw] w-3/5 rounded-full bg-ink/15" />
            <span className="mt-[3.6cqw] inline-block rounded-full bg-orange px-[3.2cqw] py-[1.5cqw] text-[2.5cqw] font-bold">
              {m.cta}
            </span>
          </div>
          <div className="col-span-2 flex h-[22cqw] items-end justify-end overflow-hidden rounded-[2cqw] bg-ink p-[2.4cqw]">
            <span className="block h-[10cqw] w-[10cqw] rotate-[-40deg] border-t-[1.9cqw] border-orange" />
          </div>
        </div>

        <div className="mt-[4.4cqw] grid grid-cols-3 gap-[2.4cqw]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-[1.6cqw] bg-white p-[2.4cqw] ring-1 ring-ink/10">
              <span className="block h-[3.4cqw] w-[3.4cqw] rounded bg-ink/10" />
              <span className="mt-[2cqw] block h-[1cqw] w-full rounded-full bg-ink/15" />
              <span className="mt-[1.2cqw] block h-[1cqw] w-2/3 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup() {
  const { t } = useLang();
  const m = t.services.mockup.phone;
  return (
    <div aria-hidden="true" className="w-full [container-type:inline-size]">
      <div
        className="bg-cream p-[3.2cqw] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
        style={{ borderRadius: "14cqw" }}
      >
        <div className="bg-ink p-[6cqw] pb-[7cqw] text-cream" style={{ borderRadius: "11cqw" }}>
          <span className="mx-auto block h-[2cqw] w-[24cqw] rounded-full bg-cream/25" />
          <div className="mt-[7cqw] flex items-center justify-between">
            <p className="text-[8.4cqw] font-extrabold">{m.title}</p>
            <span className="rounded-full bg-orange px-[3.4cqw] py-[1cqw] text-[4.8cqw] font-bold text-ink">
              {m.badge}
            </span>
          </div>
          <ul className="mt-[5cqw] space-y-[3.4cqw]">
            {m.statuses.map((status, i) => (
              <li
                key={i}
                className="flex items-center gap-[3cqw] bg-cream/10 p-[3.6cqw]"
                style={{ borderRadius: "5cqw" }}
              >
                <span className="h-[11cqw] w-[11cqw] shrink-0 rounded-[3cqw] bg-orange/90" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[5.6cqw] font-bold">{m.client}</span>
                  <span className="mt-[1.6cqw] block h-[1.4cqw] w-3/4 rounded-full bg-cream/25" />
                </span>
                <span className="text-[4.4cqw] font-semibold text-cream/70">{status}</span>
              </li>
            ))}
          </ul>
          <div className="mt-[6cqw] flex justify-around">
            <span className="h-[2.2cqw] w-[2.2cqw] rounded-full bg-orange" />
            <span className="h-[2.2cqw] w-[2.2cqw] rounded-full bg-cream/30" />
            <span className="h-[2.2cqw] w-[2.2cqw] rounded-full bg-cream/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrandMockup({ className = "" }) {
  const { t } = useLang();
  const quote = t.gallery.posters.find((p) => p.id === "quote");
  const know = t.gallery.posters.find((p) => p.id === "didyouknow");
  return (
    <div className={`relative mx-auto aspect-[1/0.92] w-full max-w-[32rem] ${className}`}>
      <div className="absolute left-0 top-[8%] w-[56%] -rotate-6">
        <Image
          src={quote.src}
          alt={quote.alt}
          width={1254}
          height={1254}
          sizes="280px"
          className="h-auto w-full rounded-[3%] shadow-[0_26px_55px_-24px_rgba(21,22,27,0.7)]"
        />
      </div>
      <div className="absolute right-0 top-0 w-[56%] rotate-[5deg]">
        <Image
          src={know.src}
          alt={know.alt}
          width={1254}
          height={1254}
          sizes="280px"
          className="h-auto w-full rounded-[3%] shadow-[0_26px_55px_-24px_rgba(21,22,27,0.7)]"
        />
      </div>
      <div className="absolute bottom-0 left-[22%] flex w-[40%] items-center justify-center rounded-2xl bg-cream p-5 ring-1 ring-ink/10">
        <Image
          src="/images/logo-mark.png"
          alt="Mind Graphix Solution"
          width={492}
          height={535}
          sizes="160px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
