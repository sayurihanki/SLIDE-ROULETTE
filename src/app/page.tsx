import Link from "next/link";
import { ArrowRight, Clock3, MonitorPlay, Sparkles } from "lucide-react";

const featureCards = [
  {
    icon: Sparkles,
    title: "Generate surprising slides",
    body: "Give the app an audience, tone, and theme. It returns readable surprise slides built for improvisation.",
  },
  {
    icon: MonitorPlay,
    title: "Run from one screen",
    body: "Open the host console, hand the presenter the clicker, and keep the room moving from a projector.",
  },
  {
    icon: Clock3,
    title: "Keep it tight",
    body: "Short decks, visible progress, and a simple timer make the game easy to run between sessions.",
  },
];

export default function Home() {
  return (
    <main className="main">
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">AI decks for in-person improv presentations</p>
          <h1>Slide Roulette</h1>
          <p>
            A polished host site for PowerPoint Karaoke: explain the rules, prep
            the room, generate a fresh surprise deck, and launch it in the browser.
          </p>
          <div className="hero-actions">
            <Link className="button accent" href="/generate">
              Generate a deck <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button secondary" href="/how-to-play">
              Learn the rules
            </Link>
          </div>
        </div>
        <div className="below-hero-hint" aria-hidden="true">
          <span className="hint-slide" />
          <span className="hint-slide" />
          <span className="hint-slide" />
        </div>
      </section>

      <section className="stat-strip" aria-label="Game defaults">
        <div>
          <p>
            <strong>8-10</strong>
            <span>slides per deck</span>
          </p>
          <p>
            <strong>3-5</strong>
            <span>minutes per presenter</span>
          </p>
          <p>
            <strong>0</strong>
            <span>advance peeking</span>
          </p>
          <p>
            <strong>1</strong>
            <span>shared screen</span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Built for hosts who want the room to play along.</h2>
            <p>
              The site gives new hosts enough structure to run the game without
              turning it into a ceremony. The presenter gets surprise slides; the
              host gets control and pacing.
            </p>
          </div>
          <div className="grid-3">
            {featureCards.map((card) => (
              <article className="card" key={card.title}>
                <span className="card-icon">
                  <card.icon size={21} aria-hidden="true" />
                </span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Simple rules. Maximum pretending.</h2>
            <p>
              Presenters never see the deck in advance, slides keep advancing,
              and the audience scores confidence, commitment, and recovery.
            </p>
          </div>
          <div className="grid-3">
            <article className="card">
              <h3>No previewing</h3>
              <p>The first time the presenter sees a slide is when everyone sees it.</p>
            </article>
            <article className="card">
              <h3>No skipping</h3>
              <p>Every strange chart deserves an explanation. Especially the strange ones.</p>
            </article>
            <article className="card">
              <h3>No overthinking</h3>
              <p>Short decks keep the energy high and give more people a turn.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
