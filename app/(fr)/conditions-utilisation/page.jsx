import LegalPage, { legalMetadata } from "@/components/LegalPage";

export const metadata = legalMetadata("conditions-utilisation");

export default function Page() {
  return <LegalPage pageKey="conditions-utilisation" />;
}
