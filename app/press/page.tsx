import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press and media kit: The Great Rift",
  description:
    "Book details, bio, suggested interview questions, images and links for podcast hosts and media covering The Great Rift by Brian D. McLaren.",
  robots: { index: false, follow: false },
};

const BUY_LINKS = [
  {
    label: "Bookshop",
    href: "https://bookshop.org/p/books/the-great-rift-brian-d-mclaren/21462f123b507d46",
  },
  {
    label: "Barnes & Noble",
    href: "https://www.barnesandnoble.com/w/the-great-rift-brian-d-mclaren/1149634824",
  },
  { label: "Amazon", href: "https://www.amazon.com/dp/1399838784" },
  {
    label: "Audiobook on Audible",
    href: "https://www.audible.com/pd/The-Great-Rift-Audiobook/B0H75DZHMF",
  },
];

const QUESTIONS = [
  "You've been known mostly for nonfiction in theology, spirituality, and global crises. Why did you decide to write science fiction?",
  "Is there a story behind how this story developed?",
  "The book is a trilogy. Can you tell us the setting for the three books?",
  "Tell us about some of the main characters in The Great Rift.",
  "Can you give us a preview of what the third book in the trilogy will be about?",
  "Mars has fascinated human beings for a long time. Why do you think that is, and what significance does Mars seem to play in contemporary science fiction?",
];

const IMAGES = [
  {
    src: "/press/the-great-rift-cover.jpg",
    alt: "Cover of The Great Rift",
    label: "The Great Rift cover",
    width: 1320,
    height: 2115,
  },
  {
    src: "/press/brian-mclaren-with-the-great-rift.jpg",
    alt: "Brian D. McLaren holding a copy of The Great Rift",
    label: "Brian with The Great Rift",
    width: 1600,
    height: 2133,
  },
  {
    src: "/press/brian-mclaren-portrait.jpg",
    alt: "Portrait of Brian D. McLaren",
    label: "Brian D. McLaren portrait",
    width: 1122,
    height: 1402,
  },
  {
    src: "/press/brian-mclaren-portrait-outdoors.jpg",
    alt: "Brian D. McLaren outdoors in the mountains",
    label: "Brian outdoors",
    width: 1200,
    height: 1198,
  },
];

export default function PressPage() {
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
          <div className="section-inner rift-listen-grid">
            <Image
              src="/the-great-rift.jpg"
              alt="Cover of The Great Rift"
              width={600}
              height={900}
              sizes="(max-width: 800px) 60vw, 340px"
              priority
              style={{ width: "100%", maxWidth: "340px", height: "auto" }}
            />
            <div className="rift-listen-copy">
              <p className="eyebrow">Press and media kit</p>
              <h1
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                The Great Rift
              </h1>
              <p>
                A novel by Brian D. McLaren. Book two of The Last Voyage trilogy.
                Out November 3, 2026, in print and audio. The audiobook is
                narrated by David Brooks.
              </p>
              <div className="rift-book-buttons">
                {BUY_LINKS.map((link, index) => (
                  <a
                    key={link.href}
                    className={
                      index === 0
                        ? "button button-primary"
                        : "button button-secondary"
                    }
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label} <span className="button-arrow">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section library-featured" aria-labelledby="press-book-heading">
          <div className="section-inner press-columns">
            <div>
              <p className="eyebrow">About the book</p>
              <h2 id="press-book-heading" className="press-h2">
                The Great Rift
              </h2>
              <p>
                The story opens aboard the Ark, en route to Mars, where word
                reaches the crew about a new outbreak of chaos at the Mars
                colony. As Eve Innis and her small team sift through some
                disturbing messages from the Mars Base archives, they uncover
                a pattern that reaches back to Earth.
              </p>
              <p>
                It continues the story begun in <em>The Last Voyage</em>, the
                first book in the trilogy, which was a Nautilus silver winner.
                Readers don&rsquo;t need to be sci-fi fans to enjoy it.
              </p>
              <p>
                <a
                  className="publisher-link"
                  href="/rift/listen"
                  target="_blank"
                  rel="noreferrer"
                >
                  Hear the first five minutes of the audiobook ↗
                </a>
              </p>
            </div>
            <div>
              <p className="eyebrow">About Brian</p>
              <h2 className="press-h2">Brian D. McLaren</h2>
              <p>
                Brian D. McLaren is an author, speaker, activist, and public
                theologian. A former college English teacher and pastor, he has
                spent decades helping people think honestly about faith,
                culture, ecology, and the common good.
              </p>
              <p>
                His work speaks especially to people whose questions have
                outgrown inherited answers, and to communities seeking a more
                just, generous, and compassionate way forward. He is the author
                of more than twenty books across nonfiction and fiction.
              </p>
              <p>
                <a className="publisher-link" href="/" target="_blank" rel="noreferrer">
                  brianmclaren.net ↗
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="press-questions-heading">
          <div className="section-inner">
            <p className="eyebrow">For hosts</p>
            <h2 id="press-questions-heading" className="press-h2">
              Suggested interview questions
            </h2>
            <ol className="press-questions">
              {QUESTIONS.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section library-featured" aria-labelledby="press-images-heading">
          <div className="section-inner">
            <p className="eyebrow">Images</p>
            <h2 id="press-images-heading" className="press-h2">
              Download images
            </h2>
            <div className="press-grid">
              {IMAGES.map((image) => (
                <figure key={image.src} className="press-figure">
                  <Image
                    src={image.src}
                    alt={image.alt}
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

        <section className="section" aria-labelledby="press-contact-heading">
          <div className="section-inner press-columns">
            <div>
              <p className="eyebrow">Book an interview</p>
              <h2 id="press-contact-heading" className="press-h2">
                Schedule with Brian
              </h2>
              <p>
                Choose a time that works for you. Once you&rsquo;ve booked,
                please email your video call link to Jodi so it goes on
                Brian&rsquo;s calendar.
              </p>
              <p>
                <a
                  className="button button-primary"
                  href="https://calendly.com/mclaren-brian/podcast-interview-the-great-rift"
                  target="_blank"
                  rel="noreferrer"
                >
                  Book a time <span className="button-arrow">↗</span>
                </a>
              </p>
            </div>
            <div>
              <p className="eyebrow">Contact</p>
              <h2 className="press-h2">Jodi McLaren</h2>
              <p>
                Communications Director
                <br />
                <a href="mailto:jodi@jodimclaren.com">jodi@jodimclaren.com</a>
              </p>
              <p>
                Happy to send a digital copy, an audio sample, or anything else
                you need.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
