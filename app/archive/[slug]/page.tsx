"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type ArchiveIndex = {
  entries: Array<{ id: number; slug: string }>;
};

type ArchiveEntry = {
  title: string;
  publishedAt: string;
  modifiedAt: string;
  body: string;
  published?: boolean;
  taxonomy: {
    kind: string;
    topics: string[];
    book: string | null;
  };
};

// Markdown links and bold, plus plain web addresses, with or without square
// brackets, so Brian can paste a link and have it work.
const INLINE_MARKUP =
  /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\[(https?:\/\/[^\]\s]+)\]|(https?:\/\/[^\s<>[\]()]+)/g;
const IMAGE_PARAGRAPH = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const LINKED_IMAGE_PARAGRAPH = /^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/;

function renderInlineLinks(text: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  INLINE_MARKUP.lastIndex = 0;
  while ((match = INLINE_MARKUP.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, label, href, bold, bracketedUrl, bareUrl] = match;
    if (bold !== undefined) {
      nodes.push(<strong key={key++}>{bold}</strong>);
    } else if (bracketedUrl !== undefined) {
      nodes.push(
        <a href={bracketedUrl} target="_blank" rel="noreferrer" key={key++}>
          {bracketedUrl}
        </a>,
      );
    } else if (bareUrl !== undefined) {
      const trailing = bareUrl.match(/[.,;:!?]+$/)?.[0] ?? "";
      const url = trailing ? bareUrl.slice(0, -trailing.length) : bareUrl;
      nodes.push(
        <a href={url} target="_blank" rel="noreferrer" key={key++}>
          {url}
        </a>,
      );
      if (trailing) nodes.push(trailing);
    } else {
      nodes.push(
        href.startsWith("/") ? (
          <Link href={href} key={key++}>
            {label}
          </Link>
        ) : (
          <a href={href} target="_blank" rel="noreferrer" key={key++}>
            {label}
          </a>
        ),
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export default function ArchiveEntryPage() {
  const params = useParams<{ slug: string }>();
  const [entry, setEntry] = useState<ArchiveEntry | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch("/archive/index.json")
      .then((response) => response.json())
      .then((index: ArchiveIndex) => {
        const record = index.entries.find((item) => item.slug === params.slug);
        if (record) {
          return fetch(`/archive/content/${record.id}.json`).then((response) =>
            response.json(),
          );
        }
        // Not in the static WordPress import — check Brian's live posts.
        return fetch(`/api/blog-posts/${params.slug}`).then((response) => {
          if (!response.ok) {
            setMissing(true);
            return null;
          }
          return response.json();
        });
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
      {entry.published === false ? (
        <p className="archive-draft-banner">
          Draft preview — this post isn’t published yet. Only you can see this page.
        </p>
      ) : null}
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
        <div className="archive-tags archive-entry-tags" aria-label="Entry categories">
          <span className="archive-tag archive-tag-kind">{entry.taxonomy.kind}</span>
          {entry.taxonomy.topics.map((topic) => (
            <span className="archive-tag" key={topic}>{topic}</span>
          ))}
          {entry.taxonomy.book ? (
            <span className="archive-tag archive-tag-book">Book: {entry.taxonomy.book}</span>
          ) : null}
        </div>
        <div className="archive-entry-body">
          {entry.body.split(/\n{2,}/).map((paragraph, index) => {
            const key = `${index}-${paragraph.slice(0, 30)}`;
            const trimmed = paragraph.trim();
            const linkedImageMatch = trimmed.match(LINKED_IMAGE_PARAGRAPH);
            const imageMatch = linkedImageMatch ?? trimmed.match(IMAGE_PARAGRAPH);

            if (imageMatch) {
              const [, alt, src, href] = linkedImageMatch
                ? linkedImageMatch
                : [imageMatch[0], imageMatch[1], imageMatch[2], undefined];
              const image = (
                <Image src={src} alt={alt} width={1320} height={2115} sizes="(max-width: 700px) 60vw, 320px" />
              );
              return (
                <div className="archive-entry-image" key={key}>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer">
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </div>
              );
            }

            return (
              <p key={key}>
                {paragraph.split("\n").map((line, lineIndex, lines) => (
                  <span key={lineIndex}>
                    {renderInlineLinks(line)}
                    {lineIndex < lines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            );
          })}
        </div>
      </article>
    </main>
  );
}
