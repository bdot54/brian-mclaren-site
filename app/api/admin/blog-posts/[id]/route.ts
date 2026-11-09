import { eq } from "drizzle-orm";
import { isAdminRequest } from "../../../../admin/auth";
import { slugify } from "../../../../admin/slug";
import { ensureSchema, getDb } from "../../../../../db";
import { blogPosts } from "../../../../../db/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return Response.json({ error: "Invalid post id." }, { status: 400 });
  }

  try {
    const payload = (await request.json()) as {
      title?: string;
      slug?: string;
      excerpt?: string;
      body?: string;
      published?: boolean;
    };

    const title = payload.title?.trim().slice(0, 200) ?? "";
    const body = payload.body?.trim() ?? "";
    const excerpt = payload.excerpt?.trim().slice(0, 400) ?? "";
    const slug = slugify(payload.slug?.trim() || title);
    const published = payload.published !== false;

    if (!title || !body || !slug) {
      return Response.json(
        { error: "A title and body are required." },
        { status: 400 },
      );
    }

    await ensureSchema();
    const db = getDb();
    const [post] = await db
      .update(blogPosts)
      .set({ title, slug, excerpt, body, published, updatedAt: new Date() })
      .where(eq(blogPosts.id, postId))
      .returning();

    if (!post) {
      return Response.json({ error: "Post not found." }, { status: 404 });
    }

    return Response.json({ post });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("UNIQUE")
        ? "A post with that title/slug already exists. Try a different title."
        : "Something went wrong saving the post.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return Response.json({ error: "Invalid post id." }, { status: 400 });
  }

  await ensureSchema();
  const db = getDb();
  await db.delete(blogPosts).where(eq(blogPosts.id, postId));

  return Response.json({ ok: true });
}
