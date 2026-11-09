import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanLinkText,
  insertLink,
  normalizeAddress,
} from "../app/admin/blog/insert-link.ts";

// Same pattern the blog page uses to turn `[words](address)` into a link.
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/;

test("wraps the selected words in a link", () => {
  const body = "Join us at Southern Lights this winter.";
  const start = body.indexOf("Southern Lights");
  const end = start + "Southern Lights".length;
  const result = insertLink(body, start, end, "Southern Lights", "https://southernlightsconference.com/");
  assert.equal(result.ok, true);
  assert.equal(
    result.body,
    "Join us at [Southern Lights](https://southernlightsconference.com/) this winter.",
  );
  assert.equal(result.cursor, result.body.indexOf(" this winter."));
});

test("adds https:// when the address has none", () => {
  assert.equal(normalizeAddress("southernlightsconference.com"), "https://southernlightsconference.com");
  assert.equal(normalizeAddress("  www.example.com/page  "), "https://www.example.com/page");
});

test("leaves full addresses, mailto links and site paths alone", () => {
  assert.equal(normalizeAddress("http://example.com/a"), "http://example.com/a");
  assert.equal(normalizeAddress("https://example.com/a"), "https://example.com/a");
  assert.equal(normalizeAddress("mailto:jodi@jodimclaren.com"), "mailto:jodi@jodimclaren.com");
  assert.equal(normalizeAddress("/archive/the-story-so-far"), "/archive/the-story-so-far");
});

test("escapes spaces and parentheses that would break the link", () => {
  assert.equal(
    normalizeAddress("https://example.com/a book (2nd ed)"),
    "https://example.com/a%20book%20%282nd%20ed%29",
  );
});

test("removes square brackets and line breaks from the link words", () => {
  assert.equal(cleanLinkText("Read [this]\n  now"), "Read this now");
});

test("uses the address as the words when nothing is selected or typed", () => {
  const result = insertLink("Hello. ", 7, 7, "", "https://example.com");
  assert.equal(result.ok, true);
  assert.equal(result.body, "Hello. [https://example.com](https://example.com)");
});

test("inserts at the cursor without disturbing the text around it", () => {
  const result = insertLink("Before  after", 7, 7, "the site", "example.com");
  assert.equal(result.ok, true);
  assert.equal(result.body, "Before [the site](https://example.com) after");
});

test("asks for an address when it is empty", () => {
  const result = insertLink("Text", 0, 4, "Text", "   ");
  assert.equal(result.ok, false);
  assert.match(result.error, /web address/i);
});

test("refuses javascript: addresses", () => {
  const result = insertLink("Text", 0, 4, "Text", "javascript:alert(1)");
  assert.equal(result.ok, false);
});

test("the result is a link the blog page will render", () => {
  const result = insertLink("Visit us", 0, 8, "Visit us", "https://example.com/x?a=1&b=2");
  assert.equal(result.ok, true);
  const match = result.body.match(MARKDOWN_LINK);
  assert.ok(match);
  assert.equal(match[1], "Visit us");
  assert.equal(match[2], "https://example.com/x?a=1&b=2");
});

test("clamps a selection that runs past the end of the text", () => {
  const result = insertLink("Short", 3, 99, "rt", "example.com");
  assert.equal(result.ok, true);
  assert.equal(result.body, "Sho[rt](https://example.com)");
});
