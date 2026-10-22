import { activeSessions, authJournal } from "@/lib/server/stats";
import { getSession } from "@/lib/server/auth";
import { revokeSessionsAction } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Journal" };

const when = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "medium", timeZone: "UTC" });
const LABEL = {
  otp_request: "Demande de code",
  otp_verify: "Saisie du code",
  gate: "Code d'accès (raccourci)",
};
const DETAIL = {
  sent: "Code envoyé",
  not_allowed: "Adresse non autorisée",
  rate_limited: "Trop de demandes",
  mail_error: "Échec d'envoi",
  login: "Connexion réussie",
  wrong_code: "Mauvais code",
  no_code: "Aucun code valide",
  too_many_attempts: "Trop d'essais",
  invalid_input: "Saisie invalide",
  gate_ok: "Porte ouverte",
  gate_bad: "Mauvais code d'accès",
};

export default async function Journal() {
  const [log, sessions, me] = await Promise.all([authJournal(), activeSessions(), getSession()]);
  return (
    <div className="space-y-8">
      <h1 className="text-5xl">Journal de sécurité</h1>

      <section className="rounded-[1.5rem] bg-cream p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg">Sessions ouvertes ({sessions.length})</h2>
          <form action={revokeSessionsAction}>
            <button className="rounded-full border-2 border-red-700 px-4 py-1.5 text-sm font-bold text-red-700 hover:bg-red-700 hover:text-white">
              Déconnecter tout le monde
            </button>
          </form>
        </div>
        <ul className="mt-4 divide-y divide-ink/10 text-sm">
          {sessions.map((s) => (
            <li key={s.id} className="flex justify-between gap-6 py-2.5">
              <span className="font-semibold">{s.email}{s.id === me?.sid ? " (cette session)" : ""}</span>
              <span className="truncate text-ink/60">{String(s.ua).slice(0, 70)}</span>
              <span className="whitespace-nowrap text-ink/60">depuis {when.format(new Date(s.created_at))}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.5rem] bg-cream p-6">
        <h2 className="text-lg">Dernières tentatives de connexion</h2>
        <p className="mt-1 text-sm text-ink/60">Les adresses e-mail et IP ne sont pas conservées en clair. Heures en UTC.</p>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-ink/60"><tr><th className="py-2">Heure</th><th>Action</th><th>Résultat</th><th>Détail</th></tr></thead>
          <tbody className="divide-y divide-ink/10">
            {log.map((l, i) => (
              <tr key={i}>
                <td className="py-2 pr-4 whitespace-nowrap">{when.format(new Date(l.ts))}</td>
                <td className="pr-4">{LABEL[l.kind] || l.kind}</td>
                <td className={`pr-4 font-bold ${l.ok ? "text-green-700" : "text-red-700"}`}>{l.ok ? "Réussi" : "Refusé"}</td>
                <td>{DETAIL[l.detail] || l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
