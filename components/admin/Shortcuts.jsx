"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const GO = {
  d: "/tableau",
  r: "/demandes",
  s: "/services",
  i: "/images",
  j: "/journal",
};

const HELP = [
  ["g puis d", "Tableau de bord"],
  ["g puis r", "Demandes"],
  ["g puis s", "Services et prix"],
  ["g puis i", "Images"],
  ["g puis j", "Journal"],
  ["g puis q", "Se déconnecter"],
  ["/", "Chercher (page Demandes)"],
  ["n", "Ajouter un élément (services, images)"],
  ["Ctrl + S", "Enregistrer (services, images)"],
  ["?", "Afficher cette aide"],
  ["Échap", "Fermer"],
];

export default function Shortcuts({ base }) {
  const router = useRouter();
  const [help, setHelp] = useState(false);
  const [pendingG, setPendingG] = useState(false);
  const timer = useRef(null);
  const armed = useRef(false);

  useEffect(() => {
    function disarm() {
      armed.current = false;
      setPendingG(false);
      clearTimeout(timer.current);
    }
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target;
      const typing = el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if (e.key === "Escape") {
        setHelp(false);
        disarm();
        if (typing) el.blur();
        return;
      }
      if (typing) return;
      if (armed.current) {
        const k = e.key.toLowerCase();
        disarm();
        if (GO[k]) {
          e.preventDefault();
          router.push(`${base}${GO[k]}`);
        } else if (k === "q") {
          e.preventDefault();
          document.getElementById("logout-form")?.requestSubmit();
        }
        return;
      }
      if (e.key === "g") {
        armed.current = true;
        setPendingG(true);
        timer.current = setTimeout(disarm, 1500);
      } else if (e.key === "?") {
        e.preventDefault();
        setHelp((h) => !h);
      } else if (e.key === "/") {
        const s = document.querySelector("[data-search]");
        if (s) {
          e.preventDefault();
          s.focus();
        }
      } else if (e.key === "n") {
        const b = document.querySelector("[data-new]");
        if (b) {
          e.preventDefault();
          b.click();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, [router, base]);

  return (
    <>
      {pendingG && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2 text-sm font-bold text-cream shadow-lg">
          g… puis d, r, s, i, j ou q
        </div>
      )}
      {help && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6" onClick={() => setHelp(false)} role="dialog" aria-modal="true" aria-label="Raccourcis clavier">
          <div className="w-full max-w-md rounded-[1.75rem] bg-cream p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl">Raccourcis clavier</h2>
            <dl className="mt-5 divide-y divide-ink/10">
              {HELP.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2.5">
                  <dt><kbd className="rounded bg-ink px-2 py-0.5 text-sm font-bold text-cream">{k}</kbd></dt>
                  <dd className="text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
