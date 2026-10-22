import "server-only";
import { adminSlug } from "../session-token";

// Adresse publique (secrète) de l'espace de gestion, par exemple « /infographie-mgs-k7q2x9 ».
export const adminBase = () => {
  const s = adminSlug();
  return s ? `/${s}` : "/";
};
