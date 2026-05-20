import { GenerateDeckForm } from "@/components/generate-deck-form";

export default function GeneratePage() {
  return (
    <main className="main generator-shell">
      <div className="generator-grid">
        <section className="form-panel">
          <p className="eyebrow">Deck generator</p>
          <h1>Create a surprise deck</h1>
          <p>
            Give the host console just enough context to make slides that feel
            specific, readable, and safe for the room.
          </p>
          <GenerateDeckForm />
        </section>
        <aside className="preview-panel">
          <h2>What the presenter sees</h2>
          <p>
            Big, clean slides with just enough faux authority to invite a confident
            explanation.
          </p>
          <div className="mock-screen" aria-hidden="true">
            <div className="mock-slide-copy">
              <span>Quarterly Signal</span>
              <h3>The chart clearly wants a standing ovation</h3>
              <p>One mysterious metric. Two heroic arrows. No time to ask questions.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
