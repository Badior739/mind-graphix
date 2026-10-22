// Bloque le défilement de la page pendant qu'une boîte de dialogue est ouverte.
let locks = 0;

export function lockScroll() {
  if (locks++ === 0) {
    document.documentElement.style.overflow = "hidden";
    window.__lenis?.stop();
  }
}

export function unlockScroll() {
  if (locks > 0 && --locks === 0) {
    document.documentElement.style.overflow = "";
    window.__lenis?.start();
  }
}
