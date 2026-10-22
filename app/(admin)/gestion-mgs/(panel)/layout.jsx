import { adminBase } from "@/lib/server/admin-path";
import { requireAdmin } from "@/lib/server/auth";
import { logoutAction } from "../actions";
import Nav from "@/components/admin/Nav";
import Shortcuts from "@/components/admin/Shortcuts";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }) {
  const session = await requireAdmin();
  const base = adminBase();
  return (
    <div className="min-h-svh">
      <div className="flex min-h-svh items-center justify-center p-8 text-center lg:hidden">
        <p className="max-w-xs text-xl font-bold">Agrandissez la fenêtre : l'espace de gestion s'utilise sur ordinateur.</p>
      </div>
      <div className="hidden min-h-svh lg:flex">
        <aside className="sticky top-0 flex h-svh w-72 shrink-0 flex-col bg-ink p-6 text-cream">
          <p className="text-xl font-extrabold">Mind Graphix</p>
          <p className="text-sm text-cream/60">Espace de gestion</p>
          <Nav base={base} />
          <div className="mt-auto text-sm">
            <p className="truncate text-cream/60" title={session.email}>{session.email}</p>
            <form action={logoutAction} id="logout-form">
              <button type="submit" className="mt-2 font-bold text-orange hover:underline">Se déconnecter <kbd className="ml-1 rounded bg-cream/15 px-1.5 text-xs">g q</kbd></button>
            </form>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-10 xl:p-12">{children}</main>
      </div>
      <Shortcuts base={base} />
    </div>
  );
}
