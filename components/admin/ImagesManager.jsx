"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteImageAction, resetPostersAction, savePostersAction, uploadImageAction } from "@/app/(admin)/gestion-mgs/actions";

const field = "mt-1 w-full rounded-lg border-2 border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-orange";
const kb = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} Mo` : `${Math.round(n / 1024)} Ko`);

export default function ImagesManager({ initial, customized, media }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pending, start] = useTransition();
  const [pick, setPick] = useState("");
  const fileRef = useRef(null);
  const stateRef = useRef({ list, dirty });
  stateRef.current = { list, dirty };

  function change(next) {
    setList(next);
    setDirty(true);
    setMsg(null);
  }
  const patch = (i, lang, p) => change(list.map((x, k) => (k === i ? { ...x, [lang]: { ...x[lang], ...p } } : x)));

  function save() {
    setMsg(null);
    start(async () => {
      const r = await savePostersAction(JSON.stringify(stateRef.current.list));
      if (r.ok) {
        setDirty(false);
        setMsg({ ok: true, text: "Enregistré. La galerie du site est mise à jour." });
      } else setMsg({ ok: false, text: r.error });
    });
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        document.getElementById("save-posters")?.click();
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
  }

  function addFromLibrary() {
    const m = media.find((x) => x.id === pick);
    if (!m) return setMsg({ ok: false, text: "Choisissez d'abord une image de la bibliothèque." });
    if (list.length >= 30) return setMsg({ ok: false, text: "30 images au maximum." });
    change([
      ...list,
      {
        id: `m-${m.id.slice(0, 8)}-${Math.random().toString(36).slice(2, 5)}`,
        src: `/media/${m.id}`,
        fr: { title: m.name, text: "", alt: m.name },
        en: { title: "", text: "", alt: "" },
      },
    ]);
  }

  function upload(files) {
    const file = files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return setMsg({ ok: false, text: "Image trop lourde (3 Mo maximum)." });
    const fd = new FormData();
    fd.set("file", file);
    setMsg(null);
    start(async () => {
      const r = await uploadImageAction(fd);
      if (fileRef.current) fileRef.current.value = "";
      if (r.ok) {
        setPick(r.id);
        setMsg({ ok: true, text: "Image ajoutée à la bibliothèque. Ajoutez-la ensuite à la galerie." });
        router.refresh();
      } else setMsg({ ok: false, text: r.error });
    });
  }

  function removeMedia(m) {
    if (!window.confirm(`Supprimer l'image « ${m.name} » ? Elle sera aussi retirée de la galerie et des services qui l'utilisent.`)) return;
    start(async () => {
      const r = await deleteImageAction(m.id);
      if (r.ok) {
        setList((l) => l.filter((p) => p.src !== `/media/${m.id}`));
        router.refresh();
      } else setMsg({ ok: false, text: r.error });
    });
  }

  function reset() {
    if (!window.confirm("Rétablir la galerie d'origine (les cinq affiches de départ) ?")) return;
    start(async () => {
      const r = await resetPostersAction();
      if (r.ok) window.location.reload();
      else setMsg({ ok: false, text: r.error });
    });
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl">Images</h1>
          <p className="mt-2 text-ink/65">Les images de la section « Créations » du site, et votre bibliothèque.</p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-sm font-bold text-orange-deep">Modifications non enregistrées</span>}
          <button id="save-posters" type="button" onClick={save} disabled={pending || !dirty} className="btn btn-orange !py-3 disabled:opacity-40">
            {pending ? "Patientez…" : "Enregistrer"} <kbd className="ml-2 rounded bg-ink/15 px-1.5 text-xs">Ctrl S</kbd>
          </button>
        </div>
      </header>
      {msg && <p role="status" className={`rounded-xl px-4 py-3 font-semibold ${msg.ok ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>{msg.text}</p>}

      <section className="rounded-[1.75rem] bg-cream p-6">
        <h2 className="text-xl">Bibliothèque</h2>
        <p className="mt-1 text-sm text-ink/60">JPG, PNG ou WebP, 3 Mo maximum. Elles sont automatiquement redimensionnées et converties en WebP.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files)} disabled={pending} className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:font-bold file:text-cream" />
        </div>
        {media.length > 0 && (
          <ul className="mt-5 grid grid-cols-6 gap-4">
            {media.map((m) => (
              <li key={m.id} className={`overflow-hidden rounded-xl border-2 ${pick === m.id ? "border-orange" : "border-transparent"} bg-white`}>
                <button type="button" onClick={() => setPick(m.id)} className="block w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/${m.id}`} alt={m.name} className="aspect-square w-full object-cover" />
                </button>
                <div className="flex items-center justify-between gap-2 p-2 text-xs">
                  <span className="truncate font-semibold" title={m.name}>{m.name}<br /><span className="font-normal text-ink/55">{kb(m.bytes)}</span></span>
                  <button type="button" aria-label={`Supprimer ${m.name}`} onClick={() => removeMedia(m)} className="rounded px-1.5 py-1 font-bold text-red-700 hover:bg-red-100">✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl">Galerie du site ({list.length})</h2>
          <div className="flex items-center gap-3">
            <button type="button" data-new onClick={addFromLibrary} className="btn btn-ink !py-2.5">+ Ajouter l'image sélectionnée <kbd className="ml-2 rounded bg-cream/20 px-1.5 text-xs">n</kbd></button>
            {customized && <button type="button" onClick={reset} className="text-sm font-semibold text-ink/60 underline">Rétablir la galerie d'origine</button>}
          </div>
        </div>
        <p className="text-sm text-ink/60">Cliquez sur une image de la bibliothèque pour la sélectionner, puis sur « Ajouter ». Les images d'origine se retirent avec ✕ mais ne sont pas effacées.</p>

        <ul className="space-y-3">
          {list.map((p, i) => (
            <li key={p.id} className="flex gap-5 rounded-[1.5rem] bg-cream p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="h-32 w-32 shrink-0 rounded-xl object-cover" />
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-2">
                <label className="text-xs font-semibold">Titre (FR)<input className={field} maxLength={80} value={p.fr.title} onChange={(e) => patch(i, "fr", { title: e.target.value })} /></label>
                <label className="text-xs font-semibold">Légende (FR)<input className={field} maxLength={80} value={p.fr.text} onChange={(e) => patch(i, "fr", { text: e.target.value })} /></label>
                <label className="text-xs font-semibold">Title (EN)<input className={field} maxLength={80} value={p.en.title} onChange={(e) => patch(i, "en", { title: e.target.value })} /></label>
                <label className="text-xs font-semibold">Caption (EN)<input className={field} maxLength={80} value={p.en.text} onChange={(e) => patch(i, "en", { text: e.target.value })} /></label>
                <label className="col-span-2 text-xs font-semibold">Description pour les malvoyants (FR)<input className={field} maxLength={200} value={p.fr.alt} onChange={(e) => patch(i, "fr", { alt: e.target.value })} /></label>
              </div>
              <div className="flex shrink-0 flex-col justify-between">
                <div className="flex gap-1">
                  <button type="button" aria-label="Monter" onClick={() => move(i, -1)} className="rounded-lg bg-ink/10 px-2.5 py-1 hover:bg-orange">↑</button>
                  <button type="button" aria-label="Descendre" onClick={() => move(i, 1)} className="rounded-lg bg-ink/10 px-2.5 py-1 hover:bg-orange">↓</button>
                </div>
                <button type="button" onClick={() => change(list.filter((_, k) => k !== i))} className="text-sm font-bold text-red-700 underline">Retirer</button>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="rounded-2xl bg-cream p-6 text-ink/65">La galerie est vide.</li>}
        </ul>
      </section>
    </div>
  );
}
