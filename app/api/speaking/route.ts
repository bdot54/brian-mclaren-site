import { ensureSchema, getDb } from "../../../db";
import { speakingInquiries } from "../../../db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: string | undefined, length = 600) {
  return value?.trim().slice(0, length) ?? "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      organization?: string;
      proposedDates?: string;
      audience?: string;
      format?: string;
      topics?: string;
      message?: string;
      consent?: string;
      website?: string;
    };

    if (payload.website) {
      return Response.json({ ok: true });
    }

    const inquiry = {
      name: clean(payload.name, 100),
      email: clean(payload.email, 240).toLowerCase(),
      organization: clean(payload.organization, 180),
      proposedDates: clean(payload.proposedDates, 180),
      audience: clean(payload.audience, 300),
      format: clean(payload.format, 100),
      topics: clean(payload.topics, 500),
      message: clean(payload.message, 3000),
      consent: payload.consent === "yes",
    };

    if (
      !inquiry.name ||
      !EMAIL_PATTERN.test(inquiry.email) ||
      !inquiry.organization ||
      !inquiry.proposedDates ||
      !inquiry.audience ||
      !inquiry.format ||
      !inquiry.consent
    ) {
      return Response.json(
        { error: "Please complete the required fields." },
        { status: 400 },
      );
    }

    await ensureSchema();
    const db = getDb();
    await db.insert(speakingInquiries).values(inquiry);

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json(
      { error: "The inquiry form is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}
