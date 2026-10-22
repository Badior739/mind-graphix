import { defaultPosters, getOverrides, listMedia } from "@/lib/server/store";
import ImagesManager from "@/components/admin/ImagesManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Images" };

export default async function ImagesPage() {
  let o = null;
  let media = [];
  try {
    [o, media] = await Promise.all([getOverrides(), listMedia()]);
  } catch {}
  return (
    <ImagesManager
      initial={o?.posters ?? defaultPosters()}
      customized={Boolean(o?.posters)}
      media={media.map((m) => ({ id: m.id, name: m.name, bytes: Number(m.bytes) }))}
    />
  );
}
