import { and, eq } from "drizzle-orm";
import { isAdminRequest } from "../../../admin/auth";
import { ensureSchema, getDb } from "../../../../db";
import { blogPosts } from "../../../../db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  await ensureSchema();
  const db = getDb();
  // Drafts are only visible to a logged-in admin previewing their own
  // unpublished work; everyone else only ever sees published posts.
  const isAdmin = await isAdminRequest(request);
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(
      isAdmin
        ? eq(blogPosts.slug, slug)
        : and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)),
    )
    .limit(1);

  if (!post) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  return Response.json({
    title: post.title,
    publishedAt: post.publishedAt.toISOString(),
    modifiedAt: post.updatedAt.toISOString(),
    body: post.body,
    published: post.published,
    taxonomy: { kind: "Blog post", topics: [], book: null },
  });
}
