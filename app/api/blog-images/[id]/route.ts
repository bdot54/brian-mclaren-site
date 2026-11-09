import { eq } from "drizzle-orm";
import { ensureSchema, getDb } from "../../../../db";
import { blogImages } from "../../../../db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const imageId = Number(id);
  if (!Number.isInteger(imageId)) {
    return new Response("Not found", { status: 404 });
  }

  await ensureSchema();
  const db = getDb();
  const [image] = await db
    .select()
    .from(blogImages)
    .where(eq(blogImages.id, imageId))
    .limit(1);

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
