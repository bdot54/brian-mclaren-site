// Builds the `[words](address)` markup the blog understands, so Brian can add
// a link with a button instead of typing the markup by hand.

export type InsertLinkResult =
  | { ok: true; body: string; cursor: number }
  | { ok: false; error: string };

// Turns whatever was pasted into a usable address: trims it, adds https:// when
// it's missing, and escapes the characters that would break `[text](address)`.
export function normalizeAddress(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);
  const isSitePath = trimmed.startsWith("/");
  const address = hasScheme || isSitePath ? trimmed : `https://${trimmed}`;
  return address
    .replace(/\s+/g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

// Square brackets would end the link text early, and a line break would split
// the link across lines, so tidy both before building the link.
export function cleanLinkText(raw: string) {
  return raw.replace(/[[\]]/g, "").replace(/\s+/g, " ").trim();
}

export function insertLink(
  body: string,
  start: number,
  end: number,
  text: string,
  rawAddress: string,
): InsertLinkResult {
  const address = normalizeAddress(rawAddress);
  if (!address) {
    return { ok: false, error: "Paste the web address you want to link to." };
  }
  if (/^javascript:/i.test(address)) {
    return { ok: false, error: "That doesn't look like a web address." };
  }

  const label = cleanLinkText(text) || address;
  const markup = `[${label}](${address})`;
  const from = Math.max(0, Math.min(start, body.length));
  const to = Math.max(from, Math.min(end, body.length));

  return {
    ok: true,
    body: body.slice(0, from) + markup + body.slice(to),
    cursor: from + markup.length,
  };
}
