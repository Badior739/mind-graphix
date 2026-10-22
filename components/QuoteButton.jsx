"use client";

import { useQuote } from "./QuoteProvider";

export default function QuoteButton({ children, className = "btn btn-orange", service }) {
  const { openQuote } = useQuote();
  return (
    <button type="button" onClick={() => openQuote(service)} className={className}>
      {children}
    </button>
  );
}
