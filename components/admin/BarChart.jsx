// Histogramme simple en SVG, sans bibliothèque. Barres = visiteurs par jour.
export default function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.visits));
  const W = 900;
  const H = 220;
  const gap = data.length > 40 ? 2 : 6;
  const bw = (W - gap * (data.length - 1)) / data.length;
  const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
  const step = Math.ceil(data.length / 8);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H + 28}`} className="w-full" role="img" aria-label="Visiteurs par jour">
        <line x1="0" x2={W} y1={H} y2={H} stroke="#15161B" strokeOpacity="0.2" />
        {data.map((d, i) => {
          const h = Math.round((d.visits / max) * (H - 24));
          const x = i * (bw + gap);
          return (
            <g key={d.day}>
              <rect x={x} y={H - h} width={bw} height={Math.max(h, d.visits ? 2 : 0)} rx="3" fill="#FF6B00">
                <title>{`${fmt.format(new Date(d.day))} : ${d.visits} visiteur(s), ${d.views} page(s) vue(s)`}</title>
              </rect>
              {d.visits > 0 && data.length <= 31 && (
                <text x={x + bw / 2} y={H - h - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#15161B">{d.visits}</text>
              )}
              {i % step === 0 && (
                <text x={x + bw / 2} y={H + 20} textAnchor="middle" fontSize="12" fill="#15161B" fillOpacity="0.6">
                  {fmt.format(new Date(d.day))}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
