import "@fontsource-variable/montserrat";
import "../globals.css";

export const metadata = {
  title: "Espace de gestion",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport = { themeColor: "#15161B" };

export default function AdminRootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-[#F3EADD]">{children}</body>
    </html>
  );
}
