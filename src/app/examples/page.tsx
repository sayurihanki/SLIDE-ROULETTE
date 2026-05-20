import Link from "next/link";

const examples = [
  {
    title: "Company Offsite",
    body: "Theme: the future of snacks, tone: polished, audience: cross-functional team.",
  },
  {
    title: "Classroom Warmup",
    body: "Theme: inventions nobody requested, tone: academic, audience: high school students.",
  },
  {
    title: "Meetup Lightning Round",
    body: "Theme: product lessons from everyday objects, tone: deadpan, audience: local builders.",
  },
  {
    title: "Silly Party",
    body: "Theme: heroic household chores, tone: chaotic, audience: friends who enjoy fake expertise.",
  },
];

export default function ExamplesPage() {
  return (
    <main className="main">
      <section className="page-hero">
        <div className="page-inner">
          <p className="eyebrow">Prompt starters</p>
          <h1>Example deck setups</h1>
          <p>
            These examples show the kind of event context the generator expects.
            Use them as a starting point and make the details specific to your room.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="section-inner grid-2">
          {examples.map((example) => (
            <article className="example-card" key={example.title}>
              <h2>{example.title}</h2>
              <p>{example.body}</p>
            </article>
          ))}
        </div>
        <div className="page-inner inline-actions">
          <Link className="button accent" href="/generate">
            Generate from your own setup
          </Link>
        </div>
      </section>
    </main>
  );
}
