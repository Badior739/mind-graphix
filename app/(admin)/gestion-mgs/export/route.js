import { getSession } from "@/lib/server/auth";
import { listBriefs } from "@/lib/server/stats";

// Neutralise les cellules qui commenceraient par = + - @ (injection de formules dans Excel).
const cell = (v) => {
  let s = String(v ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@\t]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  const s = await getSession().catch(() => null);
  if (!s) return new Response("Non autorisé", { status: 401 });
  const rows = await listBriefs({});
  const head = ["Date (UTC)", "Nom", "Téléphone", "Projets", "Besoins", "Délai", "Message", "Langue", "Statut"];
  const lines = [head.map(cell).join(",")];
  for (const r of rows) {
    lines.push(
      [new Date(r.ts).toISOString(), r.name, r.phone, (r.projects || []).join(" / "), (r.needs || []).join(" / "), r.delay, r.message, r.lang, r.status]
        .map(cell)
        .join(",")
    );
  }
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="demandes-mgs-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
