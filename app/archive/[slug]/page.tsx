"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ArchiveIndex = {
  entries: Array<{ id: number; slug: string }>;
};

type ArchiveEntry = {
  title: string;
  publishedAt: string;
  modifiedAt: string;
  body: string;
};

export default function ArchiveEntryPage() {
  const params = useParams<{ slug: string }>();
  const [entry, setEntry] = useState<ArchiveEntry | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch("/archive/index.json")
      .then((response) => response.json())
      .then((index: ArchiveIndex) => {
        const record = index.entries.find((item) => item.slug === params.slug);
        if (!record) {
          setMissing(true);
          return null;
        }
        return fetch(`/archive/content/${record.id}.json`).then((response) =>
          response.json(),
        );
      })
      .then((record) => record && setEntry(record));
  }, [params.slug]);

  if (missing) {
    return (
      <main className="archive-entry-page archive-not-found">
        <p className="eyebrow">Archive</p>
        <h1>That entry isn’t available.</h1>
        <Link href="/archive">Search the archive</Link>
      </main>
    );
  }

  if (!entry) {
    return <main className="archive-entry-page">Loading entry…</main>;
  }

  return (
    <main className="archive-entry-page">
      <Link href="/archive" className="archive-back">
        ← Back to the archive
      </Link>
      <article>
        <p className="eyebrow">Archive entry</p>
        <time dateTime={entry.publishedAt}>
          {new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(entry.publishedAt))}
        </time>
        <h1>{entry.title}</h1>
        <div className="archive-entry-body">
          {entry.body.split(/\n{2,}/).map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 30)}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
