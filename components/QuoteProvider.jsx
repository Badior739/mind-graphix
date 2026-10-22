"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import QuoteDialog from "./QuoteDialog";
import { track } from "@/lib/track";

const QuoteContext = createContext({ openQuote: () => {} });

export function QuoteProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState(null);

  // openQuote("web" | "app" | "graphic") ouvre la boîte de dialogue avec ce service déjà coché.
  const openQuote = useCallback((key) => {
    setPreset(typeof key === "string" ? key : null);
    setOpen(true);
    track("quote_open", { label: typeof key === "string" ? key : "" });
  }, []);

  const value = useMemo(() => ({ openQuote }), [openQuote]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteDialog open={open} preset={preset} onClose={() => setOpen(false)} />
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  return useContext(QuoteContext);
}
