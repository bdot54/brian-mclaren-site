import { eq } from "drizzle-orm";
import { ensureSchema, getDb } from "../../../db";
import { newsletterSignups } from "../../../db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      firstName?: string;
      email?: string;
      consent?: string;
      website?: string;
    };

    if (payload.website) {
      return Response.json({ ok: true });
    }

    const firstName = payload.firstName?.trim().slice(0, 80) ?? "";
    const email = payload.email?.trim().toLowerCase().slice(0, 240) ?? "";

    if (!firstName || !EMAIL_PATTERN.test(email) || payload.consent !== "yes") {
      return Response.json(
        { error: "Please enter your name and a valid email address." },
        { status: 400 },
      );
    }

    await ensureSchema();
    const db = getDb();
    const existing = await db
      .select({ id: newsletterSignups.id })
      .from(newsletterSignups)
      .where(eq(newsletterSignups.email, email))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(newsletterSignups).values({
        firstName,
        email,
        consent: true,
      });
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "The list is temporarily unavailable. Please try again soon." },
      { status: 500 },
    );
  }
}
