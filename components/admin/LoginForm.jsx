"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { requestCodeAction, verifyCodeAction } from "@/app/(admin)/gestion-mgs/actions";

export default function LoginForm({ base }) {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);
  const [pending, start] = useTransition();
  const codeRef = useRef(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  function send(e) {
    e?.preventDefault();
    setError("");
    start(async () => {
      await requestCodeAction(email);
      setStep("code");
      setCode("");
      setWait(60);
    });
  }

  function verify(value) {
    setError("");
    start(async () => {
      const res = await verifyCodeAction(email, value);
      if (res.ok) router.replace(`${base}/tableau`);
      else {
        setError(res.error);
        setCode("");
        codeRef.current?.focus();
      }
    });
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] bg-cream p-10 shadow-[0_40px_80px_-40px_rgba(21,22,27,0.5)]">
      <p className="text-sm font-bold text-orange-deep">Mind Graphix Solution</p>
      <h1 className="mt-2 text-4xl">Espace de gestion</h1>

      {step === "email" ? (
        <form onSubmit={send} className="mt-8">
          <label htmlFor="email" className="text-sm font-semibold">Adresse e-mail</label>
          <input
            id="email" type="email" required autoFocus autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-lg outline-none focus:border-orange"
          />
          <button type="submit" disabled={pending || !email} className="btn btn-ink mt-6 w-full disabled:opacity-50">
            {pending ? "Envoi…" : "Recevoir un code"}
          </button>
        </form>
      ) : (
        <div className="mt-8">
          <p className="text-ink/75">
            Si cette adresse est autorisée, un code à 6 chiffres vient d'être envoyé. Il est valable 10 minutes.
          </p>
          <label htmlFor="code" className="mt-6 block text-sm font-semibold">Code reçu par e-mail</label>
          <input
            ref={codeRef} id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(v);
              if (v.length === 6) verify(v);
            }}
            className="mt-2 w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-center text-3xl font-extrabold tracking-[0.5em] outline-none focus:border-orange"
          />
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
          <div className="mt-6 flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setStep("email"); setError(""); }} className="link-line">Changer d'adresse</button>
            <button type="button" disabled={wait > 0 || pending} onClick={send} className="link-line disabled:opacity-40">
              {wait > 0 ? `Renvoyer (${wait} s)` : "Renvoyer le code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
