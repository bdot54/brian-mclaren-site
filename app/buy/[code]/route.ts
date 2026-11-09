import { logLinkClick } from "../../../db/link-clicks";

// Tracked buy link: /buy/<platform>-<post> counts the click, then sends the
// visitor straight to the book on Amazon (Bookshop.org showed backorder on
// 11/5). The "fromuk" code sends UK
// friends to the Hodder hardback on Waterstones instead.
const BUY_URL =
  "https://www.amazon.com/dp/1399838784";
const UK_BUY_URL =
  "https://www.waterstones.com/book/the-great-rift/brian-d-mclaren/9781399838788";

const PLATFORMS: Record<string, string> = {
  fb: "facebook",
  x: "x",
  ig: "instagram",
  threads: "threads",
  bsky: "bluesky",
  tiktok: "tiktok",
  yt: "youtube",
  linktree: "linktree",
  email: "edgewise",
  web: "website",
  from: "friend",
  fromuk: "friend-uk",
};

export function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  return params.then(async ({ code }) => {
    const [platformCode, ...rest] = code.toLowerCase().split("-");
    const platform = PLATFORMS[platformCode];

    if (platform) {
      const content = rest.join("-").replace(/[^a-z0-9_-]/g, "").slice(0, 60);
      await logLinkClick(request, {
        campaign: "great-rift-buy",
        platform,
        content,
      });
    }

    return Response.redirect(
      platformCode === "fromuk" ? UK_BUY_URL : BUY_URL,
      302,
    );
  });
}
