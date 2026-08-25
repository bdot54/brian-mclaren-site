import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newsletterSignups = sqliteTable("newsletter_signups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull().default(true),
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
