"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackView } from "@/lib/track";

export default function Track({ lang }) {
  const pathname = usePathname();
  useEffect(() => {
    trackView(lang);
  }, [pathname, lang]);
  return null;
}
