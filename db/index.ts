import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}

export async function ensureSchema() {
  if (!env.DB) {
    throw new Error("The site database is unavailable.");
  }

  await env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS newsletter_signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL DEFAULT '',
        consent INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL
      )
    `),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS speaking_inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        organization TEXT NOT NULL,
        proposed_dates TEXT NOT NULL,
        audience TEXT NOT NULL,
        format TEXT NOT NULL,
        venue_or_city TEXT NOT NULL DEFAULT '',
        link TEXT NOT NULL DEFAULT '',
        topics TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL DEFAULT '',
        consent INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL
      )
    `),
    env.DB.prepare(
      "CREATE INDEX IF NOT EXISTS speaking_inquiries_created_at_idx ON speaking_inquiries(created_at)",
    ),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL DEFAULT '',
        body TEXT NOT NULL,
        published INTEGER NOT NULL DEFAULT 1,
        published_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `),
    env.DB.prepare(
      "CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at)",
    ),
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS blog_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content_type TEXT NOT NULL,
        data BLOB NOT NULL,
        created_at INTEGER NOT NULL
      )
    `),
  ]);

  // Backfill columns for databases created before venue_or_city/link existed.
  // SQLite has no "ADD COLUMN IF NOT EXISTS", so these are run individually
  // and a "duplicate column" failure (already-migrated database) is expected
  // and safe to ignore.
  for (const column of [
    "ALTER TABLE newsletter_signups ADD COLUMN last_name TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE newsletter_signups ADD COLUMN utm_source TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE newsletter_signups ADD COLUMN utm_medium TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE newsletter_signups ADD COLUMN utm_campaign TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE newsletter_signups ADD COLUMN utm_content TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE speaking_inquiries ADD COLUMN venue_or_city TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE speaking_inquiries ADD COLUMN link TEXT NOT NULL DEFAULT ''",
  ]) {
    try {
      await env.DB.prepare(column).run();
    } catch {
      // Column already exists; nothing to do.
    }
  }
}
