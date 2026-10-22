"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useLang } from "./LangProvider";
import { useQuote } from "./QuoteProvider";

const EASE = [0.22, 1, 0.36, 1];

const CARDS = [
  { id: "quote", left: "0%", top: "16%", rot: -9, depth: 0.7, z: 10 },
  { id: "didyouknow", left: "21%", top: "0%", rot: 3, depth: 1.1, z: 20 },
  { id: "services", left: "43%", top: "20%", rot: 10, depth: 1.6, z: 30 },
];

function Arrow() {
  return (
    <svg viewBox="0 0 340 200" className="h-full w-full" aria-hidden="true">
      <path d="M0 66 H214 V16 L336 100 L214 184 V134 H0 Z" fill="currentColor" />
    </svg>
  );
}

function PosterCard({ card, poster, index, scroll, mx, my, reduce }) {
  const y = useTransform(scroll, [0, 1], [0, reduce ? 0 : -150 * card.depth]);
  const rotate = useTransform(scroll, [0, 1], [card.rot, card.rot + (reduce ? 0 : card.rot < 0 ? -7 : 7)]);
  const px = useTransform(mx, (v) => (reduce ? 0 : v * 16 * card.depth));
  const py = useTransform(my, (v) => (reduce ? 0 : v * 12 * card.depth));
  const yy = useTransform([y, py], ([a, b]) => a + b);

  return (
    <motion.div
      className="absolute w-[56%]"
      style={{ left: card.left, top: card.top, zIndex: card.z }}
      initial={reduce ? false : { opacity: 0, y: 80, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.5 + index * 0.14 }}
    >
      <motion.div style={{ x: px, y: yy, rotate }}>
        <Image
          src={poster.src}
          alt={poster.alt}
          width={1254}
          height={1254}
          sizes="(min-width: 1024px) 280px, 46vw"
          priority
          className="h-auto w-full rounded-[3%] shadow-[0_28px_60px_-24px_rgba(21,22,27,0.6)]"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const { openQuote } = useQuote();
  const h = t.hero;
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 80, damping: 20 });
  const my = useSpring(rawY, { stiffness: 80, damping: 20 });

  function onMove(e) {
    rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
    rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
  }

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative grid lg:min-h-[calc(100svh-75px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
    >
      <div className="flex items-center py-14 sm:py-20 lg:py-24 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:pr-20">
        <div className="page-x lg:mx-0 lg:max-w-[44rem] lg:px-0">
          <h1 className="text-[clamp(2.7rem,6.4vw,5.6rem)] leading-[0.98]">
            {h.words.map((word, i) => (
              <span key={word} className="mr-[0.22em] inline-block overflow-hidden align-bottom pb-[0.08em]">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.09 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-[31rem] text-lg text-ink/80"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
          >
            {h.text}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
          >
            <button type="button" onClick={() => openQuote()} className="btn btn-orange">
              {h.cta}
            </button>
            <a href="#services" className="link-line">
              {h.link}
            </a>
          </motion.div>
        </div>
      </div>

      <div className="relative bg-orange">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute -right-[8%] bottom-[0%] h-[86%] w-[132%] origin-bottom-right text-orange-soft"
            style={{ rotate: -40 }}
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
          >
            <Arrow />
          </motion.div>
        </div>

        <div className="relative flex min-h-[460px] items-center justify-center px-6 py-14 sm:min-h-[560px] lg:h-full lg:min-h-0 lg:-ml-24 lg:justify-start lg:px-0 lg:py-0">
          <div className="relative aspect-[1/1.08] w-full max-w-[460px] lg:max-w-none lg:w-[min(46vw,620px)]">
            {CARDS.map((card, i) => (
              <PosterCard
                key={card.id}
                card={card}
                poster={t.fixedPosters.find((p) => p.id === card.id)}
                index={i}
                scroll={scrollYProgress}
                mx={mx}
                my={my}
                reduce={reduce}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
