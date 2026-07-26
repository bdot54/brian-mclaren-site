import { env } from "cloudflare:workers";
import { ensureSchema, getDb } from "../../../db";
import { speakingInquiries } from "../../../db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_RECIPIENT = "mclaren.brian@gmail.com";

type Inquiry = {
  name: string;
  email: string;
  organization: string;
  proposedDates: string;
  audience: string;
  format: string;
  topics: string;
  message: string;
  consent: boolean;
};

function clean(value: string | undefined, length = 600) {
  return value?.trim().slice(0, length) ?? "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatInquiryText(inquiry: Inquiry) {
  return [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Organization: ${inquiry.organization}`,
    `Proposed date(s): ${inquiry.proposedDates}`,
    `Audience: ${inquiry.audience}`,
    `Format: ${inquiry.format}`,
    `Topic or theme: ${inquiry.topics || "Not provided"}`,
    "",
    "Additional details:",
    inquiry.message || "Not provided",
  ].join("\n");
}

function formatInquiryHtml(inquiry: Inquiry) {
  const rows = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Organization", inquiry.organization],
    ["Proposed date(s)", inquiry.proposedDates],
    ["Audience", inquiry.audience],
    ["Format", inquiry.format],
    ["Topic or theme", inquiry.topics || "Not provided"],
    ["Additional details", inquiry.message || "Not provided"],
  ];

  return `
    <h1>New speaking inquiry</h1>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value).replaceAll("\n", "<br>")}</td></tr>`,
        )
        .join("")}
    </table>
  `;
}

async function createIdempotencyKey(inquiry: Inquiry) {
  const encoded = new TextEncoder().encode(JSON.stringify(inquiry));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `speaking-inquiry-${hash}`;
}

async function emailInquiry(inquiry: Inquiry) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const apiKey = runtimeEnv.RESEND_API_KEY;
  const from = runtimeEnv.SPEAKING_FROM_EMAIL;
  const to = runtimeEnv.SPEAKING_TO_EMAIL || DEFAULT_RECIPIENT;

  if (!apiKey || !from) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": await createIdempotencyKey(inquiry),
      "User-Agent": "brian-mclaren-site/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject: `Speaking inquiry from ${inquiry.name}`,
      text: formatInquiryText(inquiry),
      html: formatInquiryHtml(inquiry),
    }),
  });

  if (!response.ok) {
    throw new Error("EMAIL_PROVIDER_ERROR");
  }
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

    await emailInquiry(inquiry);
    await ensureSchema();
    const db = getDb();
    await db.insert(speakingInquiries).values(inquiry);

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_NOT_CONFIGURED") {
      return Response.json(
        {
          error:
            "Email delivery is not configured yet. Please try again later.",
        },
        { status: 503 },
      );
    }

    if (error instanceof Error && error.message === "EMAIL_PROVIDER_ERROR") {
      return Response.json(
        {
          error:
            "We could not email your inquiry. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    return Response.json(
      { error: "The inquiry form is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}
