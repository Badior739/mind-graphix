"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Défilement fluide pour tout le site (désactivé si la personne a demandé moins d'animations).
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      anchors: { offset: -72 },
    });
    window.__lenis = lenis;

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
