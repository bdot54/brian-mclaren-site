import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Launch } from "../launch";
import { RiftSignupForm } from "./signup-form";

const GREAT_RIFT_PREORDER_URL =
  "https://www.amazon.com/dp/1399838784";
const LAST_VOYAGE_URL =
  "https://bookshop.org/p/books/the-last-voyage-brian-mclaren/20243554";

export const metadata: Metadata = {
  title: "Get the first 4 chapters of The Great Rift",
  description:
    "Join EDGEWISE and get the first four chapters of Brian D. McLaren's new novel The Great Rift, plus a free Last Voyage recap.",
  alternates: { canonical: "/rift" },
};

export default function RiftPage() {
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

          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/#about">About</Link>
            <Link href="/books">Books</Link>
            <Link href="/#speaking">Speaking</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/events">Events</Link>
            <Link className="nav-cta" href="#chapters">
              Get the first four chapters
            </Link>
          </nav>

          <Link className="menu-button books-home-link" href="/">
            Home
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="library-hero no-stats" id="chapters">
          <div className="library-hero-grid rift-hero-grid">
            <div>
              <p className="eyebrow">
                The Great Rift ·{" "}
                <Launch before="Out November 3rd" after="Out now" />
              </p>
              <h1>
                Get the first 4 chapters of <em>The Great Rift</em>
              </h1>
              <p className="hero-dek">
                PLUS a recap of Book 1: The Last Voyage. Catch up, and
                <Launch
                  before=" get ahead before the official release!"
                  after=" get a head start on the new book!"
                />
              </p>
            </div>
            <div className="library-hero-copy">
              <RiftSignupForm />
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="rift-listen-heading">
          <div className="section-inner rift-listen-grid">
            <video
              className="rift-listen-video"
              controls
              playsInline
              preload="none"
              poster="/audio/great-rift-opening-audiogram-poster.jpg"
              src="/audio/great-rift-opening-audiogram.mp4"
            >
              Your browser does not support video playback.
            </video>
            <div className="rift-listen-copy">
              <p className="eyebrow">Listen</p>
              <h2 id="rift-listen-heading">
                Hear the opening of <em>The Great Rift</em>
              </h2>
              <p>
                Narrated by David Brooks. The audiobook is available{" "}
                <Launch before="November 3" after="now" />.
              </p>
              <details>
                <summary>Read the transcript</summary>
                <p>
                  Thurman Howard Thurman had gotten so used to the Ark&rsquo;s
                  hum that he seldom heard it anymore. But after fourteen
                  nights of fitful sleep, and after hours of restless turning
                  on this particular night, the hum felt like an inescapable
                  roar.
                </p>
                <p>
                  Thurman decided he would rather be sitting sleepless on the
                  bridge than lying sleepless in his cocoon. He quietly emerged
                  and pushed gently toward the open hatch. Normally, he would
                  not have dared to sit in the captain&rsquo;s chair. After all,
                  he was an executive who set protocols. He didn&rsquo;t like
                  to break them. But this morning, with everyone asleep, he
                  decided to afford himself the luxury. Soraya wouldn&rsquo;t
                  mind.
                </p>
              </details>
              <p className="rift-listen-credit">
                Excerpt from the audiobook of <em>The Great Rift</em> by Brian
                D. McLaren, narrated by David Brooks.
              </p>
            </div>
          </div>
        </section>

        <section
          className="section library-featured"
          aria-labelledby="rift-covers-heading"
        >
          <div className="section-inner">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">The books</p>
                <h2 id="rift-covers-heading">
                  The Last Voyage trilogy, book two
                </h2>
              </div>
              <p>
                A story about what we carry, and what we leave&nbsp;behind.
              </p>
            </div>
            <div className="library-feature-grid">
              <a
                className="library-feature-card"
                href={GREAT_RIFT_PREORDER_URL}
                target="_blank"
                rel="noreferrer"
              >
                <div className="library-feature-cover">
                  <Image
                    src="/the-great-rift.jpg"
                    alt="Cover of The Great Rift"
                    width={600}
                    height={900}
                    sizes="(max-width: 760px) 72vw, 24vw"
                    priority
                  />
                </div>
                <div className="book-meta">
                  <span>
                    Fiction · <Launch before="Forthcoming" after="New" />
                  </span>
                  <span>2026</span>
                </div>
                <h3>The Great Rift</h3>
                <p>
                  <Launch
                    before="Pre-order now, out November 3rd."
                    after="Out now."
                  />
                </p>
                <span className="publisher-link">
                  <Launch before="Pre-order" after="Order" /> on Amazon ↗
                </span>
              </a>

              <a
                className="library-feature-card"
                href={LAST_VOYAGE_URL}
                target="_blank"
                rel="noreferrer"
              >
                <div className="library-feature-cover">
                  <Image
                    src="/the-last-voyage.jpg"
                    alt="Cover of The Last Voyage"
                    width={600}
                    height={900}
                    sizes="(max-width: 760px) 72vw, 24vw"
                  />
                </div>
                <div className="book-meta">
                  <span>Fiction</span>
                  <span>2025</span>
                </div>
                <h3>The Last Voyage</h3>
                <p>Catch up on book one.</p>
                <span className="publisher-link">Get The Last Voyage ↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
