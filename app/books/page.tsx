import type { Metadata } from "next";

type CatalogueBook = {
  title: string;
  year: string;
  detail: string;
};

const featuredBooks = [
  {
    title: "The Great Rift",
    year: "2026",
    kind: "Fiction · Forthcoming",
    image: "/the-great-rift.jpg",
    alt: "Cover of The Great Rift",
    copy: "The second novel in the Mars trilogy—a story of survival, belonging, and the difficult work of beginning again.",
    href: "https://www.hachette.co.uk/titles/brian-d-mclaren/the-great-rift/9781399838788/",
  },
  {
    title: "The Last Voyage",
    year: "2025",
    kind: "Fiction",
    image: "/the-last-voyage.jpg",
    alt: "Cover of The Last Voyage",
    copy: "Ten pioneers leave a faltering Earth for Mars, carrying human brilliance, old wounds, and one enormous question.",
    href: "https://www.hachette.com.au/brian-d-mclaren/the-last-voyage",
  },
  {
    title: "Life After Doom",
    year: "2024",
    kind: "Nonfiction",
    image: "/life-after-doom.jpg",
    alt: "Cover of Life After Doom",
    copy: "Wisdom, grief, courage, and resilient hope for an age of ecological and social upheaval.",
    href: "https://us.macmillan.com/books/9781250893277/lifeafterdoom/",
  },
  {
    title: "Cory and the Seventh Story",
    year: "2023",
    kind: "Children’s book",
    image: "/cory-and-the-seventh-story.jpg",
    alt: "Cover of Cory and the Seventh Story",
    copy: "A hopeful illustrated story about peace, belonging, and choosing love when fear takes over the village.",
    href: "https://www.penguinrandomhouse.com/books/717360/cory-and-the-seventh-story-by-brian-d-mclaren-and-gareth-higgins-illustrated-by-anita-schmidt/",
  },
  {
    title: "Do I Stay Christian?",
    year: "2022",
    kind: "Nonfiction",
    image: "/do-i-stay-christian.jpg",
    alt: "Cover of Do I Stay Christian?",
    copy: "An honest companion for people deciding what their religious identity can—and cannot—mean.",
    href: "https://us.macmillan.com/books/9781250262790/doistaychristian/",
  },
  {
    title: "Faith After Doubt",
    year: "2021",
    kind: "Nonfiction",
    image: "/faith-after-doubt.jpg",
    alt: "Cover of Faith After Doubt",
    copy: "A map for moving through certainty and doubt toward a more mature, generous, and fruitful faith.",
    href: "https://us.macmillan.com/books/9781250828378/faithafterdoubt/",
  },
];

const fiction: CatalogueBook[] = [
  {
    title: "The Great Rift",
    year: "2026",
    detail: "The Last Voyage trilogy · Book two · Forthcoming",
  },
  {
    title: "The Last Voyage",
    year: "2025",
    detail: "The Last Voyage trilogy · Book one",
  },
  {
    title: "The Last Word and the Word After That",
    year: "2005",
    detail: "A New Kind of Christian trilogy · Book three",
  },
  {
    title: "The Story We Find Ourselves In",
    year: "2003",
    detail: "A New Kind of Christian trilogy · Book two",
  },
  {
    title: "A New Kind of Christian",
    year: "2001",
    detail: "A New Kind of Christian trilogy · Book one",
  },
];

const storiesForAllAges: CatalogueBook[] = [
  {
    title: "Cory and the Seventh Story",
    year: "2023",
    detail: "With Gareth Higgins · Illustrated by Anita Schmidt · Ages 3–7",
  },
  {
    title: "The Seventh Story: Us, Them, and the End of Violence",
    year: "2019",
    detail: "With Gareth Higgins · An illustrated fable and essays",
  },
];

const nonfiction: CatalogueBook[] = [
  {
    title: "Life After Doom",
    year: "2024",
    detail: "Wisdom and Courage for a World Falling Apart",
  },
  {
    title: "Do I Stay Christian?",
    year: "2022",
    detail: "A Guide for the Doubters, the Disappointed, and the Disillusioned",
  },
  {
    title: "Faith After Doubt",
    year: "2021",
    detail: "Why Your Beliefs Stopped Working and What to Do About It",
  },
  {
    title: "The Galápagos Islands",
    year: "2019",
    detail: "A Spiritual Journey · Published in the UK as God Unbound",
  },
  {
    title: "Seeking Aliveness",
    year: "2017",
    detail: "Daily Reflections on a New Way to Experience and Practice Faith",
  },
  {
    title: "The Great Spiritual Migration",
    year: "2016",
    detail: "How the World’s Largest Religion Is Seeking a Better Way to Be Christian",
  },
  {
    title: "We Make the Road by Walking",
    year: "2014",
    detail: "A Year-Long Quest for Spiritual Formation, Reorientation, and Activation",
  },
  {
    title: "Why Did Jesus, Moses, the Buddha, and Mohammed Cross the Road?",
    year: "2012",
    detail: "Christian Identity in a Multi-Faith World",
  },
  {
    title: "Naked Spirituality",
    year: "2011",
    detail: "A Life with God in 12 Simple Words",
  },
  {
    title: "A New Kind of Christianity",
    year: "2010",
    detail: "Ten Questions That Are Transforming the Faith",
  },
  {
    title: "Finding Our Way Again",
    year: "2008",
    detail: "The Return of the Ancient Practices · Foreword by Phyllis Tickle",
  },
  {
    title: "Everything Must Change",
    year: "2007",
    detail: "Jesus, Global Crises, and a Revolution of Hope",
  },
  {
    title: "The Secret Message of Jesus",
    year: "2006",
    detail: "Uncovering the Truth That Could Change Everything",
  },
  {
    title: "A Generous Orthodoxy",
    year: "2004",
    detail: "A personal confession and emerging-church landmark",
  },
  {
    title: "More Ready Than You Realize",
    year: "2002",
    detail: "The Power of Everyday Conversations",
  },
  {
    title: "The Church on the Other Side",
    year: "2000",
    detail: "Doing Ministry in the Postmodern Matrix · Revised from Reinventing Your Church",
  },
  {
    title: "Finding Faith",
    year: "1999",
    detail: "A Self-Discovery Guide for Your Spiritual Quest · Later issued in two volumes",
  },
];

const collaborations: CatalogueBook[] = [
  {
    title: "The Justice Project",
    year: "2009",
    detail: "Co-edited with Elisa Padilla and Ashley Bunting Seeber",
  },
  {
    title: "The Voice of Luke: Not Even Sandals",
    year: "2007",
    detail: "With Chris Seay",
  },
  {
    title: "The Dust Off Their Feet",
    year: "2006",
    detail: "With Chris Seay · Lessons from the First Church",
  },
  {
    title: "Adventures in Missing the Point",
    year: "2003",
    detail: "With Tony Campolo",
  },
  {
    title: "The Church in Emerging Culture: Five Perspectives",
    year: "2003",
    detail: "Contributor · Edited by Leonard Sweet",
  },
  {
    title: "A Is for Abductive",
    year: "2003",
    detail: "With Leonard Sweet and Jerry Haselmayer",
  },
];

export const metadata: Metadata = {
  title: "Books",
  description:
    "The complete library of books authored, coauthored, and edited by Brian D. McLaren, including fiction, nonfiction, and children’s work.",
  alternates: { canonical: "/books" },
};

function CatalogueSection({
  eyebrow,
  title,
  intro,
  books,
  id,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  books: CatalogueBook[];
  id: string;
}) {
  return (
    <section className="library-section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="library-section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-heading`}>{title}</h2>
        </div>
        <p>{intro}</p>
      </div>
      <div className="catalogue-grid">
        {books.map((book, index) => (
          <article className="catalogue-card" key={book.title}>
            <span className="catalogue-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="catalogue-meta">
                <span>{book.year}</span>
                <span>{eyebrow}</span>
              </div>
              <h3>{book.title}</h3>
              <p>{book.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function BooksPage() {
  return (
    <div className="site-shell books-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="announcement library-announcement">
        <span>The complete library</span>
        <a href="#catalogue">Thirty books and collaborations →</a>
      </div>

      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="/" aria-label="Brian D. McLaren home">
            <span className="brand-mark" aria-hidden="true">
              BM
            </span>
            <span className="brand-name">Brian D. McLaren</span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/#about">About</a>
            <a href="/books" aria-current="page">
              Books
            </a>
            <a href="/#speaking">Speaking</a>
            <a href="/#ideas">Writing</a>
            <a className="nav-cta" href="/#newsletter">
              Join the letter
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
              <p className="eyebrow">Books by Brian D. McLaren</p>
              <h1>
                A shelf of questions, stories, and{" "}
                <em>possible futures.</em>
              </h1>
            </div>
            <div className="library-hero-copy">
              <p>
                Across fiction, theology, spiritual practice, ecology, and
                children’s storytelling, Brian’s books invite readers to see
                inherited stories clearly—and imagine wiser ones together.
              </p>
              <div className="library-stats" aria-label="Library overview">
                <div>
                  <strong>30</strong>
                  <span>Books & editorial projects</span>
                </div>
                <div>
                  <strong>4</strong>
                  <span>Decades of writing</span>
                </div>
                <div>
                  <strong>3</strong>
                  <span>Generations of readers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section library-featured"
          aria-labelledby="featured-books-heading"
        >
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Begin with the newest work</p>
                <h2 id="featured-books-heading">Current shelf</h2>
              </div>
              <p>
                Recent fiction, essential nonfiction, and a peace-making story
                written especially for children.
              </p>
            </div>
            <div className="library-feature-grid">
              {featuredBooks.map((book) => (
                <a
                  className="library-feature-card"
                  href={book.href}
                  target="_blank"
                  rel="noreferrer"
                  key={book.title}
                >
                  <div className="library-feature-cover">
                    <img src={book.image} alt={book.alt} />
                  </div>
                  <div className="book-meta">
                    <span>{book.kind}</span>
                    <span>{book.year}</span>
                  </div>
                  <h3>{book.title}</h3>
                  <p>{book.copy}</p>
                  <span className="publisher-link">Publisher details ↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <nav className="library-index" aria-label="Browse the complete library">
          <div className="library-index-inner">
            <span>Browse</span>
            <a href="#fiction">Fiction</a>
            <a href="#all-ages">Children & all ages</a>
            <a href="#nonfiction">Nonfiction</a>
            <a href="#collaborations">Collaborations</a>
          </div>
        </nav>

        <div className="library-catalogue" id="catalogue">
          <CatalogueSection
            eyebrow="Fiction"
            title="Stories that test the future"
            intro="Two speculative journeys to Mars, plus the landmark conversational trilogy that helped a generation rethink inherited faith."
            books={fiction}
            id="fiction"
          />
          <CatalogueSection
            eyebrow="Stories for all ages"
            title="Where peace becomes the hero"
            intro="A children’s picture book and its companion fable for adults, both coauthored with peace activist Gareth Higgins."
            books={storiesForAllAges}
            id="all-ages"
          />
          <CatalogueSection
            eyebrow="Nonfiction"
            title="Faith, courage, and a changing world"
            intro="The central body of work: honest inquiry, spiritual practice, ecological attention, and a generous public theology."
            books={nonfiction}
            id="nonfiction"
          />
          <CatalogueSection
            eyebrow="Collaborations & edited work"
            title="Ideas made in conversation"
            intro="Books created with fellow writers, scholars, pastors, and activists—including two fresh retellings of scripture."
            books={collaborations}
            id="collaborations"
          />
        </div>

        <section className="library-horizon" aria-labelledby="horizon-heading">
          <div className="library-horizon-inner">
            <p className="eyebrow">On the horizon</p>
            <h2 id="horizon-heading">The shelf is still growing.</h2>
            <div className="horizon-grid">
              <article>
                <span>Announced nonfiction</span>
                <h3>The Beautiful Logic of a Meaningful Life</h3>
                <p>Planned for 2027.</p>
              </article>
              <article>
                <span>The Last Voyage trilogy · Book three</span>
                <h3>Ethnogenesis</h3>
                <p>Announced as the concluding Mars novel.</p>
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
            <strong>Find your next book</strong>
            <p className="footer-library-note">
              Ask your local bookseller or library for any title on this page.
            </p>
            <a href="#main">Back to the top ↑</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Brian D. McLaren. All rights reserved.</span>
          <span>Thirty books, one evolving conversation.</span>
        </div>
      </footer>
    </div>
  );
}
