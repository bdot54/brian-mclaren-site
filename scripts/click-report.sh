#!/bin/sh
# Click report for the tracked short links (/rift/..., /sl/...). Usage: scripts/click-report.sh [days=30]
# Needs Node on PATH (export PATH="$HOME/.local/node/bin:$PATH") and a wrangler login.
DAYS="${1:-30}"
cd "$(dirname "$0")/.." || exit 1
npx wrangler d1 execute brian-mclaren-site-db --remote --command "
SELECT campaign, platform, content AS post,
       SUM(CASE WHEN is_bot = 0 THEN 1 ELSE 0 END) AS clicks,
       SUM(CASE WHEN is_bot = 1 THEN 1 ELSE 0 END) AS link_previews
FROM link_clicks
WHERE created_at >= (strftime('%s','now') - $DAYS * 86400) * 1000
GROUP BY campaign, platform, content
ORDER BY campaign, clicks DESC;" --json 2>/dev/null | python3 -c '
import sys, json
rows = json.load(sys.stdin)[0]["results"]
if not rows:
    print("No clicks recorded yet.")
for r in rows:
    print("%-16s %-10s %-28s clicks: %-5s (link previews: %s)" % (r["campaign"], r["platform"], r["post"] or "-", r["clicks"], r["link_previews"]))
'
