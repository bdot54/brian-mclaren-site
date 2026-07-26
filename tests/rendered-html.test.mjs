import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds the Brian McLaren site and its core journeys", async () => {
  const [site, layout] = await Promise.all([
    readFile(new URL("../app/site.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    access(new URL("../dist/server/index.js", import.meta.url)),
  ]);

  assert.match(layout, /Brian D\. McLaren/);
  assert.match(site, /Exploring faith, courage/);
  assert.match(site, /The Last Voyage/);
  assert.match(site, /Begin a speaking inquiry/);
  assert.match(site, /mclaren\.brian@gmail\.com/);
  assert.match(site, /inquiryForm\.reset\(\)/);
  assert.doesNotMatch(site, /event\.currentTarget\.reset\(\)/);
  assert.match(site, /Join the letter/);
  assert.doesNotMatch(site, /codex-preview|Your site is taking shape/);
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
  assert.match(
    site,
    /a-new-book-by-a-good-friend-birthing-the-symbiotic-age\//,
  );
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
