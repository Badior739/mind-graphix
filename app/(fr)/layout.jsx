import "@fontsource-variable/montserrat";
import "../globals.css";
import PageShell from "@/components/PageShell";
import { buildMetadata } from "@/lib/meta";
import { getOverrides } from "@/lib/server/store";

export const metadata = buildMetadata("fr");

export const viewport = { themeColor: "#FBF6EF" };

export default async function FrenchLayout({ children }) {
  const overrides = await getOverrides();
  return (
    <html lang="fr">
      <body>
        <PageShell lang="fr" overrides={overrides}>{children}</PageShell>
      </body>
    </html>
  );
}
