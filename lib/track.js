// Envoi des statistiques anonymes (aucun cookie). Respecte le réglage « Ne pas me suivre » du navigateur.
export function track(type, extra = {}) {
  try {
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
    const body = JSON.stringify({ type, path: window.location.pathname, ...extra });
    const blob = new Blob([body], { type: "text/plain" });
    if (!navigator.sendBeacon || !navigator.sendBeacon("/api/t", blob)) {
      fetch("/api/t", { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
    }
  } catch {
    /* sans importance */
  }
}

export function trackView(lang) {
  let ref = "";
  try {
    const u = new URL(document.referrer);
    if (u.host !== window.location.host) ref = u.hostname.replace(/^www\./, "");
  } catch {}
  const utm = new URLSearchParams(window.location.search).get("utm_source") || "";
  track("view", { lang, ref, utm });
}
