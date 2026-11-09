import { Launch } from "./launch";

// Temporary Great Rift promotion (launch: November 3, 2026).
// Flip GREAT_RIFT_PROMO to false to restore the original announcement bar,
// nav label, and EDGEWISE signup on the homepage.
export const GREAT_RIFT_PROMO = true;

export function GreatRiftBanner() {
  if (!GREAT_RIFT_PROMO) return null;
  return (
    <div className="announcement">
      <span>New novel</span>
      {/* Plain link on purpose: /rift/web-banner is a tracked redirect, not a page. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/rift/web-banner">
        <Launch
          before="The Great Rift is out November 3. Read the first four chapters free →"
          after="The Great Rift is out now. Read the first four chapters free →"
        />
      </a>
    </div>
  );
}
