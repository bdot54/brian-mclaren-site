import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Launch } from "../../launch";

const GREAT_RIFT_LINKS = [
  {
    label: "Bookshop",
    href: "https://bookshop.org/p/books/the-great-rift-brian-d-mclaren/21462f123b507d46",
  },
  {
    label: "Barnes & Noble",
    href: "https://www.barnesandnoble.com/w/the-great-rift-brian-d-mclaren/1149634824",
  },
  {
    label: "Amazon",
    href: "https://www.amazon.com/dp/1399838784?lv=shuf&channelId=500&plpRedirect=mhFallback",
  },
  {
    label: "Audiobook on Audible",
    href: "https://www.audible.com/pd/The-Great-Rift-Audiobook/B0H75DZHMF",
  },
];

const LAST_VOYAGE_LINKS = [
  {
    label: "Bookshop",
    href: "https://bookshop.org/p/books/the-last-voyage-brian-mclaren/20243554",
  },
  {
    label: "Barnes & Noble",
    href: "https://www.barnesandnoble.com/w/the-last-voyage-brian-mclaren/1143718471",
  },
  { label: "Amazon", href: "https://www.amazon.com/dp/1399814141" },
];

function BuyButtons({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <div className="rift-book-buttons">
      {links.map((link, index) => (
        <a
          key={link.href}
          className={index === 0 ? "button button-primary" : "button button-secondary"}
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          {link.label} <span className="button-arrow">↗</span>
        </a>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Hear the opening of The Great Rift",
  description:
    "Listen to the opening of the audiobook of The Great Rift by Brian D. McLaren, narrated by David Brooks.",
  robots: { index: false, follow: false },
};

// Opening of Chapter 1, as read in the audiobook sample. Proofread against the audio.
const TRANSCRIPT = [
  "Thurman Howard Thurman had gotten so used to the Ark's hum that he seldom heard it any more. But after fourteen nights of fitful sleep, and after hours of restless turning on this particular night, the hum felt like an inescapable roar. Thurman decided he would rather be sitting sleepless on the bridge than lying sleepless in his cocoon.",
  "He quietly emerged and pushed gently toward the open hatch. Normally, he would not have dared to sit in the captain's chair. After all, he was an executive who set protocols. He didn't like to break them. But this morning, with everyone asleep, he decided to afford himself the luxury. Soraya wouldn't mind. The hum, of course, was not the sound of engines.",
  "The Launch/Voyage/Resource Vehicle, or LVRV, was simply an object in motion that was staying in motion. Three months earlier, the Ark's engines had fired, creating the momentum that still propelled the spacecraft silently through space toward Mars, assisted by the slingshot effect of solar gravity. The hum, Thurman knew, was the sound of over seventy fans.",
  "Some tiny fans cooled computers, some circulated heat, but the loudest were used to circulate air through an array of carbon dioxide scrubbers. Thurman and his nine fellow crew members shared a limited amount of air with the menagerie of animals they had brought with them. Every breath of every creature produced carbon dioxide. Rising CO2 levels would quickly become lethal if they weren't properly managed.",
  "Some CO2 was captured by the plants on deck three, but the majority had to be absorbed by the Ark's electrochemical scrubbers. It seems CO2 levels are a problem everywhere, he said to himself. He gazed through the viewport into the darkness outside. The stars rendered invisible by the subdued light of the control panel. The steady rise and fall of Thurman's own breathing now added a layer of rhythm over the constant, vital hum of the fans.",
  "I'm the only one who suffers from this damned insomnia, he mused. He thought of the others sleeping soundly, floating weightlessly, oblivious to this ceaseless whirring. He brought to mind the face of each crew member, recalling the gifts they brought to this last voyage. First, he saw the rugged, I've seen everything, face of his partner in business and life, Ekaterina Deripaska, a woman of courageous determination, whose desire to do the right thing in the right way left no room for guile.",
  "Then he saw the calm, kind face of Soraya Rasul, captain and entomologist, who led by earning trust, rather than by wielding dominating authority. Then came the mischievous smile of Gabriela Mercedes Coroy, first mate, biologist, and geneticist. Her cheerful eyes concealing her extraordinary brilliance, always ready to lift spirits, and elicit groans, with a pun, a joke, or a funny story.",
  "Then Thurman called to mind the wide, charismatic grin of Ikemba Odinga, the voyage's pilot and consummate problem solver, for whom Thurman felt a fatherly affection. Next came the face of Dei-Lin Wu, co-pilot and plant pathologist, whose intense eye contact showed unflinching honesty and forthrightness. Finally, Thurman saw the sky-blue eyes of Eve Innis, a theologian, ethicist, and expert in human development.",
  "She combined sincere respect for the world's spiritual traditions with a sharp, critical mind, and she had a magic for bringing people together. Eve had helped him recruit two artists gifted in both poetry and music, Nikau Ruka and Refa Barghouthi. Nikau's face radiated mature, unpretentious kindness, and Refa's was full of youthful creativity and curiosity.",
  "They brought a human element that Mars Base needed."
];

export default function RiftListenPage() {
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
            <a
              href={GREAT_RIFT_LINKS[0].href}
              target="_blank"
              rel="noreferrer"
              aria-label="Get The Great Rift"
              style={{ display: "block", width: "100%", maxWidth: "340px" }}
            >
              <Image
                src="/the-great-rift.jpg"
                alt="Cover of The Great Rift"
                width={600}
                height={900}
                sizes="(max-width: 800px) 60vw, 340px"
                priority
                style={{ width: "100%", height: "auto" }}
              />
            </a>
            <div className="rift-listen-copy">
              <p className="eyebrow">The Great Rift · Audiobook</p>
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
                Hear the opening
              </h1>
              <p>
                About five minutes from the start of the novel, narrated by
                David Brooks. The audiobook is available{" "}
                <Launch before="November 3" after="now" />.
              </p>
              <audio
                controls
                preload="metadata"
                style={{ width: "100%", marginTop: "1rem" }}
                src="/audio/great-rift-opening.mp3"
              >
                Your browser does not support audio playback.
              </audio>
              <details>
                <summary>Read the transcript</summary>
                {TRANSCRIPT.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
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
          aria-labelledby="listen-books-heading"
        >
          <div className="section-inner">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Get the books</p>
                <h2 id="listen-books-heading">
                  Keep reading, or catch up first
                </h2>
              </div>
            </div>
            <div className="rift-book-grid">
              <div className="rift-book-card">
                <a
                  href={GREAT_RIFT_LINKS[0].href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Get The Great Rift"
                >
                  <Image
                    src="/the-great-rift.jpg"
                    alt="Cover of The Great Rift"
                    width={600}
                    height={900}
                    sizes="(max-width: 800px) 40vw, 180px"
                  />
                </a>
                <div>
                  <h3>The Great Rift</h3>
                  <p>
                    <Launch
                      before="Out November 3. Pre-order now, in print and audio."
                      after="Out now, in print and audio."
                    />
                  </p>
                  <BuyButtons links={GREAT_RIFT_LINKS} />
                </div>
              </div>
              <div className="rift-book-card">
                <a
                  href={LAST_VOYAGE_LINKS[0].href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Get The Last Voyage"
                >
                  <Image
                    src="/the-last-voyage.jpg"
                    alt="Cover of The Last Voyage"
                    width={600}
                    height={900}
                    sizes="(max-width: 800px) 40vw, 180px"
                  />
                </a>
                <div>
                  <h3>The Last Voyage</h3>
                  <p>New to the story? Start with book one.</p>
                  <BuyButtons links={LAST_VOYAGE_LINKS} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
