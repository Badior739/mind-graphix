"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLang } from "./LangProvider";

function Word({ word, progress, start, end }) {
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {word}
    </motion.span>
  );
}

// Le texte se remplit mot après mot pendant le défilement.
export default function Statement() {
  const { t } = useLang();
  const words = t.statement.split(" ");
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });

  return (
    <section className="py-24 sm:py-36">
      <div className="page-x">
        <p
          ref={ref}
          className="max-w-[62rem] text-[clamp(1.75rem,3.9vw,3.4rem)] font-bold leading-[1.18] tracking-[-0.02em]"
        >
          {reduce
            ? t.statement
            : words.map((w, i) => (
                <Word
                  key={`${w}-${i}`}
                  word={w}
                  progress={scrollYProgress}
                  start={i / words.length}
                  end={Math.min(1, (i + 3) / words.length)}
                />
              ))}
        </p>
      </div>
    </section>
  );
}
