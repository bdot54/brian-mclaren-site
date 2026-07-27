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
  externalUrl?: string;
  taxonomy: {
    kind: string;
    topics: string[];
    book: string | null;
  };
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
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/archive/index.json").then((response) => response.json()),
      fetch("/archive/search-index.json").then((response) => response.json()),
      fetch("/archive/verified-media.json").then((response) => response.json()),
    ]).then(([index, searchTerms, media]) => {
      setArchive({ ...index, count: index.count + media.length, entries: [...media, ...index.entries] });
      setTerms(searchTerms);
    });
  }, []);

  const contentTypes = useMemo(
    () =>
      archive
        ? [...new Set(archive.entries.map((entry) => entry.taxonomy.kind))].sort()
        : [],
    [archive],
  );
  const books = useMemo(
    () =>
      archive
        ? [...new Set(archive.entries.flatMap((entry) => entry.taxonomy.book ? [entry.taxonomy.book] : []))].sort()
        : [],
    [archive],
  );
  const hasFilters = selectedKinds.length > 0 || selectedBooks.length > 0;

  const results = useMemo(() => {
    if (!archive) return [];
    const requestedTerms = queryTerms(query);
    if (requestedTerms.length && !terms) return [];

    const matchedIds = requestedTerms.length
      ? requestedTerms
      .map((term) => terms[term] ?? [])
      .reduce<number[] | null>(
        (matches, termMatches) =>
          matches === null
            ? termMatches
            : matches.filter((id) => termMatches.includes(id)),
        null,
      )
      : null;

    return archive.entries
      .filter((entry) =>
        (!matchedIds || matchedIds.includes(entry.id)) &&
        (!selectedKinds.length || selectedKinds.includes(entry.taxonomy.kind)) &&
        (!selectedBooks.length || (entry.taxonomy.book && selectedBooks.includes(entry.taxonomy.book))),
      )
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
      .slice(0, requestedTerms.length || hasFilters ? 60 : 24);
  }, [archive, query, terms, selectedKinds, selectedBooks, hasFilters]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: (values: string[]) => void,
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
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
          Search a curated collection of Brian’s essays, conversations,
          podcast appearances, and other enduring work.
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

        <details className="archive-filters">
          <summary>Filter your search</summary>
          <div className="archive-filter-groups">
            <fieldset>
              <legend>Content type</legend>
              <div className="archive-filter-options">
                {contentTypes.map((kind) => (
                  <label key={kind}>
                    <input
                      type="checkbox"
                      checked={selectedKinds.includes(kind)}
                      onChange={() => toggleSelection(kind, selectedKinds, setSelectedKinds)}
                    />
                    {kind}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Book</legend>
              <div className="archive-filter-options archive-filter-books">
                {books.map((book) => (
                  <label key={book}>
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book)}
                      onChange={() => toggleSelection(book, selectedBooks, setSelectedBooks)}
                    />
                    {book}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          {hasFilters ? (
            <button
              className="archive-clear-filters"
              type="button"
              onClick={() => {
                setSelectedKinds([]);
                setSelectedBooks([]);
              }}
            >
              Clear filters
            </button>
          ) : null}
        </details>
      </section>

      <section className="archive-results" aria-live="polite">
        <div className="archive-results-heading">
          <h2>
            {archive
              ? query.trim() || hasFilters
                ? `${results.length} matching entries`
                : `Latest entries from ${archive.count.toLocaleString()} archived pieces`
              : "Loading the curated archive…"}
          </h2>
        </div>

        {results.map((entry) => {
          const ResultLink = entry.externalUrl ? "a" : Link;
          const linkProps = entry.externalUrl ? { href: entry.externalUrl, target: "_blank", rel: "noreferrer" } : { href: `/archive/${entry.slug}` };
          return <ResultLink
            {...linkProps}
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
              <div className="archive-tags" aria-label="Entry categories">
                <span className="archive-tag archive-tag-kind">{entry.taxonomy.kind}</span>
                {entry.taxonomy.topics.map((topic) => (
                  <span className="archive-tag" key={topic}>{topic}</span>
                ))}
                {entry.taxonomy.book ? (
                  <span className="archive-tag archive-tag-book">Book: {entry.taxonomy.book}</span>
                ) : null}
              </div>
            </div>
            <span aria-hidden="true">→</span>
          </ResultLink>;
        })}

        {archive && query.trim() && !results.length ? (
          <p className="archive-empty">
            No entries match that search yet. Try a broader word or phrase.
          </p>
        ) : null}
      </section>
    </main>
  );
}
