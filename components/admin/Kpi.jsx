export default function Kpi({ label, value, hint }) {
  return (
    <div className="rounded-[1.5rem] bg-cream p-6">
      <p className="text-sm font-semibold text-ink/65">{label}</p>
      <p className="mt-2 text-4xl font-extrabold tabular-nums">{new Intl.NumberFormat("fr-FR").format(value)}</p>
      {hint && <p className="mt-1 text-sm text-ink/55">{hint}</p>}
    </div>
  );
}
