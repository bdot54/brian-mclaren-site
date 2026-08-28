import { eq } from "drizzle-orm";
import { ensureSchema, getDb } from "../../../db";
import { newsletterSignups } from "../../../db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      consent?: string;
      website?: string;
    };

    if (payload.website) {
      return Response.json({ ok: true });
    }

    const firstName = payload.firstName?.trim().slice(0, 80) ?? "";
    const lastName = payload.lastName?.trim().slice(0, 80) ?? "";
    const email = payload.email?.trim().toLowerCase().slice(0, 240) ?? "";

    if (
      !firstName ||
      !lastName ||
      !EMAIL_PATTERN.test(email) ||
      payload.consent !== "yes"
    ) {
      return Response.json(
        { error: "Please enter your full name and a valid email address." },
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
        lastName,
        email,
        consent: true,
      });
    } else {
      await db
        .update(newsletterSignups)
        .set({ firstName, lastName, consent: true })
        .where(eq(newsletterSignups.email, email));
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "The list is temporarily unavailable. Please try again soon." },
      { status: 500 },
    );
  }
}
