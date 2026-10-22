"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "./LangProvider";
import { whatsappLink } from "@/lib/site";
import { lockScroll, unlockScroll } from "@/lib/scroll";

const TOTAL = 3;

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-[0.95rem] font-semibold transition-colors duration-200 ${
        active ? "border-ink bg-ink text-cream" : "border-ink/30 text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

const field =
  "mt-2 w-full rounded-xl border border-ink/25 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/45";

export default function QuoteDialog({ open, preset, onClose }) {
  const { lang, t } = useLang();
  const d = t.dialog;
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const locked = useRef(false);
  const mounted = useRef(false);

  const [step, setStep] = useState(0);
  const [groups, setGroups] = useState([]);
  const [options, setOptions] = useState([]);
  const [delay, setDelay] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trap, setTrap] = useState("");
  const [error, setError] = useState("");
  const [sentUrl, setSentUrl] = useState(null);
  const [closing, setClosing] = useState(false);

  // Ouverture : dialogue natif (focus piégé, Échap, fond inerte).
  useEffect(() => {
    const el = dialogRef.current;
    if (!el || !open) return;
    if (!el.open) {
      el.showModal();
      if (!locked.current) {
        lockScroll();
        locked.current = true;
      }
    }
    if (preset) setGroups((g) => (g.includes(preset) ? g : [...g, preset]));
  }, [open, preset]);

  // Ne laisse jamais la page bloquée si le composant disparaît.
  useEffect(
    () => () => {
      if (locked.current) unlockScroll();
    },
    []
  );

  // Après un changement d'étape, le focus passe au titre (lecteurs d'écran).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  function resetAll() {
    setStep(0);
    setGroups([]);
    setOptions([]);
    setDelay(0);
    setMessage("");
    setName("");
    setPhone("");
    setTrap("");
    setError("");
    setSentUrl(null);
  }

  function handleClosed() {
    if (locked.current) {
      unlockScroll();
      locked.current = false;
    }
    setClosing(false);
    if (sentUrl) resetAll();
    onClose();
  }

  function requestClose() {
    setClosing(true);
    setTimeout(() => dialogRef.current?.close(), 170);
  }

  const toggle = (list, setList, v) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  function toggleGroup(group) {
    if (groups.includes(group.key)) {
      setGroups(groups.filter((g) => g !== group.key));
      setOptions(options.filter((o) => !group.options.includes(o)));
    } else {
      setGroups([...groups, group.key]);
    }
    setError("");
  }

  function goNext() {
    if (step === 0 && groups.length === 0) {
      setError(d.needGroup);
      return;
    }
    setError("");
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  }

  const groupLabels = groups.map((k) => d.groups.find((g) => g.key === k)?.label).filter(Boolean);

  function buildText() {
    const m = d.msg;
    return [
      m.hello,
      m.iAm.replace("{name}", name.trim()),
      "",
      `${m.project} ${groupLabels.join(", ")}`,
      options.length ? `${m.needs} ${options.join(", ")}` : null,
      `${m.delay} ${d.delays[delay]}`,
      phone.trim() ? `${m.phone} ${phone.trim()}` : null,
      message.trim() ? `\n${m.details} ${message.trim()}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError(d.needName);
      return;
    }
    const url = whatsappLink(buildText());
    // Ouvert tout de suite, pendant le clic, pour ne pas être bloqué par le navigateur.
    window.open(url, "_blank", "noopener");
    try {
      fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          lang,
          name: name.trim(),
          phone: phone.trim(),
          projects: groupLabels,
          needs: options,
          delay: d.delays[delay],
          message: message.trim(),
          company: trap,
        }),
      }).catch(() => {});
    } catch {
      /* l'envoi vers l'admin est facultatif */
    }
    setError("");
    setSentUrl(url);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="quote-title"
      data-closing={closing}
      data-lenis-prevent
      onClose={handleClosed}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className="quote-dialog m-auto w-[min(100%-2rem,42rem)] max-w-none overflow-visible bg-transparent p-0 text-ink max-sm:mb-0 max-sm:mt-auto max-sm:w-full"
    >
      <div className="flex max-h-[min(92svh,46rem)] flex-col overflow-hidden rounded-[2rem] bg-cream shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] max-sm:rounded-b-none">
        <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-9 sm:pt-8">
          <div className="min-w-0 flex-1">
            <p id="quote-title" className="text-sm font-bold text-ink/60">
              {d.title}
            </p>
            {!sentUrl && (
              <>
                <div className="mt-3 flex gap-2" aria-hidden="true">
                  {Array.from({ length: TOTAL }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        i <= step ? "bg-orange" : "bg-ink/15"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm font-semibold">
                  {d.stepOf.replace("{n}", step + 1).replace("{total}", TOTAL)}
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label={d.close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-cream"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6 sm:px-9" data-lenis-prevent>
            {sentUrl ? (
              <div className="py-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-3xl outline-none sm:text-4xl">
                  {d.done.title}
                </h2>
                <p className="mt-4 max-w-md text-ink/80">{d.done.text}</p>
                <p className="mt-6 text-sm text-ink/65">
                  {d.done.fallback}{" "}
                  <a href={sentUrl} target="_blank" rel="noreferrer" className="link-line">
                    {d.done.reopen}
                  </a>
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {step === 0 && (
                    <fieldset>
                      <legend className="sr-only">{d.s0.title}</legend>
                      <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none sm:text-4xl">
                        {d.s0.title}
                      </h2>
                      <p className="mt-2 text-sm text-ink/65">{d.s0.hint}</p>
                      <div className="mt-5 flex flex-wrap gap-2.5">
                        {d.groups.map((g) => (
                          <Chip key={g.key} active={groups.includes(g.key)} onClick={() => toggleGroup(g)}>
                            {g.label}
                          </Chip>
                        ))}
                      </div>
                      {d.groups
                        .filter((g) => groups.includes(g.key))
                        .map((g) => (
                          <div key={g.key} className="mt-6">
                            <p className="mb-3 text-sm font-semibold text-ink/65">
                              {d.s0.precise.replace("{group}", g.label)}
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                              {g.options.map((o) => (
                                <Chip key={o} active={options.includes(o)} onClick={() => toggle(options, setOptions, o)}>
                                  {o}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        ))}
                    </fieldset>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none sm:text-4xl">
                        {d.s1.title}
                      </h2>
                      <div className="mt-5 flex flex-wrap gap-2.5" role="group" aria-label={d.s1.title}>
                        {d.delays.map((label, i) => (
                          <Chip key={label} active={delay === i} onClick={() => setDelay(i)}>
                            {label}
                          </Chip>
                        ))}
                      </div>
                      <label className="mt-7 block text-sm font-semibold" htmlFor="quote-message">
                        {d.s1.messageLabel}
                        <textarea
                          id="quote-message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={d.s1.messagePlaceholder}
                          className={field}
                        />
                      </label>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none sm:text-4xl">
                        {d.s2.title}
                      </h2>
                      <label className="mt-5 block text-sm font-semibold" htmlFor="quote-name">
                        {d.s2.nameLabel}
                        <input
                          id="quote-name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                          }}
                          autoComplete="name"
                          placeholder={d.s2.namePlaceholder}
                          className={field}
                        />
                      </label>
                      <label className="mt-4 block text-sm font-semibold" htmlFor="quote-phone">
                        {d.s2.phoneLabel}
                        <input
                          id="quote-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          autoComplete="tel"
                          inputMode="tel"
                          placeholder={d.s2.phonePlaceholder}
                          className={field}
                        />
                      </label>
                      {/* Champ piège pour les robots, invisible pour les personnes */}
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={trap}
                        onChange={(e) => setTrap(e.target.value)}
                        className="absolute -left-[9999px] h-0 w-0 opacity-0"
                        name="company"
                      />

                      <div className="mt-7 rounded-2xl bg-ink p-5 text-cream">
                        <p className="font-extrabold">{d.recap.title}</p>
                        <dl className="mt-3 space-y-1.5 text-[0.95rem] text-cream/85">
                          <div className="flex gap-3">
                            <dt className="w-16 shrink-0 text-cream/55">{d.recap.project}</dt>
                            <dd>{groupLabels.join(", ")}</dd>
                          </div>
                          {options.length > 0 && (
                            <div className="flex gap-3">
                              <dt className="w-16 shrink-0 text-cream/55">{d.recap.needs}</dt>
                              <dd>{options.join(", ")}</dd>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <dt className="w-16 shrink-0 text-cream/55">{d.recap.delay}</dt>
                            <dd>{d.delays[delay]}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="border-t border-ink/10 px-6 py-4 sm:px-9 sm:py-5">
            <p role="alert" className={`mb-3 text-sm font-semibold text-[#B33A00] ${error ? "" : "hidden"}`}>
              {error}
            </p>
            {sentUrl ? (
              <button type="button" onClick={requestClose} className="btn btn-ink w-full sm:w-auto">
                {d.done.finish}
              </button>
            ) : (
              <div className="flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStep((s) => s - 1);
                    }}
                    className="link-line"
                  >
                    {d.back}
                  </button>
                ) : (
                  <span />
                )}
                {step < TOTAL - 1 ? (
                  <button key="next" type="button" onClick={goNext} className="btn btn-ink">
                    {d.next}
                  </button>
                ) : (
                  <button key="send" type="submit" className="btn btn-orange">
                    {d.send}
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
}
