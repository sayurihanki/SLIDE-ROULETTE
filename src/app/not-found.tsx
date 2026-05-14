import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div>
        <p className="eyebrow">Missing deck</p>
        <h1>This deck is not available.</h1>
        <p className="lede">
          It may have been generated in another local environment or the link was copied incorrectly.
        </p>
        <div className="inline-actions">
          <Link className="button accent" href="/generate">
            Generate a new deck
          </Link>
          <Link className="button secondary" href="/">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
