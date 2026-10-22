"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/tableau", label: "Tableau de bord", key: "d" },
  { href: "/demandes", label: "Demandes", key: "r" },
  { href: "/services", label: "Services et prix", key: "s" },
  { href: "/images", label: "Images", key: "i" },
  { href: "/journal", label: "Journal", key: "j" },
];

export default function Nav({ base }) {
  const path = usePathname();
  return (
    <nav aria-label="Espace de gestion" className="mt-10 space-y-1">
      {ITEMS.map((it) => {
        const active = path.endsWith(it.href) || path.includes(`${it.href}/`);
        return (
          <Link
            key={it.href} href={`${base}${it.href}`} prefetch={false} aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between rounded-xl px-4 py-3 font-semibold transition-colors ${active ? "bg-orange text-ink" : "text-cream/80 hover:bg-cream/10"}`}
          >
            {it.label}
            <kbd className={`rounded px-1.5 text-xs ${active ? "bg-ink/15" : "bg-cream/15"}`}>g {it.key}</kbd>
          </Link>
        );
      })}
    </nav>
  );
}
