import "@fontsource-variable/montserrat";
import "../../globals.css";
import PageShell from "@/components/PageShell";
import { buildMetadata } from "@/lib/meta";
import { getOverrides } from "@/lib/server/store";

export const metadata = buildMetadata("en");

export const viewport = { themeColor: "#FBF6EF" };

export default async function EnglishLayout({ children }) {
  const overrides = await getOverrides();
  return (
    <html lang="en">
      <body>
        <PageShell lang="en" overrides={overrides}>{children}</PageShell>
      </body>
    </html>
  );
}
