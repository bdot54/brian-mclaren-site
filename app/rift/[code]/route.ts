import { logLinkClick } from "../../../db/link-clicks";

const PLATFORMS: Record<string, { source: string; medium: string }> = {
  fb: { source: "facebook", medium: "social" },
  x: { source: "x", medium: "social" },
  ig: { source: "instagram", medium: "social" },
  threads: { source: "threads", medium: "social" },
  bsky: { source: "bluesky", medium: "social" },
  tiktok: { source: "tiktok", medium: "social" },
  yt: { source: "youtube", medium: "social" },
  linktree: { source: "linktree", medium: "bio" },
  email: { source: "edgewise", medium: "email" },
  web: { source: "website", medium: "banner" },
  from: { source: "friend", medium: "referral" },
};

export function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  return params.then(async ({ code }) => {
    const [platformCode, ...rest] = code.toLowerCase().split("-");
    const platform = PLATFORMS[platformCode];
    const target = new URL("/rift", request.url);

    if (platform) {
      target.searchParams.set("utm_source", platform.source);
      target.searchParams.set("utm_medium", platform.medium);
      target.searchParams.set("utm_campaign", "great-rift");
      const content = rest.join("-").replace(/[^a-z0-9_-]/g, "").slice(0, 60);
      if (content) target.searchParams.set("utm_content", content);
      await logLinkClick(request, {
        campaign: "great-rift",
        platform: platform.source,
        content,
      });
    }

    return Response.redirect(target.toString(), 302);
  });
}
