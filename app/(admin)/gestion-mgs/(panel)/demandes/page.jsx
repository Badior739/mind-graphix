import Link from "next/link";
import { adminBase } from "@/lib/server/admin-path";
import { listBriefs } from "@/lib/server/stats";
import BriefRow from "@/components/admin/BriefRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Demandes" };

const STATUSES = ["nouveau", "en cours", "traité", "archivé"];

export default async function Briefs({ searchParams }) {
  const sp = await searchParams;
  const base = adminBase();
  const q = typeof sp?.q === "string" ? sp.q.slice(0, 80) : "";
  const status = STATUSES.includes(sp?.statut) ? sp.statut : "";
  let rows = [];
  let error = false;
  try {
    rows = await listBriefs({ q, status });
  } catch {
    error = true;
  }
  const items = rows.map((r) => ({ ...r, ts: new Date(r.ts).toISOString(), projects: r.projects || [], needs: r.needs || [] }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl">Demandes</h1>
        <a href={`${base}/export`} className="btn btn-line !py-2.5">Exporter en CSV</a>
      </header>

      <form className="flex flex-wrap gap-3" action={`${base}/demandes`}>
        <input
          data-search name="q" defaultValue={q} placeholder="Chercher un nom, un numéro, un mot du message…  ( / )"
          className="min-w-[22rem] flex-1 rounded-xl border-2 border-ink/15 bg-cream px-4 py-2.5 outline-none focus:border-orange"
        />
        <select name="statut" defaultValue={status} className="rounded-xl border-2 border-ink/15 bg-cream px-4 py-2.5 font-semibold">
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn btn-ink !py-2.5">Filtrer</button>
        {(q || status) && <Link href={`${base}/demandes`} prefetch={false} className="btn btn-line !py-2.5">Effacer</Link>}
      </form>

      {error ? (
        <p className="rounded-2xl bg-cream p-8 font-semibold">La base de données n'est pas joignable.</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-cream p-8 text-ink/70">Aucune demande pour le moment. Elles apparaissent ici dès qu'un visiteur envoie un brief.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((b) => <BriefRow key={b.id} brief={b} statuses={STATUSES} />)}
        </ul>
      )}
    </div>
  );
}
