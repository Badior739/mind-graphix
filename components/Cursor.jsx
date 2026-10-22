"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Pastille qui suit la souris au-dessus des éléments portant data-cursor="Texte".
// Invisible sur téléphone et tablette.
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [label, setLabel] = useState(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    function move(e) {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target instanceof Element ? e.target.closest("[data-cursor]") : null;
      setLabel(el ? el.getAttribute("data-cursor") : null);
    }
    function leave() {
      setLabel(null);
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-24 w-24 items-center justify-center rounded-full bg-orange text-sm font-extrabold text-ink md:flex"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {label}
    </motion.div>
  );
}
