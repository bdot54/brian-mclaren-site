import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { ensureSchema, getDb } from "../../../db";
import { newsletterSignups } from "../../../db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function addToMailerLiteGroup({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const apiKey = runtimeEnv.MAILERLITE_API_KEY?.trim();
  const groupId = runtimeEnv.MAILERLITE_GROUP_ID?.trim();

  if (!apiKey || !groupId) {
    throw new Error("MailerLite is not configured.");
  }

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      fields: {
        name: firstName,
        last_name: lastName,
      },
      groups: [groupId],
      resubscribe: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`MailerLite rejected the signup (${response.status}).`);
  }
}

async function notifyMailerLiteFailure({
  email,
  firstName,
  lastName,
  reason,
}: {
  email: string;
  firstName: string;
  lastName: string;
  reason: string;
}) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const apiKey = runtimeEnv.RESEND_API_KEY;
  const from = runtimeEnv.SPEAKING_FROM_EMAIL;
  const to = runtimeEnv.NEWSLETTER_ALERT_TO_EMAIL?.trim() || "jodi@jodimclaren.com";

  if (!apiKey || !from) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "brian-mclaren-site/1.0",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "EDGEWISE signup didn't sync to MailerLite",
      text: `${firstName} ${lastName} <${email}> signed up for EDGEWISE, but syncing to MailerLite failed: ${reason}\n\nThey're already saved in the site's database, so nothing is lost, but you'll want to add them to MailerLite by hand.`,
    }),
  });
}

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

    try {
      await addToMailerLiteGroup({ email, firstName, lastName });
    } catch (error) {
      // The signup is already saved above; don't fail the request if
      // MailerLite is unreachable or misconfigured. Just alert so it
      // can be added by hand.
      try {
        await notifyMailerLiteFailure({
          email,
          firstName,
          lastName,
          reason: error instanceof Error ? error.message : "Unknown error",
        });
      } catch {
        // Best-effort alert; nothing more to do if this also fails.
      }
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "The list is temporarily unavailable. Please try again soon." },
      { status: 500 },
    );
  }
}
