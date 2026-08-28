import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { ensureSchema, getDb } from "../../../db";
import { newsletterSignups } from "../../../db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function subscribeToMailerLite(email: string, firstName: string) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const apiKey = runtimeEnv.MAILERLITE_API_KEY;
  const groupId = runtimeEnv.MAILERLITE_GROUP_ID;

  if (!apiKey) return;

  await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      fields: { name: firstName },
      groups: groupId ? [groupId] : undefined,
    }),
  });
}

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

    try {
      await subscribeToMailerLite(email, firstName);
    } catch {
      // The signup is already saved above; don't fail the request if
      // MailerLite is unreachable.
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "The list is temporarily unavailable. Please try again soon." },
      { status: 500 },
    );
  }
}
