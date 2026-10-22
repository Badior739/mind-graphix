import Link from "next/link";
import { adminBase } from "@/lib/server/admin-path";
import { dashboard } from "@/lib/server/stats";
import Kpi from "@/components/admin/Kpi";
import BarChart from "@/components/admin/BarChart";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tableau de bord" };

const PERIODS = [7, 30, 90];
const regions = new Intl.DisplayNames(["fr"], { type: "region" });
const when = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

function country(code) {
  try {
    return code === "?" ? "Inconnu" : regions.of(code) || code;
  } catch {
    return code;
  }
}

function List({ title, rows, map = (x) => x }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <section className="rounded-[1.5rem] bg-cream p-6">
      <h2 className="text-lg">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-ink/55">Pas encore de données.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="flex justify-between gap-4 text-sm font-semibold">
                <span className="truncate">{map(r.label)}</span>
                <span className="tabular-nums">{r.n}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-orange" style={{ width: `${(r.n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function Dashboard({ searchParams }) {
  const sp = await searchParams;
  const base = adminBase();
  const days = PERIODS.includes(Number(sp?.p)) ? Number(sp.p) : 30;
  let d;
  try {
    d = await dashboard(days);
  } catch (e) {
    return <p className="rounded-2xl bg-cream p-8 font-semibold">La base de données n'est pas joignable. Vérifiez DATABASE_URL.</p>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl">Tableau de bord</h1>
        <div className="flex gap-2" role="group" aria-label="Période">
          {PERIODS.map((p) => (
            <Link key={p} href={`${base}/tableau?p=${p}`} prefetch={false}
              className={`rounded-full px-4 py-2 text-sm font-bold ${p === days ? "bg-ink text-cream" : "bg-cream hover:bg-white"}`}>
              {p} jours
            </Link>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-5 gap-4">
        <Kpi label="Visites" value={d.visits} hint="Visiteurs distincts par jour" />
        <Kpi label="Pages vues" value={d.views} />
        <Kpi label="Demandes de devis" value={d.briefs} hint="Briefs envoyés" />
        <Kpi label="Devis commencés" value={d.quoteOpens} hint="Boîte de dialogue ouverte" />
        <Kpi label="Clics WhatsApp" value={d.whatsapp} />
      </div>

      <section className="rounded-[1.5rem] bg-cream p-6">
        <h2 className="text-lg">Visiteurs par jour</h2>
        <div className="mt-4"><BarChart data={d.series} /></div>
      </section>

      <div className="grid grid-cols-3 gap-4">
        <List title="Pages les plus vues" rows={d.pages} />
        <List title="D'où viennent les visiteurs" rows={d.sources} map={(s) => (s === "direct" ? "Accès direct" : s)} />
        <List title="Pays" rows={d.countries} map={country} />
        <List title="Appareils" rows={d.devices} />
        <List title="Langue" rows={d.langs} map={(l) => (l === "en" ? "Anglais" : l === "fr" ? "Français" : l)} />
        <section className="rounded-[1.5rem] bg-cream p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Dernières demandes</h2>
            <Link href={`${base}/demandes`} prefetch={false} className="link-line text-sm">Tout voir</Link>
          </div>
          {d.recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink/55">Aucune demande pour l'instant.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {d.recent.map((b) => (
                <li key={b.id} className="py-2.5 text-sm">
                  <p className="font-bold">{b.name}</p>
                  <p className="text-ink/60">{when.format(new Date(b.ts))} · {(Array.isArray(b.projects) ? b.projects : []).join(", ")} · {b.status}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <p className="text-sm text-ink/55">Statistiques anonymes, sans cookie ni adresse IP conservée. Les robots et les visiteurs qui refusent le suivi ne sont pas comptés.</p>
    </div>
  );
}
