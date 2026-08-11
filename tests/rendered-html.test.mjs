import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds the Brian McLaren site and its core journeys", async () => {
  const [site, layout, scrollRestorer] = await Promise.all([
    readFile(new URL("../app/site.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/scroll-position-restorer.tsx", import.meta.url),
      "utf8",
    ),
    access(new URL("../dist/server/index.js", import.meta.url)),
  ]);

  assert.match(layout, /Brian D\. McLaren/);
  assert.match(layout, /ScrollPositionRestorer/);
  assert.match(scrollRestorer, /sessionStorage\.setItem/);
  assert.match(scrollRestorer, /popstate/);
  assert.match(scrollRestorer, /pageshow/);
  assert.match(site, /Exploring faith, courage/);
  assert.match(site, /The Last Voyage/);
  assert.match(site, /Begin a speaking inquiry/);
  assert.match(site, /inquiryForm\.reset\(\)/);
  assert.match(site, /emailed to Brian’s team/);
  assert.doesNotMatch(site, /mailto:/);
  assert.doesNotMatch(site, /event\.currentTarget\.reset\(\)/);
  assert.match(site, /Join the letter/);
  assert.match(site, /Writer · teacher · public theologian/);
  assert.match(site, /Brian’s Latest &amp; Upcoming Works/);
  assert.match(site, /Books for the journey/);
  assert.match(site, /className="about-portrait"/);
  assert.match(site, /Search an archive of Brian’s writings/);
  assert.match(site, /A thoughtful outreach, only when there’s something to say/);
  assert.match(site, /Join the letter for updates on new writing/);
  assert.match(site, /I’m not sure what I believe/);
  assert.match(site, /You don’t need certainty to begin exploring/);
  assert.match(site, /I want to grow spiritually/);
  assert.match(site, /A deeper spiritual life can begin with simple practices/);
  assert.ok(
    site.indexOf('className="section start-section"') <
      site.indexOf('className="section current-work"'),
  );
  assert.doesNotMatch(site, /restless questioner/);
  assert.doesNotMatch(site, /What Brian is exploring now/);
  assert.doesNotMatch(site, /Ideas for the road ahead/);
  assert.doesNotMatch(site, /codex-preview|Your site is taking shape/);
});

test("links Brian’s work and expands every speaking theme", async () => {
  const site = await readFile(
    new URL("../app/site.tsx", import.meta.url),
    "utf8",
  );

  assert.match(site, /className="about-point about-point-link" href="\/books"/);
  assert.match(site, /https:\/\/cac\.org\/about\/cac-faculty\//);
  assert.match(site, /https:\/\/cac\.org\/podcast\/learning-how-to-see\//);
  assert.match(site, /<details className="topic-item"/);
  assert.match(site, /<summary>/);
  assert.match(site, /topic-description/);
  assert.equal(
    [...site.matchAll(/title: "(?:Faith after certainty|Courage in a world falling apart|Spirituality and social transformation|A just and generous Christianity|Story, belonging, and the human future)"/g)].length,
    5,
  );
});

test("uses server-side transactional email for speaking inquiries", async () => {
  const speakingRoute = await readFile(
    new URL("../app/api/speaking/route.ts", import.meta.url),
    "utf8",
  );

  assert.match(speakingRoute, /https:\/\/api\.resend\.com\/emails/);
  assert.match(speakingRoute, /RESEND_API_KEY/);
  assert.match(speakingRoute, /SPEAKING_FROM_EMAIL/);
  assert.match(speakingRoute, /mclaren\.brian@gmail\.com/);
  assert.match(speakingRoute, /reply_to: inquiry\.email/);
  assert.match(speakingRoute, /Idempotency-Key/);
  assert.match(speakingRoute, /escapeHtml/);
});

test("links every pathway recommendation to its book page", async () => {
  const site = await readFile(
    new URL("../app/site.tsx", import.meta.url),
    "utf8",
  );

  const recommendedBooks = [
    "Faith After Doubt",
    "Do I Stay Christian?",
    "A Generous Orthodoxy",
    "Life After Doom",
    "Everything Must Change",
    "The Galápagos Islands",
    "The Last Voyage",
    "The Great Rift",
    "The Seventh Story",
    "Naked Spirituality",
    "We Make the Road by Walking",
    "A New Kind of Christianity",
  ];

  for (const book of recommendedBooks) {
    assert.match(
      site,
      new RegExp(`"${book.replace(/[?]/g, "\\?")}":?\\s*["\\n]`),
      `Missing link mapping for ${book}`,
    );
  }

  assert.match(site, /href=\{bookLinks\[book\]\}/);
  assert.match(site, /target="_blank"/);
  assert.match(
    site,
    /faithgateway\.com\/products\/everything-must-change-when-the-worlds-biggest-problems-and-jesus-good-news-collide-1/,
  );
  assert.doesNotMatch(site, /thomasnelson\.com/);
  assert.match(site, /zondervan\.com\/author\/1182\/brian-d-mclaren/);
  assert.match(
    site,
    /harpercollins\.com\/products\/naked-spirituality-brian-d-mclaren/,
  );
  assert.match(
    site,
    /harpercollins\.com\/products\/a-new-kind-of-christianity-brian-d-mclaren/,
  );
  assert.doesNotMatch(site, /href: "\/archive\/naked-spirituality/);
});

test("removes starter-only assets and metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /BrianSite/);
  assert.match(layout, /Brian D\. McLaren/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});

test("keeps internal links, media, and verified destinations intact", async () => {
  const site = await readFile(
    new URL("../app/site.tsx", import.meta.url),
    "utf8",
  );

  const ids = new Set(
    [...site.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
  );
  const anchors = new Set(
    [...site.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]),
  );
  for (const anchor of anchors) {
    assert.ok(ids.has(anchor), `Missing destination for #${anchor}`);
  }

  const localImages = new Set(
    [...site.matchAll(/\b(?:image|src):?\s*["'](\/[^"']+\.(?:jpg|png))["']/g)]
      .map((match) => match[1]),
  );
  for (const image of localImages) {
    await access(new URL(`../public${image}`, import.meta.url));
  }

  assert.match(
    site,
    /drive\.google\.com\/drive\/folders\/19OqldLnPUral_BSoofdeH8LKHiDdhwbE/,
  );
  assert.match(site, /instagram\.com\/brian_mclaren\//);
  assert.match(site, /href="#newsletter">Join The Letter<\/a>/);
  assert.match(site, /https:\/\/x\.com\/brianmclaren/);
  assert.match(
    site,
    /a-new-book-by-a-good-friend-birthing-the-symbiotic-age/,
  );
  assert.match(site, /action="\/archive"/);
  assert.doesNotMatch(site, /brianmclaren\.net/);
});

test("includes a searchable, curated local archive", async () => {
  const [archivePage, archiveEntryPage, indexText, entryText] = await Promise.all([
    readFile(new URL("../app/archive/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/archive/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/archive/index.json", import.meta.url), "utf8"),
    readFile(
      new URL("../public/archive/content/78660.json", import.meta.url),
      "utf8",
    ),
  ]);
  const archive = JSON.parse(indexText);

  assert.ok(archive.count > 3000);
  assert.ok(archive.count < 4992);
  assert.ok(archive.excludedCount > 0);
  assert.equal(archive.entries.length, archive.count);
  assert.ok(archive.entries.every((entry) => entry.taxonomy?.kind));
  assert.ok(archive.entries.every((entry) => entry.taxonomy?.topics?.length >= 2));
  assert.match(archivePage, /archive-tags/);
  assert.match(archiveEntryPage, /archive-tag-book/);
  assert.match(archivePage, /Filter your search/);
  assert.match(archivePage, /Content type/);
  assert.match(archivePage, /Clear filters/);
  assert.equal(
    archive.entries.some((entry) => entry.id === 78694),
    false,
    "excludes old Southern Lights event logistics",
  );
  assert.match(archivePage, /search-index\.json/);
  assert.match(archivePage, /Search the complete archive/);
  assert.match(archivePage, /<h2>/);
  assert.match(archiveEntryPage, /archive\/content/);
  assert.doesNotMatch(indexText, /brianmclaren\.net/);
  assert.doesNotMatch(entryText, /brianmclaren\.net/);
});

test("includes a complete first-party books library", async () => {
  const [site, booksPage] = await Promise.all([
    readFile(new URL("../app/site.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/books/page.tsx", import.meta.url), "utf8"),
    access(
      new URL(
        "../public/cory-and-the-seventh-story.jpg",
        import.meta.url,
      ),
    ),
  ]);

  assert.match(site, /href="\/books"/);
  assert.doesNotMatch(site, /books-by-brian-mclaren/);
  assert.match(booksPage, /Cory and the Seventh Story/);
  assert.match(booksPage, /The Great Rift/);
  assert.match(booksPage, /The Last Voyage/);
  assert.match(booksPage, /Life After Doom/);
  assert.match(booksPage, /A New Kind of Christian/);
  assert.match(booksPage, /The Justice Project/);
  assert.match(booksPage, /The Church on the Other Side/);
  assert.match(booksPage, /The Beautiful Logic of a Meaningful Life/);
});
