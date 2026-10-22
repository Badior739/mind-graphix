import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("confidentialite");

export default function Page() {
  return <LegalPage pageKey="confidentialite" />;
}
