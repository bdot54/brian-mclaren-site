"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BlogEntry = {
  id: number | string;
  slug: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  externalUrl?: string;
  taxonomy: { kind: string };
};

const PAGE_SIZE = 20;

export function BlogList() {
  const [posts, setPosts] = useState<BlogEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    Promise.all([
      fetch("/archive/index.json").then((response) => response.json()),
      fetch("/api/blog-posts")
        .then((response) => response.json())
        .then((data) => data.entries ?? [])
        .catch(() => []),
    ])
      .then(([index, livePosts]) => {
        const all: BlogEntry[] = [...livePosts, ...index.entries];
        setPosts(
          all
            .filter((entry) => entry.taxonomy?.kind === "Blog post")
            .sort(
              (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime(),
            ),
        );
      })
      .catch(() => setFailed(true));
  }, []);

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
        <p className="eyebrow">Blog</p>
        <h1>Notes from the Journey</h1>
        <p>
          Looking for something older, or a different kind of piece?{" "}
          <Link href="/archive">Search the full archive</Link>.
        </p>
      </section>

      <section className="archive-results" aria-live="polite">
        {failed ? (
          <p className="archive-empty">
            The posts didn’t load. Please refresh the page, or{" "}
            <Link href="/archive">search the archive</Link>.
          </p>
        ) : !posts ? (
          <div className="archive-results-heading">
            <h2>Loading the latest posts…</h2>
          </div>
        ) : (
          <>
            {posts.slice(0, visible).map((entry) => (
              <Link
                href={`/archive/${entry.slug}`}
                className="archive-result"
                key={entry.id}
              >
                <time dateTime={entry.publishedAt}>
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
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
            {visible < posts.length ? (
              <p>
                <button
                  type="button"
                  className="archive-clear-filters"
                  onClick={() => setVisible(visible + PAGE_SIZE)}
                >
                  Show more posts
                </button>
              </p>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
