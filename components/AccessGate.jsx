"use client";

import { useEffect, useRef, useState } from "react";

// Ctrl + Alt + B ouvre une petite fenêtre discrète. Aucun lien, aucun texte visible sur le site.
export default function AccessGate() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [bad, setBad] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.altKey && !e.metaKey && e.code === "KeyB") {
        e.preventDefault();
        setValue("");
        setBad(false);
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    if (!value || busy) return;
    setBusy(true);
    setBad(false);
    try {
      const res = await fetch("/api/s", { method: "POST", body: JSON.stringify({ code: value }), headers: { "Content-Type": "application/json" } });
      const data = await res.json().catch(() => ({}));
      if (data.ok && typeof data.url === "string" && data.url.startsWith("/")) {
        window.location.assign(data.url);
        return;
      }
      setBad(true);
    } catch {
      setBad(true);
    }
    setBusy(false);
  }

  return (
    <dialog
      ref={ref}
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      aria-label="Accès"
      className="m-auto w-[min(92vw,22rem)] rounded-2xl border-0 bg-ink p-6 text-cream backdrop:bg-ink/60"
    >
      <form onSubmit={submit} autoComplete="off">
        <input
          type="password" name="k" value={value} onChange={(e) => setValue(e.target.value)} autoFocus
          autoComplete="off" spellCheck={false} aria-label="Code d'accès"
          className="w-full rounded-xl border-2 border-cream/25 bg-transparent px-4 py-3 text-lg outline-none focus:border-orange"
        />
        <p role="status" className="mt-3 h-5 text-sm text-orange">{bad ? "Refusé." : ""}</p>
        <button type="submit" disabled={busy || !value} className="btn btn-orange mt-2 w-full disabled:opacity-50">Entrer</button>
      </form>
    </dialog>
  );
}
