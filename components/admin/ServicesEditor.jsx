"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { resetServicesAction, saveServicesAction } from "@/app/(admin)/gestion-mgs/actions";

const STYLES = [
  ["orange", "Orange"],
  ["ink", "Noir"],
  ["beige", "Beige"],
];
const empty = () => ({ title: "", text: "", items: [], prices: [], priceNote: "", cta: "" });
const newService = () => ({
  id: `s-${Math.random().toString(36).slice(2, 8)}`,
  style: "orange",
  image: null,
  fr: { ...empty(), cta: "Demander un devis" },
  en: { ...empty(), cta: "Request a quote" },
});

const field = "mt-1.5 w-full rounded-xl border-2 border-ink/15 bg-white px-3.5 py-2.5 outline-none focus:border-orange";

export default function ServicesEditor({ initial, customized, media }) {
  const [list, setList] = useState(initial);
  const [sel, setSel] = useState(0);
  const [lang, setLang] = useState("fr");
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pending, start] = useTransition();
  const stateRef = useRef({ list, dirty });
  stateRef.current = { list, dirty };

  const s = list[sel] || list[0];
  const L = s[lang];

  function change(next) {
    setList(next);
    setDirty(true);
    setMsg(null);
  }
  const patch = (p) => change(list.map((x, i) => (i === sel ? { ...x, ...p } : x)));
  const patchLang = (p) => patch({ [lang]: { ...s[lang], ...p } });

  function save() {
    setMsg(null);
    start(async () => {
      const r = await saveServicesAction(JSON.stringify(stateRef.current.list));
      if (r.ok) {
        setDirty(false);
        setMsg({ ok: true, text: "Enregistré. Le site est mis à jour." });
      } else setMsg({ ok: false, text: r.error });
    });
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        document.getElementById("save-services")?.click();
      }
    };
    const warn = (e) => {
      if (stateRef.current.dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", warn);
    };
  }, []);

  function move(i, d) {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
    setSel(j);
  }

  function add() {
    if (list.length >= 8) return setMsg({ ok: false, text: "8 services au maximum." });
    change([...list, newService()]);
    setSel(list.length);
  }

  function remove(i) {
    if (list.length <= 1) return setMsg({ ok: false, text: "Gardez au moins un service." });
    if (!window.confirm(`Supprimer le service « ${list[i].fr.title || "sans titre"} » ?`)) return;
    change(list.filter((_, k) => k !== i));
    setSel(Math.max(0, i - 1));
  }

  function reset() {
    if (!window.confirm("Rétablir les trois services d'origine, avec leurs textes et prix de départ ?")) return;
    start(async () => {
      const r = await resetServicesAction();
      if (r.ok) window.location.reload();
      else setMsg({ ok: false, text: r.error });
    });
  }

  const setPrice = (k, p) => patchLang({ prices: L.prices.map((x, i) => (i === k ? { ...x, ...p } : x)) });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl">Services et prix</h1>
          <p className="mt-2 text-ink/65">Modifiez les textes, les montants, ajoutez ou retirez un service. Rien n'est publié avant « Enregistrer ».</p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-sm font-bold text-orange-deep">Modifications non enregistrées</span>}
          <button id="save-services" type="button" onClick={save} disabled={pending || !dirty} className="btn btn-orange !py-3 disabled:opacity-40">
            {pending ? "Enregistrement…" : "Enregistrer"} <kbd className="ml-2 rounded bg-ink/15 px-1.5 text-xs">Ctrl S</kbd>
          </button>
        </div>
      </header>
      {msg && <p role="status" className={`rounded-xl px-4 py-3 font-semibold ${msg.ok ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>{msg.text}</p>}

      <div className="grid grid-cols-[17rem_1fr] gap-6">
        <aside className="space-y-2 self-start">
          {list.map((x, i) => (
            <div key={x.id} className={`flex items-center gap-1 rounded-2xl p-1.5 ${i === sel ? "bg-ink text-cream" : "bg-cream"}`}>
              <button type="button" onClick={() => setSel(i)} className="min-w-0 flex-1 truncate rounded-xl px-3 py-2 text-left font-bold">
                {x.fr.title || "Nouveau service"}
              </button>
              <button type="button" aria-label="Monter" onClick={() => move(i, -1)} className="rounded-lg px-1.5 py-1 hover:bg-orange hover:text-ink">↑</button>
              <button type="button" aria-label="Descendre" onClick={() => move(i, 1)} className="rounded-lg px-1.5 py-1 hover:bg-orange hover:text-ink">↓</button>
            </div>
          ))}
          <button type="button" data-new onClick={add} className="btn btn-line mt-3 w-full !py-3">+ Ajouter un service <kbd className="ml-2 rounded bg-ink/10 px-1.5 text-xs">n</kbd></button>
          {customized && <button type="button" onClick={reset} className="mt-1 w-full py-2 text-sm font-semibold text-ink/60 underline">Rétablir les services d'origine</button>}
        </aside>

        <section className="space-y-5 rounded-[1.75rem] bg-cream p-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-full bg-ink/10 p-1" role="group" aria-label="Langue">
              {[["fr", "Français"], ["en", "English"]].map(([k, n]) => (
                <button key={k} type="button" aria-pressed={lang === k} onClick={() => setLang(k)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${lang === k ? "bg-ink text-cream" : ""}`}>{n}</button>
              ))}
            </div>
            <button type="button" onClick={() => remove(sel)} className="text-sm font-bold text-red-700 underline">Supprimer ce service</button>
          </div>
          {lang === "en" && <p className="text-sm text-ink/60">Si le titre anglais est vide, la version française est affichée.</p>}

          <label className="block text-sm font-semibold">Titre
            <input className={field} value={L.title} maxLength={80} onChange={(e) => patchLang({ title: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">Description
            <textarea className={field} rows={3} maxLength={400} value={L.text} onChange={(e) => patchLang({ text: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">Ce qui est inclus <span className="font-normal text-ink/55">(une ligne par élément, 8 au maximum)</span>
            <textarea className={field} rows={5} value={L.items.join("\n")} onChange={(e) => patchLang({ items: e.target.value.split("\n").slice(0, 8) })} />
          </label>

          <fieldset>
            <legend className="text-sm font-semibold">Prix « à partir de »</legend>
            <div className="mt-2 space-y-2">
              {L.prices.map((p, k) => (
                <div key={k} className="flex gap-2">
                  <input aria-label="Intitulé" placeholder="Site vitrine" className={`${field} !mt-0 flex-1`} value={p.label} maxLength={60} onChange={(e) => setPrice(k, { label: e.target.value })} />
                  <input aria-label="Montant" placeholder="150 000 FCFA" className={`${field} !mt-0 w-52`} value={p.value} maxLength={40} onChange={(e) => setPrice(k, { value: e.target.value })} />
                  <button type="button" aria-label="Retirer ce prix" onClick={() => patchLang({ prices: L.prices.filter((_, i) => i !== k) })} className="rounded-xl px-3 font-bold text-red-700 hover:bg-red-100">✕</button>
                </div>
              ))}
              {L.prices.length < 4 && (
                <button type="button" onClick={() => patchLang({ prices: [...L.prices, { label: "", value: "" }] })} className="text-sm font-bold underline">+ Ajouter un prix</button>
              )}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold">Mention si pas de prix <span className="font-normal text-ink/55">(ex. : Sur devis)</span>
              <input className={field} value={L.priceNote} maxLength={80} onChange={(e) => patchLang({ priceNote: e.target.value })} />
            </label>
            <label className="block text-sm font-semibold">Texte du bouton
              <input className={field} value={L.cta} maxLength={40} onChange={(e) => patchLang({ cta: e.target.value })} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
            <label className="block text-sm font-semibold">Couleur de la carte
              <select className={field} value={s.style} onChange={(e) => patch({ style: e.target.value })}>
                {STYLES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold">Image du service
              <select className={field} value={s.image || ""} onChange={(e) => patch({ image: e.target.value || null })}>
                <option value="">Visuel d'origine / aucun</option>
                {media.map((m) => <option key={m.id} value={`/media/${m.id}`}>{m.name}</option>)}
              </select>
              <span className="mt-1 block text-xs font-normal text-ink/55">Ajoutez d'abord l'image dans l'onglet Images.</span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
