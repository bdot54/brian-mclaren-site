"use client";

import { FormEvent, useState } from "react";

const bookLinks = {
  "Faith After Doubt":
    "https://us.macmillan.com/books/9781250828378/faithafterdoubt/",
  "Do I Stay Christian?":
    "https://us.macmillan.com/books/9781250262790/doistaychristian/",
  "A Generous Orthodoxy":
    "https://www.zondervan.com/9780310258032/a-generous-orthodoxy/",
  "Life After Doom":
    "https://us.macmillan.com/books/9781250893277/lifeafterdoom/",
  "Everything Must Change":
    "https://faithgateway.com/products/everything-must-change-when-the-worlds-biggest-problems-and-jesus-good-news-collide-1",
  "The Galápagos Islands":
    "https://www.broadleafbooks.com/store/product/9781506448251/The-Galapagos-Islands",
  "The Last Voyage":
    "https://www.hachette.com.au/brian-d-mclaren/the-last-voyage",
  "The Great Rift":
    "https://www.hachette.co.uk/titles/brian-d-mclaren/the-great-rift/9781399838788/",
  "The Seventh Story": "https://www.theseventhstory.com/paperback",
  "Naked Spirituality":
    "https://brianmclaren.net/naked-spirituality-a-life-with-god-in-12-simple-words-2/",
  "We Make the Road by Walking":
    "https://www.hachettebookgroup.com/titles/brian-d-mclaren/we-make-the-road-by-walking/9781455514014/",
  "A New Kind of Christianity":
    "https://www.hachette.co.uk/titles/brian-d-mclaren/a-new-kind-of-christianity/9780340995495/",
} as const;

type RecommendedBook = keyof typeof bookLinks;

const pathways = [
  {
    id: "renew",
    label: "My faith is changing",
    title: "A wiser faith can make room for honest doubt.",
    body: "Begin with Brian’s work on spiritual growth, religious identity, and the possibility of a faith that becomes more generous as it matures.",
    books: [
      "Faith After Doubt",
      "Do I Stay Christian?",
      "A Generous Orthodoxy",
    ] satisfies RecommendedBook[],
  },
  {
    id: "world",
    label: "The world feels fragile",
    title: "Face reality fully—without surrendering courage.",
    body: "Explore writing about ecological overshoot, social fracture, grief, resilience, and the communities we need for a turbulent future.",
    books: [
      "Life After Doom",
      "Everything Must Change",
      "The Galápagos Islands",
    ] satisfies RecommendedBook[],
  },
  {
    id: "future",
    label: "I want a story",
    title: "Sometimes fiction helps us see the present more clearly.",
    body: "Travel beyond Earth with speculative stories about technology, power, belonging, and the human values worth carrying into any future.",
    books: [
      "The Last Voyage",
      "The Great Rift",
      "The Seventh Story",
    ] satisfies RecommendedBook[],
  },
  {
    id: "unsure",
    label: "I’m not sure what I believe",
    title: "You don’t need certainty to begin exploring.",
    body: "Start with honest, welcoming work about God, doubt, meaning, and spiritual curiosity—without pressure to arrive at a quick answer.",
    books: [
      "Naked Spirituality",
      "Faith After Doubt",
      "A New Kind of Christianity",
    ] satisfies RecommendedBook[],
  },
  {
    id: "spiritual",
    label: "I want to grow spiritually",
    title: "A deeper spiritual life can begin with simple practices.",
    body: "Explore accessible ways to pray, pay attention, seek God, and grow in compassion through everyday life.",
    books: [
      "Naked Spirituality",
      "We Make the Road by Walking",
      "The Galápagos Islands",
    ] satisfies RecommendedBook[],
  },
];

const books = [
  {
    title: "The Last Voyage",
    year: "2025",
    theme: "Future & fiction",
    image: "/the-last-voyage.jpg",
    alt: "Cover of The Last Voyage",
    copy: "A science-fiction journey asking what humanity should carry forward—and what we must leave behind.",
    href: bookLinks["The Last Voyage"],
  },
  {
    title: "Life After Doom",
    year: "2024",
    theme: "Ecology & courage",
    image: "/life-after-doom.jpg",
    alt: "Cover of Life After Doom",
    copy: "Wisdom, grief, and resilient hope for a world confronting overlapping crises.",
    href: bookLinks["Life After Doom"],
  },
  {
    title: "Do I Stay Christian?",
    year: "2022",
    theme: "Identity & belonging",
    image: "/do-i-stay-christian.jpg",
    alt: "Cover of Do I Stay Christian?",
    copy: "A candid guide for doubters, the disappointed, and the disillusioned.",
    href: bookLinks["Do I Stay Christian?"],
  },
  {
    title: "Faith After Doubt",
    year: "2021",
    theme: "Faith & growth",
    image: "/faith-after-doubt.jpg",
    alt: "Cover of Faith After Doubt",
    copy: "Why old beliefs stop working—and how doubt can lead toward a deeper faith.",
    href: bookLinks["Faith After Doubt"],
  },
];

const topics = [
  {
    title: "Faith after certainty",
    body: "An honest, hopeful conversation for people whose inherited beliefs no longer fit—exploring how doubt can become a doorway to a more mature, generous faith.",
  },
  {
    title: "Courage in a world falling apart",
    body: "How do we face ecological, social, and personal upheaval without denial or despair? Brian offers practices for grief, resilience, and courageous action.",
  },
  {
    title: "Spirituality and social transformation",
    body: "A practical exploration of how contemplation, compassion, and inner transformation can become fuel for justice, repair, and the common good.",
  },
  {
    title: "A just and generous Christianity",
    body: "A vision of Christianity centered on the way of Jesus: expansive love, humility, inclusion, and solidarity across differences.",
  },
  {
    title: "Story, belonging, and the human future",
    body: "An imaginative look at the stories shaping our identities and our future—and how better stories can help us build belonging and choose what humanity carries forward.",
  },
];

const recentWriting = [
  {
    date: "May 2026",
    title: "Friends in SW Florida — May 15 at FGCU",
    href: "https://brianmclaren.net/friends-in-sw-florida-may-15-at-fgcu/",
  },
  {
    date: "Jan. 2026",
    title: "A new book by a good friend: Birthing the Symbiotic Age",
    href: "https://brianmclaren.net/a-new-book-by-a-good-friend-birthing-the-symbiotic-age/",
  },
  {
    date: "Jan. 2026",
    title: "Important 2026 update",
    href: "https://brianmclaren.net/important-2026-update/",
  },
];

export function BrianSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(pathways[0]);
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [inquiryStatus, setInquiryStatus] = useState("");

  async function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newsletterForm = event.currentTarget;
    setNewsletterStatus("Joining…");
    const form = new FormData(newsletterForm);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Please try again.");
      newsletterForm.reset();
      setNewsletterStatus("You’re on the list. Welcome.");
    } catch (error) {
      setNewsletterStatus(
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inquiryForm = event.currentTarget;
    setInquiryStatus("Sending your inquiry…");
    const form = new FormData(inquiryForm);

    try {
      const response = await fetch("/api/speaking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Please try again.");
      inquiryForm.reset();
      setInquiryStatus("Thank you. Your inquiry has been emailed to Brian’s team.");
    } catch (error) {
      setInquiryStatus(
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="announcement">
        <span>Speaking update</span>
        <a href="#speaking">2027 calendar opens September 2026 →</a>
      </div>

      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#top" aria-label="Brian D. McLaren home">
            <span className="brand-mark" aria-hidden="true">
              BM
            </span>
            <span className="brand-name">Brian D. McLaren</span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="/books">Books</a>
            <a href="#speaking">Speaking</a>
            <a href="#ideas">Writing</a>
            <a href="#events">Events</a>
            <a className="nav-cta" href="#newsletter">
              Join the letter
            </a>
          </nav>

          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <nav
          className={`mobile-nav ${menuOpen ? "open" : ""}`}
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="/books" onClick={closeMenu}>
            Books
          </a>
          <a href="#speaking" onClick={closeMenu}>
            Speaking
          </a>
          <a href="#ideas" onClick={closeMenu}>
            Writing
          </a>
          <a href="#events" onClick={closeMenu}>
            Events
          </a>
          <a href="#newsletter" onClick={closeMenu}>
            Join the letter
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">Author · Speaker · Public theologian</p>
              <h1>
                Exploring faith, courage, and what it means to be{" "}
                <em>human.</em>
              </h1>
              <p className="hero-dek">
                Brian D. McLaren’s books and talks invite honest questions,
                deeper belonging, and wise action in a changing world.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#books">
                  Explore the work <span className="button-arrow">↓</span>
                </a>
                <a className="button button-secondary" href="#speaking">
                  Invite Brian <span className="button-arrow">↗</span>
                </a>
              </div>
              <p className="hero-footnote">
                <i aria-hidden="true" />
                Writing at the meeting place of spirit, story, and public life
              </p>
            </div>

            <figure className="portrait-wrap">
              <div className="portrait-red" aria-hidden="true" />
              <div className="portrait-frame">
                <img
                  src="/brian-portrait.jpg"
                  alt="Brian D. McLaren outdoors"
                />
              </div>
              <figcaption className="portrait-caption">
                <strong>Brian D. McLaren</strong>
                <span>Writer · teacher · public theologian</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <div className="signal-bar" aria-label="At a glance">
          <div className="signal-grid">
            <div className="signal">
              <strong>20+ books</strong>
              <span>Fiction, theology, ecology, public life</span>
            </div>
            <div className="signal">
              <strong>20+ years</strong>
              <span>Speaking with communities around the world</span>
            </div>
            <div className="signal">
              <strong>One living question</strong>
              <span>How shall we live?</span>
            </div>
          </div>
        </div>

        <section className="section start-section" aria-labelledby="start-heading">
          <div className="section-inner pathway-layout">
            <div className="pathway-intro">
              <p className="eyebrow">New here?</p>
              <h2 id="start-heading">Start where you are.</h2>
              <p>
                Brian’s work spans decades and genres. Choose the doorway that
                sounds most like you today.
              </p>
              <div className="pathway-buttons">
                {pathways.map((pathway, index) => (
                  <button
                    className={`pathway-button ${
                      selectedPath.id === pathway.id ? "active" : ""
                    }`}
                    type="button"
                    key={pathway.id}
                    onClick={() => setSelectedPath(pathway)}
                    aria-pressed={selectedPath.id === pathway.id}
                  >
                    <span>{pathway.label}</span>
                    <i aria-hidden="true">{index + 1}</i>
                  </button>
                ))}
              </div>
            </div>

            <div className="pathway-panel" aria-live="polite">
              <span className="pathway-number">
                0{pathways.findIndex((item) => item.id === selectedPath.id) + 1}
              </span>
              <h3>{selectedPath.title}</h3>
              <p>{selectedPath.body}</p>
              <div className="pathway-books" aria-label="Suggested books">
                {selectedPath.books.map((book) => (
                  <a
                    href={bookLinks[book]}
                    target="_blank"
                    rel="noreferrer"
                    key={book}
                  >
                    {book}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section current-work" aria-labelledby="now-heading">
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Current work</p>
                <h2 id="now-heading">Brian’s Latest &amp; Upcoming Works</h2>
              </div>
              <p>
                New fiction imagines humanity’s next chapter. New nonfiction
                keeps asking how meaning, courage, and community can meet the
                moment we’re living through.
              </p>
            </div>

            <div className="current-grid">
              <article className="feature-book">
                <div className="feature-cover-wrap">
                  <img src="/the-last-voyage.jpg" alt="" />
                </div>
                <div className="feature-copy">
                  <span className="kicker">Latest novel · Nautilus silver</span>
                  <h3>The Last Voyage</h3>
                  <p>
                    In 2056, a troubled, brilliant crew leaves a collapsing
                    Earth for Mars—and must decide which human values deserve a
                    future.
                  </p>
                  <a
                    href="https://www.hachette.com.au/brian-d-mclaren/the-last-voyage"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Discover the book <span>↗</span>
                  </a>
                </div>
              </article>

              <div className="next-work">
                <article className="next-card">
                  <img src="/the-great-rift.jpg" alt="" />
                  <div className="next-card-copy">
                    <span className="kicker">Coming November 2026</span>
                    <h3>The Great Rift</h3>
                    <p>The second novel in the Mars trilogy.</p>
                  </div>
                </article>
                <article className="next-card next-card-typographic">
                  <div className="next-card-copy">
                    <span className="kicker">Nonfiction · 2027</span>
                    <h3>The Beautiful Logic of a Meaningful Life</h3>
                    <p>
                      A new inquiry into the patterns that help a human life
                      become meaningful.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section books-section"
          id="books"
          aria-labelledby="books-heading"
        >
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Selected books</p>
                <h2 id="books-heading">Ideas for the road ahead</h2>
              </div>
              <a
                className="text-link"
                href="/books"
              >
                View the complete library →
              </a>
            </div>

            <div className="book-grid">
              {books.map((book) => (
                <a
                  className="book-card"
                  href={book.href}
                  target="_blank"
                  rel="noreferrer"
                  key={book.title}
                >
                  <div className="book-cover">
                    <img src={book.image} alt={book.alt} />
                  </div>
                  <div className="book-meta">
                    <span>{book.theme}</span>
                    <span>{book.year}</span>
                  </div>
                  <h3>{book.title}</h3>
                  <p>{book.copy}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section about-section"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="section-inner about-grid">
            <div className="quote-block">
              <blockquote>
                “Anything written by Brian McLaren is always filled with
                insight, courage, and creative theology.”
              </blockquote>
              <cite>— Fr. Richard Rohr</cite>
            </div>

            <div className="about-copy">
              <p className="eyebrow">About Brian</p>
              <h2 id="about-heading">A generous voice for a changing world</h2>
              <p>
                Brian D. McLaren is an author, speaker, activist, and public
                theologian. A former college English teacher and pastor, he has
                spent decades helping people think honestly about faith,
                culture, ecology, and the common good.
              </p>
              <p>
                His work speaks especially to people whose questions have
                outgrown inherited answers—and to communities seeking a more
                just, generous, and compassionate way forward.
              </p>
              <div className="about-points">
                <a className="about-point about-point-link" href="/books">
                  <strong>Author</strong>
                  <span>More than twenty books across nonfiction and fiction.</span>
                </a>
                <div className="about-point">
                  <strong>Speaker</strong>
                  <span>Keynotes, conversations, retreats, and virtual gatherings.</span>
                </div>
                <div className="about-point">
                  <strong>Teacher</strong>
                  <span>
                    Faculty member with the{" "}
                    <a
                      href="https://cac.org/about/cac-faculty/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Center for Action and Contemplation
                    </a>
                    .
                  </span>
                </div>
                <div className="about-point">
                  <strong>Podcaster</strong>
                  <span>
                    Co-host of the CAC podcast{" "}
                    <a
                      href="https://cac.org/podcast/learning-how-to-see/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learning How to See
                    </a>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section speaking-section"
          id="speaking"
          aria-labelledby="speaking-heading"
        >
          <div className="section-inner speaking-grid">
            <div className="speaking-copy">
              <p className="eyebrow">Invite Brian</p>
              <h2 id="speaking-heading">A conversation that stays with people</h2>
              <p>
                Brian brings intellectual honesty, warmth, and practical hope
                to conferences, clergy gatherings, campuses, multi-faith
                events, podcasts, and community conversations.
              </p>
              <div className="availability-card">
                <strong>Scheduling note</strong>
                <p>
                  Brian is taking most of 2026 away from public speaking. His
                  2027 calendar is planned to open in September 2026, with
                  virtual appearances encouraged and travel considered
                  selectively.
                </p>
              </div>
              <div className="topic-list" aria-label="Possible speaking themes">
                {topics.map((topic, index) => (
                  <details className="topic-item" key={topic.title}>
                    <summary>
                      <span>0{index + 1}</span>
                      <span className="topic-title">{topic.title}</span>
                      <i aria-hidden="true">+</i>
                    </summary>
                    <p className="topic-description">{topic.body}</p>
                  </details>
                ))}
              </div>
            </div>

            <form className="inquiry-card" onSubmit={submitInquiry}>
              <h3>Begin a speaking inquiry</h3>
              <p>
                Tell us what you’re imagining. The more context you share, the
                easier it is to discern whether the event is a good fit.
              </p>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="inquiry-name">Your name</label>
                  <input id="inquiry-name" name="name" required />
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-email">Email</label>
                  <input
                    id="inquiry-email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-organization">Organization</label>
                  <input
                    id="inquiry-organization"
                    name="organization"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-date">Proposed date(s)</label>
                  <input
                    id="inquiry-date"
                    name="proposedDates"
                    placeholder="Month / year is fine"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-audience">Audience</label>
                  <input
                    id="inquiry-audience"
                    name="audience"
                    placeholder="Who will be in the room?"
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-format">Format</label>
                  <select id="inquiry-format" name="format" required>
                    <option value="">Choose one</option>
                    <option>Virtual conversation</option>
                    <option>Virtual lecture + Q&amp;A</option>
                    <option>In-person keynote</option>
                    <option>Retreat or workshop</option>
                    <option>Podcast or media interview</option>
                  </select>
                </div>
                <div className="form-field form-field-full">
                  <label htmlFor="inquiry-topics">Topic or theme</label>
                  <input
                    id="inquiry-topics"
                    name="topics"
                    placeholder="What would you like Brian to explore?"
                  />
                </div>
                <div className="form-field form-field-full">
                  <label htmlFor="inquiry-message">Anything else?</label>
                  <textarea id="inquiry-message" name="message" />
                </div>
                <div className="form-honeypot" aria-hidden="true">
                  <label htmlFor="inquiry-website">Website</label>
                  <input
                    id="inquiry-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
              </div>
              <label className="form-consent">
                <input name="consent" type="checkbox" value="yes" required />
                <span>
                  I agree that this information may be stored and used to
                  respond to this inquiry.
                </span>
              </label>
              <button className="button button-primary" type="submit">
                Send inquiry <span className="button-arrow">→</span>
              </button>
              {inquiryStatus && (
                <p className="form-status" role="status">
                  {inquiryStatus}
                </p>
              )}
            </form>
          </div>
        </section>

        <section
          className="section events-section"
          id="events"
          aria-labelledby="events-heading"
        >
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Events & media</p>
                <h2 id="events-heading">Meet, listen, share</h2>
              </div>
              <p>
                Find current scheduling information, sample conversations, and
                everything an event or media team needs.
              </p>
            </div>

            <div className="event-grid">
              <article className="event-card event-card-featured">
                <span className="kicker">2026 update</span>
                <h3>A quieter speaking year</h3>
                <p>
                  Brian is stepping back from most public events in 2026.
                  Follow updates here and join the letter for 2027 news.
                </p>
                <a
                  className="text-link"
                  href="https://brianmclaren.net/important-2026-update/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the update ↗
                </a>
              </article>
              <article className="event-card">
                <span className="kicker">Watch</span>
                <h3>Creating a Church for the Future</h3>
                <p>A 90-minute presentation and audience conversation.</p>
                <a
                  className="text-link"
                  href="https://pcusa.org/news-storytelling/news/2024/6/26/author-and-speaker-brian-mclaren-makes-second-appearance-new-york-avenue-church"
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch the talk ↗
                </a>
              </article>
              <article className="event-card">
                <span className="kicker">For organizers</span>
                <h3>Press & event kit</h3>
                <p>Approved photos and downloadable promotional materials.</p>
                <a
                  className="text-link"
                  href="https://drive.google.com/drive/folders/19OqldLnPUral_BSoofdeH8LKHiDdhwbE?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open the kit ↗
                </a>
              </article>
            </div>
          </div>
        </section>

        <section
          className="section ideas-section"
          id="ideas"
          aria-labelledby="ideas-heading"
        >
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Writing & ideas</p>
                <h2 id="ideas-heading">Notes from the journey</h2>
              </div>
              <a
                className="text-link"
                href="https://cac.org/podcast/learning-how-to-see/"
                target="_blank"
                rel="noreferrer"
              >
                Listen to the podcast ↗
              </a>
            </div>

            <div className="ideas-grid">
              <div className="post-list">
                {recentWriting.map((post) => (
                  <a
                    className="post-row"
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    key={post.title}
                  >
                    <time>{post.date}</time>
                    <h3>{post.title}</h3>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>

              <div className="archive-box">
                <h3>Two decades of questions, ideas, and conversation</h3>
                <p>
                  Search an archive of Brian’s writings, speaking engagements,
                  podcasts, and more.
                </p>
                <form
                  className="archive-search"
                  action="https://brianmclaren.net/"
                  method="get"
                  target="_blank"
                >
                  <label className="form-field" htmlFor="archive-query">
                    <span className="kicker">Search the archive</span>
                    <input
                      id="archive-query"
                      name="s"
                      type="search"
                      placeholder="Faith, doubt, ecology…"
                    />
                  </label>
                  <button type="submit" aria-label="Search archive">
                    →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section newsletter-section"
          id="newsletter"
          aria-labelledby="newsletter-heading"
        >
          <div className="section-inner newsletter-grid">
            <div className="newsletter-copy">
              <p className="eyebrow">Stay in the conversation</p>
              <h2 id="newsletter-heading">
                A thoughtful outreach, only when there’s something to say
              </h2>
              <p>
                Join the letter for updates on new writing, book news, events,
                and a few useful things worth sharing—sent with care, never
                clutter.
              </p>
            </div>

            <form className="newsletter-wrap" onSubmit={submitNewsletter}>
              <div className="newsletter-form">
                <label className="form-field" htmlFor="newsletter-name">
                  <span>First name</span>
                  <input id="newsletter-name" name="firstName" required />
                </label>
                <label className="form-field" htmlFor="newsletter-email">
                  <span>Email address</span>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                  />
                </label>
                <button className="button button-primary" type="submit">
                  Join the letter
                </button>
              </div>
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="newsletter-website">Website</label>
                <input
                  id="newsletter-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <input name="consent" type="hidden" value="yes" />
              <p className="newsletter-note">
                By joining, you agree to receive occasional email from Brian’s
                team. Unsubscribe anytime. We do not sell your information.
              </p>
              {newsletterStatus && (
                <p className="form-status" role="status">
                  {newsletterStatus}
                </p>
              )}
            </form>
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
            <a href="#about">About</a>
            <a href="/books">Books</a>
            <a href="#speaking">Speaking</a>
            <a href="#ideas">Writing</a>
          </div>
          <div className="footer-column">
            <strong>Connect</strong>
            <a
              href="https://brianmclaren.net/contact/"
              target="_blank"
              rel="noreferrer"
            >
              General contact
            </a>
            <a
              href="https://cac.org/podcast/learning-how-to-see/"
              target="_blank"
              rel="noreferrer"
            >
              Podcast
            </a>
            <a
              href="https://www.instagram.com/brian_mclaren/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Brian D. McLaren. All rights reserved.</span>
          <details className="privacy-details" id="privacy">
            <summary>Privacy</summary>
            <p>
              Newsletter signups and speaking inquiries are stored securely and
              used only for the purpose described when you submit them. They
              are not sold.
            </p>
          </details>
        </div>
      </footer>
    </div>
  );
}
