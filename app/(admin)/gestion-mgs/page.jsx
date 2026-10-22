import { redirect } from "next/navigation";
import { getSession } from "@/lib/server/auth";
import { adminBase } from "@/lib/server/admin-path";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  let session = null;
  try {
    session = await getSession();
  } catch {}
  if (session) redirect(`${adminBase()}/tableau`);
  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <LoginForm base={adminBase()} />
    </main>
  );
}
