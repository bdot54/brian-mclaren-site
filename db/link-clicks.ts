import { env } from "cloudflare:workers";

// Counts clicks on the tracked short links (/rift/<platform>-<post>, /sl/...).
// Stores only the campaign, platform, post tag, referrer host and a bot flag:
// no IP address, user agent or other personal data.
const BOT_PATTERN =
  /bot|crawler|spider|preview|facebookexternalhit|facebot|slurp|embedly|quora|pinterest|whatsapp|telegram|discord|slack|curl|wget|python|httpclient|headless/i;

let tableReady: Promise<unknown> | null = null;

function ensureLinkClicksTable() {
  if (!env.DB) return Promise.resolve();
  tableReady ??= env.DB.batch([
    env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS link_clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign TEXT NOT NULL,
        platform TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        referrer_host TEXT NOT NULL DEFAULT '',
        is_bot INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `),
    env.DB.prepare(
      "CREATE INDEX IF NOT EXISTS link_clicks_campaign_idx ON link_clicks(campaign, created_at)",
    ),
  ]).catch((error) => {
    tableReady = null;
    throw error;
  });
  return tableReady;
}

export async function logLinkClick(
  request: Request,
  {
    campaign,
    platform,
    content,
  }: { campaign: string; platform: string; content: string },
) {
  try {
    if (!env.DB) return;
    await ensureLinkClicksTable();
    const userAgent = request.headers.get("user-agent") ?? "";
    let referrerHost = "";
    try {
      referrerHost = new URL(request.headers.get("referer") ?? "").hostname;
    } catch {
      // No or malformed referrer.
    }
    await env.DB.prepare(
      "INSERT INTO link_clicks (campaign, platform, content, referrer_host, is_bot, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(
        campaign,
        platform,
        content,
        referrerHost.slice(0, 80),
        !userAgent || BOT_PATTERN.test(userAgent) ? 1 : 0,
        Date.now(),
      )
      .run();
  } catch {
    // Click counting must never break the redirect.
  }
}
