import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("mentions-legales");

export default function Page() {
  return <LegalPage pageKey="mentions-legales" />;
}
