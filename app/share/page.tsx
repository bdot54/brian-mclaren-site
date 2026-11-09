import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShareKit } from "./share-kit";

export const metadata: Metadata = {
  title: "Share kit: The Great Rift",
  description:
    "Ready-to-post text, images and links for friends sharing Brian D. McLaren's new novel The Great Rift.",
  robots: { index: false, follow: false },
};

const IMAGES = [
  {
    src: "/share/great-rift-share-4x5.jpg",
    label: "Tall (4:5, for Instagram and Facebook)",
    width: 1080,
    height: 1350,
  },
  {
    src: "/share/great-rift-share-square-1080.jpg",
    label: "Square (1:1, for any platform)",
    width: 1080,
    height: 1080,
  },
  {
    src: "/share/great-rift-share-landscape-1200x630.jpg",
    label: "Wide (for links, newsletters and X)",
    width: 1200,
    height: 630,
  },
  {
    src: "/share/the-great-rift-cover.jpg",
    label: "Book cover",
    width: 1320,
    height: 2115,
  },
];

const HANDLES = [
  ["Facebook", "Brian D. McLaren"],
  ["Instagram and Threads", "@brian_mclaren"],
  ["X", "@brianmclaren"],
  ["Bluesky", "@briandmclaren.bsky.social"],
];

function cleanSlug(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const slug = (raw ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 30);
  return slug || "friends";
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const slug = cleanSlug(params.from);
  const uk = params.uk === "1";

  return (
    <div className="site-shell books-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" href="/" aria-label="Brian D. McLaren home">
            <span className="brand-mark" aria-hidden="true">
              BM
            </span>
            <span className="brand-name">Brian D. McLaren</span>
          </Link>
          <Link className="menu-button books-home-link" href="/">
            Home
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="section">
          <div className="section-inner">
            <p className="eyebrow">Share kit</p>
            <h1 className="press-h2" style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)" }}>
              Thank you for helping spread the word
            </h1>
            <p className="share-intro">
              Brian&rsquo;s new novel, <em>The Great Rift</em>, comes out{" "}
              {uk ? "this November" : "November 3"} in print and audio. Everything below is ready to copy
              and use however you like. Change the words so they sound like
              you.
            </p>
            <p className="share-intro">
              Do only what feels natural. One post, a mention to a friend, or
              nothing at all is wonderful, and any day this month works, not
              only November 3. The links have your name in them so we can thank
              you properly.
            </p>
          </div>
        </section>

        <section className="section library-featured" aria-labelledby="share-read-heading">
          <div className="section-inner">
            <h2 id="share-read-heading" className="press-h2">
              Want to read it first?
            </h2>
            <p className="share-intro">
              We&rsquo;d be glad to send you a PDF advance copy. Just
              email Jodi at{" "}
              <a
                className="share-link"
                href="mailto:jodi@jodimclaren.com?subject=Great%20Rift%20Copy%20Request"
              >
                jodi@jodimclaren.com
              </a>{" "}
              with &ldquo;Great Rift Copy Request&rdquo; in the subject line
              and she&rsquo;ll send it right over. You can also get a feel for
              the audiobook with{" "}
              <a
                className="share-link"
                href="/rift/listen"
                target="_blank"
                rel="noreferrer"
              >
                this opening clip
              </a>
              .
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="share-copy-heading">
          <div className="section-inner">
            <h2 id="share-copy-heading" className="press-h2">
              Copy and paste
            </h2>
            <ShareKit slug={slug} uk={uk} />
            <p className="share-intro">
              {uk ? (
                <>
                  These posts link to the UK edition at Waterstones.{" "}
                  <Link className="share-link" href={`/share?from=${slug}`}>
                    Sharing with US followers? Use the US version.
                  </Link>
                </>
              ) : (
                <>
                  Sharing with followers in the UK?{" "}
                  <Link className="share-link" href={`/share?from=${slug}&uk=1`}>
                    Use the UK version of these posts.
                  </Link>
                </>
              )}
            </p>
            <p className="share-intro">
              <strong>Tag Brian if you like:</strong>{" "}
              {HANDLES.map(([name, handle], index) => (
                <span key={name}>
                  {name}: {handle}
                  {index < HANDLES.length - 1 ? " · " : ""}
                </span>
              ))}
              . Hashtags: #TheGreatRift #TheLastVoyage
            </p>
          </div>
        </section>

        <section className="section library-featured" aria-labelledby="share-images-heading">
          <div className="section-inner">
            <h2 id="share-images-heading" className="press-h2">
              Images
            </h2>
            <div className="press-grid">
              {IMAGES.map((image) => (
                <figure key={image.src} className="press-figure">
                  <Image
                    src={image.src}
                    alt={image.label}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 800px) 44vw, 220px"
                  />
                  <figcaption>
                    <a href={image.src} download>
                      {image.label}: download ↓
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="share-thanks-heading">
          <div className="section-inner press-columns">
            <div>
              <h2 id="share-thanks-heading" className="press-h2">
                Thank you
              </h2>
              <p>
                We&rsquo;re so grateful for you. Anything you need, just reply
                to Jodi. She&rsquo;s glad to help.
              </p>
              <p>
                <a className="share-link" href="mailto:jodi@jodimclaren.com">
                  jodi@jodimclaren.com
                </a>
              </p>
            </div>
            <div>
              <h2 className="press-h2">And you?</h2>
              <p>
                Tell us what&rsquo;s coming up for you. Brian would love to
                return the favor.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
