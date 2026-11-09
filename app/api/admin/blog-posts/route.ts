import { desc } from "drizzle-orm";
import { isAdminRequest } from "../../../admin/auth";
import { slugify } from "../../../admin/slug";
import { ensureSchema, getDb } from "../../../../db";
import { blogPosts } from "../../../../db/schema";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureSchema();
  const db = getDb();
  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt));

  return Response.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
    const now = new Date();
    const [post] = await db
      .insert(blogPosts)
      .values({ title, slug, excerpt, body, published, publishedAt: now, updatedAt: now })
      .returning();

    return Response.json({ post }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("UNIQUE")
        ? "A post with that title/slug already exists. Try a different title."
        : "Something went wrong saving the post.";
    return Response.json({ error: message }, { status: 400 });
  }
}
