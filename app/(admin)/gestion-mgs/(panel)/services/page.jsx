import { defaultServices, getOverrides, listMedia } from "@/lib/server/store";
import ServicesEditor from "@/components/admin/ServicesEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services et prix" };

export default async function ServicesPage() {
  let o = null;
  let media = [];
  try {
    [o, media] = await Promise.all([getOverrides(), listMedia()]);
  } catch {}
  const services = o?.services ?? defaultServices();
  return (
    <ServicesEditor
      initial={services}
      customized={Boolean(o?.services)}
      media={media.map((m) => ({ id: m.id, name: m.name }))}
    />
  );
}
