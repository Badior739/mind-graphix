"use client";

import { track } from "@/lib/track";
import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";
import { whatsappLink } from "@/lib/site";

// Bouton WhatsApp flottant : apparaît après l'introduction, se retire quand la section contact est à l'écran.
export default function WhatsAppFab() {
  const { t } = useLang();
  const [past, setPast] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const el = document.getElementById("contact");
    let io;
    if (el) {
      io = new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), { threshold: 0.12 });
      io.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (io) io.disconnect();
    };
  }, []);

  const show = past && !atContact;

  return (
    <a
      href={whatsappLink(t.fab.message)}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("whatsapp_click", { label: "bouton" })}
      tabIndex={show ? 0 : -1}
      aria-label={t.fab.aria}
      className={`fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2.5 rounded-full bg-ink py-3.5 pl-4 pr-5 text-[0.95rem] font-bold text-cream shadow-[0_18px_40px_-16px_rgba(21,22,27,0.8)] transition duration-300 hover:bg-orange hover:text-ink ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.3l-4.5 1.2z" />
        <path d="M9 9.5c.5 2.2 2.3 4 4.5 4.5l1.2-1.2-1.8-.9-.8.6a4 4 0 0 1-1.7-1.7l.6-.8-.9-1.8L9 9.5z" />
      </svg>
      {t.fab.label}
    </a>
  );
}
