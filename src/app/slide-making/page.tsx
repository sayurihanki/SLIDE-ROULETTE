export default function SlideMakingPage() {
  return (
    <main className="main">
      <section className="page-hero">
        <div className="page-inner">
          <p className="eyebrow">Deck craft</p>
          <h1>Slides that are funny to explain</h1>
          <p>
            Great surprise decks are readable, safe, and just strange enough that a
            presenter can invent logic between them.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="page-inner">
          <ol className="steps">
            <li>
              <div>
                <h2>One idea per slide</h2>
                <p>Large type, short labels, and a clear visual beat beat dense realism.</p>
              </div>
            </li>
            <li>
              <div>
                <h2>Use familiar formats strangely</h2>
                <p>Roadmaps, quadrants, quotes, funnels, org charts, and metric dashboards all invite confident explanation.</p>
              </div>
            </li>
            <li>
              <div>
                <h2>Stay kind</h2>
                <p>Keep jokes broad, inclusive, and harmless. Avoid material that makes the presenter punch down.</p>
              </div>
            </li>
            <li>
              <div>
                <h2>Leave room to connect</h2>
                <p>A deck should have a loose theme, not a script. The presenter supplies the plot.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
