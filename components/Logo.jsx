import Image from "next/image";

// Symbole du logo + nom écrit en texte (net à toutes les tailles).
export default function Logo({ tone = "dark", size = 40 }) {
  const text = tone === "dark" ? "text-ink" : "text-cream";
  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={size}
        height={Math.round(size * 1.087)}
        priority
        className="h-auto"
        style={{ width: size }}
      />
      <span className={`flex flex-col leading-none ${text}`}>
        <span className="text-[1.15rem] font-extrabold tracking-tight">Mind Graphix</span>
        <span className="mt-1 text-[0.8rem] font-medium tracking-[0.42em]">Solution</span>
      </span>
    </span>
  );
}
