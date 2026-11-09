"use client";

import { useState } from "react";
import { useGreatRiftLaunched } from "../launch";

function CopyBox({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the text is selectable, so people can copy by hand.
    }
  }

  return (
    <div className="share-box">
      <div className="share-box-head">
        <strong>{title}</strong>
        <button type="button" className="button button-secondary share-copy" onClick={copy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="share-text">{text}</p>
    </div>
  );
}

export function ShareKit({ slug, uk = false }: { slug: string; uk?: boolean }) {
  const launched = useGreatRiftLaunched();
  const buy = `https://www.brianmclaren.net/buy/${uk ? "fromuk" : "from"}-${slug}`;
  const chapters = `https://www.brianmclaren.net/rift/from-${slug}`;
  const when = launched
    ? "is out now"
    : uk
      ? "comes out this November"
      : "comes out November 3";

  const short = `Brian McLaren's new novel, The Great Rift, ${when}, in print and audio. It's book two of his Mars trilogy, a story about what we carry and what we leave behind. Get your copy: ${buy}`;
  const chaptersLine = `If you'd like a taste first, Brian is offering the first four chapters free: ${chapters}`;
  const long = `The Great Rift, the second book in Brian McLaren's Mars trilogy, ${when}. In this story, word reaches the crew aboard the Ark about a new outbreak of chaos at the Mars colony. As Eve Innis and her small team sift through some disturbing messages from the Mars Base archives, they uncover a pattern that reaches back to Earth. It's a story about what we carry and what we leave behind.\n\nGet your copy of The Great Rift (print and audio): ${buy}\nIf you'd like a taste first, Brian is offering the first four chapters free: ${chapters}`;
  const spoken = `Brian McLaren's new novel, The Great Rift, ${when}, in print and audio. You can find it at brianmclaren.net/rift.`;

  return (
    <div className="share-boxes">
      <CopyBox title="Short post (Facebook, Instagram, Threads, X, Bluesky)" text={short} />
      <CopyBox title="Optional follow-up (reply or first comment)" text={chaptersLine} />
      <CopyBox title="Longer blurb (newsletter, blog, group email)" text={long} />
      <CopyBox title="One line to say out loud (podcast, pulpit, announcements)" text={spoken} />
    </div>
  );
}
