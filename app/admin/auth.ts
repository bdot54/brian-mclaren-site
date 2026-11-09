import { env } from "cloudflare:workers";
import { ADMIN_USERNAME } from "./constants";

// Shared-password admin auth for Brian's self-serve blog editor. The
// session cookie is an HMAC of a fixed string keyed by the admin password
// itself, so no server-side session storage is needed, and rotating the
// password (via `wrangler secret put BLOG_ADMIN_PASSWORD`) automatically
// invalidates every existing cookie.
const COOKIE_NAME = "blog_admin_session";
const SESSION_PAYLOAD = "brian-mclaren-blog-admin";

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signToken(secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(SESSION_PAYLOAD),
  );
  return bufferToHex(signature);
}

function getAdminPassword() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  return runtimeEnv.BLOG_ADMIN_PASSWORD?.trim() ?? "";
}

export function checkAdminCredentials(username: string, password: string) {
  const expected = getAdminPassword();
  return Boolean(expected) && username === ADMIN_USERNAME && password === expected;
}

export async function createSessionCookie() {
  const token = await signToken(getAdminPassword());
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function isAdminRequest(request: Request) {
  const secret = getAdminPassword();
  if (!secret) return false;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;

  const token = match.slice(COOKIE_NAME.length + 1);
  const expected = await signToken(secret);
  return token === expected;
}
