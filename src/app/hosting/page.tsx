import { CheckCircle2, Trophy, Users } from "lucide-react";

const tips = [
  {
    icon: Users,
    title: "Warm the audience up",
    body: "Explain that the goal is playful commitment, not embarrassing anyone. Invite applause for recovery.",
  },
  {
    icon: CheckCircle2,
    title: "Keep the format visible",
    body: "Announce the time limit, slide count, and no-skip rule before the first presenter starts.",
  },
  {
    icon: Trophy,
    title: "Judge generously",
    body: "Use broad criteria like confidence, storytelling, callbacks, and best rescue of a confusing slide.",
  },
];

export default function HostingPage() {
  return (
    <main className="main">
      <section className="page-hero">
        <div className="page-inner">
          <p className="eyebrow">Host guide</p>
          <h1>Run a smooth round</h1>
          <p>
            The best sessions feel lightly structured: enough guardrails for safety
            and pacing, enough surprise for the presenter to make the room lean in.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="grid-3">
            {tips.map((tip) => (
              <article className="card" key={tip.title}>
                <span className="card-icon">
                  <tip.icon size={21} aria-hidden="true" />
                </span>
                <h2>{tip.title}</h2>
                <p>{tip.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section band">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Suggested scoring</h2>
            <p>
              Give every audience member a simple 1-5 score for confidence,
              coherence, commitment, and best save. Keep prizes low-stakes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
