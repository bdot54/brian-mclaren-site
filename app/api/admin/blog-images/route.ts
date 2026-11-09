import { isAdminRequest } from "../../../admin/auth";
import { ensureSchema, getDb } from "../../../../db";
import { blogImages } from "../../../../db/schema";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "No image file was uploaded." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json(
        { error: "Please upload a JPEG, PNG, GIF, or WebP image." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: "That image is too large. Please keep uploads under 8MB." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    await ensureSchema();
    const db = getDb();
    const [image] = await db
      .insert(blogImages)
      .values({ contentType: file.type, data: bytes })
      .returning({ id: blogImages.id });

    return Response.json({ url: `/api/blog-images/${image.id}` }, { status: 201 });
  } catch {
    return Response.json({ error: "Something went wrong uploading the image." }, { status: 500 });
  }
}
