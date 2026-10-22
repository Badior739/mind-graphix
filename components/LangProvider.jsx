"use client";

import { createContext, useContext, useMemo } from "react";
import { content } from "@/lib/content";
import { mergeContent } from "@/lib/merge";

const LangContext = createContext(null);

export function LangProvider({ lang, overrides = null, children }) {
  const value = useMemo(() => ({ lang, t: mergeContent(content[lang], overrides, lang) }), [lang, overrides]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
