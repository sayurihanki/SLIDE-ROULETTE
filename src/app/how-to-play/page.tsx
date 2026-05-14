import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HowToPlayPage() {
  return (
    <main className="main">
      <section className="page-hero">
        <div className="page-inner">
          <p className="eyebrow">Game rules</p>
          <h1>How to play</h1>
          <p>
            PowerPoint Karaoke is an improv presentation game. A presenter gives a
            confident talk from slides they have never seen before.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="page-inner guide-grid">
          <aside className="guide-card">
            <h2>Host setup</h2>
            <p>
              Pick a deck, choose a presenter, start the timer, and let the room
              judge the performance by confidence instead of correctness.
            </p>
            <div className="inline-actions">
              <Link className="button accent" href="/generate">
                Make a deck <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </aside>
          <ol className="steps">
            <li>
              <div>
                <h2>Choose the presenter</h2>
                <p>
                  They should not know the topic, slides, or punchline. Mild nerves are
                  part of the format.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h2>Show the first slide</h2>
                <p>
                  The presenter introduces the topic as if they are the world expert
                  who definitely asked for this meeting.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h2>Advance steadily</h2>
                <p>
                  Do not skip slides. Let the presenter connect the dots and recover
                  when the deck takes a turn.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h2>Score the performance</h2>
                <p>
                  Reward commitment, callbacks, confident nonsense, and landing the
                  final slide with style.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
