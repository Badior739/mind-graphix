"use client";

import { useState, useTransition } from "react";
import { deleteBrief, setBriefStatus } from "@/app/(admin)/gestion-mgs/actions";

const when = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
const TONE = { nouveau: "bg-orange text-ink", "en cours": "bg-ink text-cream", "traité": "bg-green-700 text-white", "archivé": "bg-ink/15 text-ink" };

export default function BriefRow({ brief, statuses }) {
  const [status, setStatus] = useState(brief.status);
  const [gone, setGone] = useState(false);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  if (gone) return null;
  const tel = brief.phone?.replace(/[^\d+]/g, "");

  return (
    <li className="rounded-[1.5rem] bg-cream">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-5 p-5">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE[status] || ""}`}>{status}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-lg font-extrabold">{brief.name}</span>
            <span className="block truncate text-sm text-ink/60">{brief.projects.join(", ")}{brief.delay ? ` · ${brief.delay}` : ""}</span>
          </span>
          <span className="text-sm text-ink/60">{when.format(new Date(brief.ts))} UTC</span>
        </summary>
        <div className="space-y-4 border-t border-ink/10 p-5">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><dt className="font-semibold text-ink/60">Téléphone</dt><dd className="mt-0.5 text-base font-bold">{tel ? <a className="link-line" href={`tel:${tel}`}>{brief.phone}</a> : "Non renseigné"}</dd></div>
            <div><dt className="font-semibold text-ink/60">Langue</dt><dd className="mt-0.5 text-base font-bold">{brief.lang === "en" ? "Anglais" : "Français"}</dd></div>
            <div className="col-span-2"><dt className="font-semibold text-ink/60">Besoins</dt><dd className="mt-0.5 text-base font-bold">{brief.needs.length ? brief.needs.join(" · ") : "Non précisés"}</dd></div>
          </dl>
          <div>
            <p className="text-sm font-semibold text-ink/60">Message</p>
            <p className="mt-1 whitespace-pre-wrap">{brief.message || "Aucun message."}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <label className="text-sm font-semibold" htmlFor={`st-${brief.id}`}>Statut</label>
            <select
              id={`st-${brief.id}`} value={status} disabled={pending}
              onChange={(e) => {
                const next = e.target.value;
                const prev = status;
                setStatus(next);
                start(async () => {
                  const r = await setBriefStatus(brief.id, next);
                  if (!r.ok) { setStatus(prev); setErr(r.error); } else setErr("");
                });
              }}
              className="rounded-lg border-2 border-ink/15 bg-white px-3 py-1.5 font-semibold"
            >
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              type="button" disabled={pending}
              onClick={() => {
                if (!window.confirm(`Supprimer définitivement la demande de ${brief.name} ?`)) return;
                start(async () => {
                  const r = await deleteBrief(brief.id);
                  if (r.ok) setGone(true); else setErr(r.error);
                });
              }}
              className="ml-auto rounded-full border-2 border-red-700 px-4 py-1.5 text-sm font-bold text-red-700 hover:bg-red-700 hover:text-white"
            >
              Supprimer
            </button>
            {err && <p role="alert" className="w-full text-sm font-semibold text-red-700">{err}</p>}
          </div>
        </div>
      </details>
    </li>
  );
}
