import { getMedia } from "@/lib/server/store";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function GET(_req, { params }) {
  const { id } = await params;
  if (!UUID.test(id)) return new Response(null, { status: 404 });
  let row;
  try {
    row = await getMedia(id);
  } catch {
    return new Response(null, { status: 503 });
  }
  if (!row) return new Response(null, { status: 404 });
  return new Response(row.data, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
