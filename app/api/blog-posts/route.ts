import { desc, eq } from "drizzle-orm";
import { ensureSchema, getDb } from "../../../db";
import { blogPosts } from "../../../db/schema";

// Offset new post ids well clear of the imported WordPress archive's
// numeric ids (the largest of those is in the tens of thousands) so the
// two sets never collide once merged on the /archive page.
const ID_OFFSET = 1_000_000_000;

export async function GET() {
  await ensureSchema();
  const db = getDb();
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));

  return Response.json({
    entries: posts.map((post) => ({
      id: ID_OFFSET + post.id,
      slug: post.slug,
      type: "post",
      publishedAt: post.publishedAt.toISOString(),
      modifiedAt: post.updatedAt.toISOString(),
      title: post.title,
      excerpt: post.excerpt,
      taxonomy: { kind: "Blog post", topics: [], book: null },
    })),
  });
}
