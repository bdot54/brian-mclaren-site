import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SouthernLightsSignupForm } from "./signup-form";

const SOUTHERN_LIGHTS_URL = "https://southernlightsconference.com/";

export const metadata: Metadata = {
  title: "A great way to start 2027: Southern Lights",
  description:
    "Join EDGEWISE, Brian D. McLaren's as-needed newsletter, and get a 15% discount code for the Southern Lights conference, January 22-24, 2027, on the Georgia coast.",
  alternates: { canonical: "/southern-lights" },
  robots: { index: false, follow: true },
};

export default function SouthernLightsPage() {
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
            <Link href="/#ideas">Blog</Link>
            <Link href="/events">Events</Link>
            <Link className="nav-cta" href="#code">
              Get the discount code
            </Link>
          </nav>

          <Link className="menu-button books-home-link" href="/">
            Home
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="library-hero no-stats" id="code">
          <div className="library-hero-grid rift-hero-grid">
            <div>
              <p className="eyebrow">
                Southern Lights · January 22–24, 2027 · St. Simons Island,
                Georgia
              </p>
              <h1>A great way to start 2027</h1>
              <p className="hero-dek">
                Join EDGEWISE, my as-needed newsletter, and you&rsquo;ll receive a
                15% discount code for the Southern Lights conference on the
                Georgia coast. Register by November 13 to use it.
              </p>
            </div>
            <div className="library-hero-copy">
              <SouthernLightsSignupForm />
            </div>
          </div>
        </section>

        <section
          className="section library-featured"
          aria-labelledby="sl-about-heading"
        >
          <div className="section-inner">
            <Image
              src="/southern-lights-2027.jpg"
              alt="Southern Lights Conference, January 22-24, 2027, St. Simons Island, Georgia"
              width={1276}
              height={616}
              sizes="(max-width: 760px) 100vw, 1100px"
              style={{ width: "100%", height: "auto", marginBottom: "2rem" }}
              priority
            />
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">The conference</p>
                <h2 id="sl-about-heading">One of my favorite gatherings</h2>
              </div>
              <p>
                Diana Butler Bass and I co-host and speak, and this year we
                welcome NYT bestselling historian Kristin Kobes Du Mez, author
                of <em>Jesus and John Wayne</em> and{" "}
                <em>
                  Live Laugh Love: The Secret History of White Christian Women
                  and the World They Made
                </em>
                . Ken Medema, the brilliant improvisational musician, will
                offer his musical magic before and after each talk. Mark
                Miller and Carlos Rodriguez will teach and lead, and
                you&rsquo;ll enjoy a first-ever Southern Lights labyrinth
                experience and an optional yoga session each morning.
              </p>
            </div>
            <p>
              <a
                className="button button-primary"
                href={SOUTHERN_LIGHTS_URL}
                target="_blank"
                rel="noreferrer"
              >
                Learn more and register ↗
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
