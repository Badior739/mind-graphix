// Coordonnées de l'agence, à modifier ici uniquement.

export const SITE = {
  name: "Mind Graphix Solution",
  city: "Bobo-Dioulasso, Burkina Faso",
  whatsappNumber: "22657142444",
  phones: ["+226 57 14 24 44", "+226 01 51 11 46"],
  url: "https://mind-graphix.vercel.app",
  // Informations légales : renseignez les champs vides, ils s'affichent automatiquement dans les mentions légales.
  legal: {
    publisher: "Badiori Ouattara",
    legalForm: "", // ex. : Entreprise individuelle, SARL…
    rccm: "",
    ifu: "",
    address: "", // adresse postale complète, si vous souhaitez la publier
  },
  socials: [
    { name: "Facebook", handle: "@mindgraphixsolution", href: "https://www.facebook.com/mindgraphixsolution" },
    { name: "Instagram", handle: "@mindgraphixsolution", href: "https://www.instagram.com/mindgraphixsolution" },
    { name: "TikTok", handle: "@mindgraphix", href: "https://www.tiktok.com/@mindgraphix" },
  ],
};

const DEFAULT_MESSAGE =
  "Bonjour, j'aimerais discuter d'un projet avec Mind Graphix Solution.";

export function whatsappLink(message) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message ?? DEFAULT_MESSAGE)}`;
}
