import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newsletterSignups = sqliteTable("newsletter_signups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull().default(""),
  consent: integer("consent", { mode: "boolean" }).notNull().default(true),
  utmSource: text("utm_source").notNull().default(""),
  utmMedium: text("utm_medium").notNull().default(""),
  utmCampaign: text("utm_campaign").notNull().default(""),
  utmContent: text("utm_content").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const speakingInquiries = sqliteTable("speaking_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull(),
  proposedDates: text("proposed_dates").notNull(),
  audience: text("audience").notNull(),
  format: text("format").notNull(),
  venueOrCity: text("venue_or_city").notNull().default(""),
  link: text("link").notNull().default(""),
  topics: text("topics").notNull().default(""),
  message: text("message").notNull().default(""),
  consent: integer("consent", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  publishedAt: integer("published_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const blogImages = sqliteTable("blog_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contentType: text("content_type").notNull(),
  data: blob("data", { mode: "buffer" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
