import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const archiveRoot = join(siteRoot, "public", "archive");
const contentRoot = join(archiveRoot, "content");
const wordpressRoot = "https://brianmclaren.net/wp-json/wp/v2";
const contentTypes = ["posts", "pages", "portfolio"];

const eventLogisticsPattern =
  /\b(register|registration|tickets?|eventbrite|venue|lodging|check-?in|schedule|calendar|directions|giftcards|conference|retreat|webinar|workshop|speaking (?:at|in)|speaking engagement|i(?:'|’)ll be (?:speaking|at)|you(?:'|’)re invited|coming up|save the date|join (?:me|us) (?:at|in))\b/i;
const eventTitlePattern =
  /\b(friends in|where i(?:'|’)ll be|i(?:'|’)ll be at|coming up|you(?:'|’)re invited|southern lights)\b/i;
const emailArtifactPattern =
  /data-saferedirecturl|google\.com\/url\?q=|\[here\]|m_\d{6,}/i;

const bookTitles = [
  "A Generous Orthodoxy",
  "A New Kind of Christian",
  "Everything Must Change",
  "Do I Stay Christian",
  "Faith After Doubt",
  "Naked Spirituality",
  "We Make the Road by Walking",
  "Life After Doom",
  "The Great Rift",
  "The Last Voyage",
  "The Seventh Story",
  "Cory and the Seventh Story",
  "The Galápagos Islands",
  "Why Did Jesus, Moses, the Buddha, and Mohammed Cross the Road",
  "The Secret Message of Jesus",
  "Finding Our Way Again",
  "The Story We Find Ourselves In",
  "A Search for What Is Real",
  "The Church on the Other Side",
  "The Justice Project",
  "The Beautiful Logic of a Meaningful Life",
  "More Ready Than You Realize",
  "The Great Spiritual Migration",
  "A New Kind of Christianity",
  "The Rebirthing of God",
  "The Word of the Lord to Evangelicals",
  "The Word of the Lord to Democrats",
  "The Word of the Lord to Republicans",
];

const topicRules = [
  ["Faith & Spirituality", /\b(faith|god|jesus|christian\w*|church\w*|prayer\w*|spiritual\w*|theolog\w*|religion\w*|scripture\w*|bible)\b/gi],
  ["Justice & Society", /\b(justice|racial\w*|racism|democracy|politic\w*|peace|violence|war|immigra\w*|inequality|poverty)\b/gi],
  ["Ecology & Climate", /\b(climate\w*|ecolog\w*|earth|environment\w*|planet\w*|species|extinction|nature|creation)\b/gi],
  ["Community & Belonging", /\b(community|belonging|neighbor|friendship|family|together|relationship)\b/gi],
  ["Courage & Hope", /\b(courage|hope|grief|healing|resilien|compassion|love|joy)\b/gi],
  ["Culture & Story", /\b(story|fiction|novel|culture|art|music|film|media|imagination)\b/gi],
];

function decodeHtml(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function htmlToText(value = "") {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<(br|\/p|\/div|\/h[1-6]|\/li|\/blockquote)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),
  );
}

function excerptFrom(body) {
  const compact = body.replace(/\s+/g, " ").trim();
  return compact.length > 280 ? `${compact.slice(0, 277).trimEnd()}…` : compact;
}

const stopWords = new Set(
  "about after again against all also an and any are as at be been before being between both but by can could did do does doing for from had has have he her here him his how i if in into is it its just me more most my no not of on one or or our out over own same she should so some such than that the their them then there these they this those through to too under up us was we were what when where which who why will with would you your".split(
    " ",
  ),
);

function searchableTerms(value) {
  return [
    ...new Set(
      (value
        .normalize("NFKD")
        .toLowerCase()
        .match(/[a-z0-9]{2,}/g) ?? [])
        .filter((term) => !stopWords.has(term)),
    ),
  ];
}

function normalizedLegacyUrl(value) {
  const url = new URL(value);
  return `${url.origin.toLowerCase()}${url.pathname.replace(/\/+$/, "/")}`;
}

async function fetchAll(type) {
  const fields = [
    "id",
    "date",
    "modified",
    "slug",
    "link",
    "title",
    "content",
    "excerpt",
  ].join(",");
  const firstResponse = await fetch(
    `${wordpressRoot}/${type}?per_page=100&page=1&_fields=${fields}`,
  );

  if (!firstResponse.ok) {
    throw new Error(`Unable to read ${type}: ${firstResponse.status}`);
  }

  const totalPages = Number(firstResponse.headers.get("x-wp-totalpages") ?? "1");
  const firstPage = await firstResponse.json();
  const pageNumbers = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
  const pageResults = await Promise.all(
    pageNumbers.map(async (page) => {
      const response = await fetch(
        `${wordpressRoot}/${type}?per_page=100&page=${page}&_fields=${fields}`,
      );
      if (!response.ok) {
        throw new Error(`Unable to read ${type} page ${page}: ${response.status}`);
      }
      return response.json();
    }),
  );

  console.log(`Imported ${type}: ${totalPages} pages.`);
  return [firstPage, ...pageResults]
    .flat()
    .map((item) => ({ ...item, legacyType: type }));
}

const imported = (await Promise.all(contentTypes.map(fetchAll))).flat();
const usedSlugs = new Set();
function curationReason(item, body) {
  if (item.legacyType !== "posts") return "non-post WordPress content";

  const rawContent = item.content?.rendered ?? "";
  const title = htmlToText(item.title?.rendered ?? "Untitled");
  if (emailArtifactPattern.test(rawContent)) return "email-template artifact";
  if (
    eventLogisticsPattern.test(`${title}\n${body}`) ||
    eventTitlePattern.test(title)
  ) {
    return "time-sensitive event logistics";
  }

  return null;
}

function matchCount(value, pattern) {
  return (value.match(pattern) ?? []).length;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function archiveTaxonomy(title, body) {
  const text = `${title}\n${body}`;
  const bookText = `${title}\n${body.slice(0, 1800)}`;
  const matchedBook = bookTitles.find((book) => {
    const escapedBook = escapeRegExp(book);
    return (
      new RegExp(`\\b${escapedBook}\\b`, "i").test(title) ||
      new RegExp(
        `\\b(?:my |new |latest |this |the )?(?:book|novel|audiobook)\\b[^.!?]{0,80}\\b${escapedBook}\\b|\\b${escapedBook}\\b[^.!?]{0,80}\\b(?:book|novel|audiobook|read|order|buy|release)\\b`,
        "i",
      ).test(bookText)
    );
  });
  const lowerTitle = title.toLowerCase();
  let kind = "Blog post";
  if (/\bpodcast\b/i.test(`${title}\n${body.slice(0, 900)}`)) kind = "Podcast";
  else if (/^(q\s*[&+]\s*[ra]|q\s*[&+]\s*r:|q\s*[&+]\s*r\b)|\bq\s*[&+]\s*r\b/i.test(title)) kind = "Q&A";
  else if (/\b(poem|poetry)\b/i.test(`${title}\n${body.slice(0, 280)}`)) kind = "Poem";
  else if (/\b(sermon|homily)\b/i.test(text)) kind = "Sermon";
  else if (/\b(interview|conversation with|guest appearance)\b/i.test(text)) kind = "Interview";
  else if (matchedBook || /\b(my (new|latest) book|book (?:launch|release|news))\b/i.test(text)) kind = "Book note";
  else if (/\b(reader writes|letter)\b/i.test(lowerTitle)) kind = "Letter";

  const topics = topicRules
    .map(([label, pattern]) => ({ label, score: matchCount(text, pattern) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ label }) => label);

  if (!topics.length) topics.push("Reflection", "Ideas");
  if (topics.length === 1) topics.push("Reflection");

  return { kind, topics, book: matchedBook ?? null };
}

const excluded = [];
const records = imported
  .map((item) => {
    const baseSlug = item.slug || `archive-${item.id}`;
    const slug = usedSlugs.has(baseSlug) ? `${baseSlug}-${item.id}` : baseSlug;
    usedSlugs.add(slug);
    const body = htmlToText(item.content?.rendered || item.excerpt?.rendered || "");

    const record = {
      id: item.id,
      slug,
      sourceUrl: item.link,
      type: item.type ?? "post",
      publishedAt: item.date,
      modifiedAt: item.modified,
      title: htmlToText(item.title?.rendered ?? "Untitled"),
      excerpt: excerptFrom(body),
      body,
      taxonomy: archiveTaxonomy(
        htmlToText(item.title?.rendered ?? "Untitled"),
        body,
      ),
    };
    const reason = curationReason(item, body);
    if (reason) excluded.push({ ...record, reason });
    return reason ? null : record;
  })
  .filter(Boolean)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

const legacyUrlMap = new Map(
  records.map((record) => [normalizedLegacyUrl(record.sourceUrl), record.slug]),
);

function localArchiveUrl(rawUrl) {
  try {
    const absoluteUrl = /^https?:\/\//i.test(rawUrl)
      ? rawUrl
      : `https://${rawUrl}`;
    const parsed = new URL(absoluteUrl);
    const knownSlug = legacyUrlMap.get(normalizedLegacyUrl(absoluteUrl));
    if (knownSlug) return `/archive/${knownSlug}`;
    if (parsed.pathname.includes("books-by-brian-mclaren")) return "/books";
    if (parsed.pathname.includes("contact")) return "/#speaking";
  } catch {
    // Keep the archive self-contained even when an old URL is malformed.
  }
  return "/archive";
}

function rewriteLegacyUrls(value) {
  return value.replace(
    /(?:https?:\/\/)?(?:www\.)?brianmclaren\.net[^\s<>'")\]]*/gi,
    (url) => localArchiveUrl(url),
  );
}

const localRecords = records.map((record) => {
  const localRecord = { ...record };
  delete localRecord.sourceUrl;

  return {
    ...localRecord,
    title: record.title.replace(/\bbrianmclaren\.net\b/gi, "the archive"),
    body: rewriteLegacyUrls(record.body),
    excerpt: rewriteLegacyUrls(record.excerpt),
  };
});

await rm(archiveRoot, { force: true, recursive: true });
await mkdir(contentRoot, { recursive: true });

const index = localRecords.map((record) => {
  const indexRecord = { ...record };
  delete indexRecord.body;
  return indexRecord;
});
const terms = {};

for (const record of localRecords) {
  for (const term of searchableTerms(`${record.title} ${record.body}`)) {
    (terms[term] ??= []).push(record.id);
  }
}

await writeFile(
  join(archiveRoot, "index.json"),
  `${JSON.stringify({
    count: localRecords.length,
    excludedCount: excluded.length,
    entries: index,
  })}\n`,
);
await writeFile(join(archiveRoot, "search-index.json"), `${JSON.stringify(terms)}\n`);

await Promise.all(
  localRecords.map((record) =>
    writeFile(join(contentRoot, `${record.id}.json`), `${JSON.stringify(record)}\n`),
  ),
);

console.log(
  `Imported ${localRecords.length} curated archive entries; excluded ${excluded.length} non-archival records.`,
);
