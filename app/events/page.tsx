import type { Metadata } from "next";

type InPersonEvent = {
  dates: string;
  title: string;
  location: string;
  tentative?: boolean;
  href?: string;
  linkText?: string;
};

type MediaAppearance = {
  kind: string;
  title: string;
  detail: string;
  href: string;
};

const inPersonEvents: InPersonEvent[] = [
  {
    dates: "January 21–24, 2027",
    title: "Southern Lights Conference",
    location: "St. Simons Island, Georgia",
    href: "https://southernlightsconference.com/",
  },
  {
    dates: "March 29–April 2, 2027",
    title: "Discovering Renewal Retreat",
    location: "Montreat, North Carolina",
    href: "https://montreat.org/events",
  },
  {
    dates: "July 18–31, 2027",
    title: "Ring Lake Ranch",
    location: "Dubois, Wyoming",
    href: "https://ringlake.org/",
  },
  {
    dates: "September 2–5, 2027",
    title: "Wild Goose Festival",
    location: "Harmony, North Carolina",
    href: "https://wildgoosefestival.org/",
  },
  {
    dates: "October 13–17, 2027",
    title: "Theology Beer Camp",
    location: "Montreat, North Carolina",
  },
  {
    dates: "October 27–31, 2027",
    title: "Center for Action and Contemplation Event",
    location: "Albuquerque, New Mexico",
  },
  {
    dates: "TBA",
    title: "Additional dates open",
    location:
      "Brian has a few remaining dates open for public appearances, especially for youth and young adult gatherings.",
    href: "/#speaking",
    linkText: "To inquire, click here →",
  },
];

const mediaAppearances: MediaAppearance[] = [
  {
    kind: "Podcast",
    title: "Learning How to See",
    detail: "Co-hosted with the Center for Action and Contemplation.",
    href: "https://cac.org/podcast/learning-how-to-see/",
  },
  {
    kind: "Podcast",
    title: "Faith, Fear, and Facing the Future",
    detail: "A conversation recorded August 2025.",
    href: "https://podcasts.apple.com/us/podcast/39-brian-d-mclaren-faith-fear-and-facing-the-future/id1733794201?i=1000721093891",
  },
  {
    kind: "Video",
    title: "Interview with Brian D. McLaren: The Last Voyage",
    detail: "A conversation about the first novel in the Mars trilogy.",
    href: "https://www.youtube.com/watch?v=hnLNbGbFOLU",
  },
  {
    kind: "Watch",
    title: "Creating a Church for the Future",
    detail: "A 90-minute presentation and audience conversation.",
    href: "https://pcusa.org/news-storytelling/news/2024/6/26/author-and-speaker-brian-mclaren-makes-second-appearance-new-york-avenue-church",
  },
];

export const metadata: Metadata = {
  title: "Events",
  description:
    "In-person appearances and online, media, and podcast appearances for Brian D. McLaren.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <div className="site-shell events-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="/" aria-label="Brian D. McLaren home">
            <span className="brand-mark" aria-hidden="true">
              BM
            </span>
            <span className="brand-name">Brian D. McLaren</span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="/#about">About</a>
            <a href="/books">Books</a>
            <a
              href="https://payhip.com/BrianMcLaren"
              target="_blank"
              rel="noreferrer"
            >
              Store
            </a>
            <a href="/#speaking">Speaking</a>
            <a href="/#ideas">Writing</a>
            <a href="/events" aria-current="page">
              Events
            </a>
            <a className="nav-cta" href="/#newsletter">
              Join EDGEWISE
            </a>
          </nav>

          <a className="menu-button books-home-link" href="/">
            Home
          </a>
        </div>
      </header>

      <main id="main">
        <section className="library-hero">
          <div className="library-hero-grid">
            <div>
              <p className="eyebrow">Events & media</p>
              <h1>
                Meet Brian in person, or wherever <em>you</em> already are.
              </h1>
            </div>
            <div className="library-hero-copy">
              <p>
                Brian is taking most of 2026 away from public speaking. A
                short list of in-person appearances for 2027 is confirmed
                below, alongside recent conversations, podcasts, and talks
                you can watch or listen to right now.
              </p>
              <div className="library-stats" aria-label="Events overview">
                <div>
                  <strong>
                    {inPersonEvents.filter((event) => event.dates !== "TBA").length}
                  </strong>
                  <span>2027 appearances announced</span>
                </div>
                <div>
                  <strong>{mediaAppearances.length}</strong>
                  <span>Recent talks & conversations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section appearances-section"
          id="in-person"
          aria-labelledby="in-person-heading"
        >
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">In person</p>
                <h2 id="in-person-heading">2027 appearances</h2>
              </div>
              <p>
                Brian's public schedule opens back up in 2027. Dates marked
                tentative are still being finalized.
              </p>
            </div>

            <div className="appearances-list">
              {inPersonEvents.map((event) => (
                <div className="appearance-row" key={event.title}>
                  <div className="appearance-dates">{event.dates}</div>
                  <div className="appearance-copy">
                    <h3>
                      {event.title}
                      {event.tentative ? (
                        <span className="appearance-tentative">
                          Tentative
                        </span>
                      ) : null}
                    </h3>
                    <p>{event.location}</p>
                  </div>
                  <div className="appearance-action">
                    {event.href ? (
                      event.href.startsWith("/") ? (
                        <a className="text-link" href={event.href}>
                          {event.linkText ?? "Learn more ↗"}
                        </a>
                      ) : (
                        <a
                          className="text-link"
                          href={event.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {event.linkText ?? "Learn more ↗"}
                        </a>
                      )
                    ) : (
                      <span className="appearance-soon">
                        More information coming soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section media-section"
          id="online"
          aria-labelledby="online-heading"
        >
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Online, media & podcasts</p>
                <h2 id="online-heading">
                  Conversations you can join right now
                </h2>
              </div>
              <p>
                Recent podcast appearances, interviews, and recorded talks—no
                travel required.
              </p>
            </div>

            <div className="media-grid">
              <article className="event-card event-card-wide">
                <span className="kicker">Podcast & press interviews</span>
                <h3>Talk with Brian about his newest book</h3>
                <p>
                  In addition to his own podcast, Learning How to See, Brian
                  enjoys participating in other podcast and press
                  interviews—primarily to talk about his newest book
                  releases.
                </p>
                <ul className="podcast-releases">
                  <li>
                    <strong>The Great Rift</strong>
                    <span>Sci-fi novel · releases November 3, 2026</span>
                  </li>
                  <li>
                    <strong>The Beautiful Logic of a Meaningful Life</strong>
                    <span>May 11, 2027</span>
                  </li>
                  <li>
                    <strong>Ethnogenesis</strong>
                    <span>Summer/fall 2027 · date TBA</span>
                  </li>
                </ul>
                <p>
                  If you'd like to invite Brian to join you for a podcast
                  conversation about <em>The Beautiful Logic of a Meaningful
                  Life</em>, just answer a few questions to get started.
                </p>
                <a className="text-link" href="/#speaking">
                  Begin a speaking inquiry →
                </a>
              </article>
              {mediaAppearances.map((item) => (
                <article className="event-card" key={item.title}>
                  <span className="kicker">{item.kind}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <a
                    className="text-link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch or listen ↗
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="library-horizon" aria-labelledby="press-heading">
          <div className="library-horizon-inner">
            <p className="eyebrow">For organizers</p>
            <h2 id="press-heading">Planning an event with Brian?</h2>
            <div className="horizon-grid">
              <article>
                <span>Speaking inquiries</span>
                <h3>Start a conversation about 2027</h3>
                <p>
                  <a className="text-link" href="/#speaking">
                    Begin a speaking inquiry →
                  </a>
                </p>
              </article>
              <article>
                <span>Press & event kit</span>
                <h3>Approved photos and promotional materials</h3>
                <p>
                  <a
                    className="text-link"
                    href="https://drive.google.com/drive/folders/19OqldLnPUral_BSoofdeH8LKHiDdhwbE?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open the kit ↗
                  </a>
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-name">Brian D. McLaren</p>
            <p className="footer-tagline">
              Author · Speaker · Activist · Public theologian
            </p>
          </div>
          <div className="footer-column">
            <strong>Explore</strong>
            <a href="/">Home</a>
            <a href="/#about">About</a>
            <a href="/books">Books</a>
            <a href="/#ideas">Writing</a>
          </div>
          <div className="footer-column">
            <strong>Events</strong>
            <p className="footer-library-note">
              New dates are added here as they're confirmed.
            </p>
            <a href="#main">Back to the top ↑</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Brian D. McLaren. All rights reserved.</span>
          <span>See you out there.</span>
        </div>
      </footer>
    </div>
  );
}
