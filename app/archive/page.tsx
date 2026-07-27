"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ArchiveEntry = {
  id: number;
  slug: string;
  type: string;
  publishedAt: string;
  modifiedAt: string;
  title: string;
  excerpt: string;
};

type ArchiveIndex = {
  count: number;
  entries: ArchiveEntry[];
};

type SearchTerms = Record<string, number[]>;

function queryTerms(query: string) {
  return [...new Set(query.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [])];
}

export default function ArchivePage() {
  const searchParams = useSearchParams();
  const [archive, setArchive] = useState<ArchiveIndex | null>(null);
  const [terms, setTerms] = useState<SearchTerms | null>(null);
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    Promise.all([
      fetch("/archive/index.json").then((response) => response.json()),
      fetch("/archive/search-index.json").then((response) => response.json()),
    ]).then(([index, searchTerms]) => {
      setArchive(index);
      setTerms(searchTerms);
    });
  }, []);

  const results = useMemo(() => {
    if (!archive) return [];
    const requestedTerms = queryTerms(query);
    if (!requestedTerms.length) return archive.entries.slice(0, 24);
    if (!terms) return [];

    const matchedIds = requestedTerms
      .map((term) => terms[term] ?? [])
      .reduce<number[] | null>(
        (matches, termMatches) =>
          matches === null
            ? termMatches
            : matches.filter((id) => termMatches.includes(id)),
        null,
      );

    return archive.entries
      .filter((entry) => matchedIds?.includes(entry.id))
      .sort((a, b) => {
        const score = (entry: ArchiveEntry) =>
          requestedTerms.reduce(
            (total, term) =>
              total +
              (entry.title.toLowerCase().includes(term) ? 8 : 0) +
              (entry.excerpt.toLowerCase().includes(term) ? 2 : 0),
            0,
          );
        return score(b) - score(a) || b.publishedAt.localeCompare(a.publishedAt);
      })
      .slice(0, 60);
  }, [archive, query, terms]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="archive-page">
      <header className="archive-header">
        <Link href="/" className="archive-brand">
          <span aria-hidden="true">BM</span>
          Brian D. McLaren
        </Link>
        <Link href="/" className="archive-home-link">
          Back to the site
        </Link>
      </header>

      <section className="archive-hero">
        <p className="eyebrow">The Brian D. McLaren archive</p>
        <h1>Two decades of questions, ideas, and conversation.</h1>
        <p>
          Search Brian’s complete collection of writings, event notes, and
          other work—now available here.
        </p>

        <form className="archive-page-search" onSubmit={submitSearch}>
          <label htmlFor="archive-page-query">Search the complete archive</label>
          <div>
            <input
              id="archive-page-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Faith, doubt, ecology…"
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </section>

      <section className="archive-results" aria-live="polite">
        <div className="archive-results-heading">
          <h2>
            {archive
              ? query.trim()
                ? `${results.length} matching entries`
                : `Latest entries from ${archive.count.toLocaleString()} archived pieces`
              : "Loading the complete archive…"}
          </h2>
        </div>

        {results.map((entry) => (
          <Link
            href={`/archive/${entry.slug}`}
            className="archive-result"
            key={entry.id}
          >
            <time dateTime={entry.publishedAt}>
              {new Intl.DateTimeFormat("en", {
                month: "short",
                year: "numeric",
              }).format(new Date(entry.publishedAt))}
            </time>
            <div>
              <h2>{entry.title}</h2>
              <p>{entry.excerpt}</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        ))}

        {archive && query.trim() && !results.length ? (
          <p className="archive-empty">
            No entries match that search yet. Try a broader word or phrase.
          </p>
        ) : null}
      </section>
    </main>
  );
}
