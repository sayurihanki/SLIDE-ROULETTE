import Link from "next/link";

type MissingDeckMessageProps = {
  checking?: boolean;
};

export function MissingDeckMessage({ checking = false }: MissingDeckMessageProps) {
  return (
    <section className="not-found">
      <div>
        <p className="eyebrow">Missing deck</p>
        <h1>{checking ? "Finding your deck..." : "This deck is not available."}</h1>
        <p>
          {checking
            ? "Checking this browser for a recently generated deck."
            : "Generate a new deck, or open the link in the same browser that created it."}
        </p>
        <Link className="button accent" href="/generate">
          Generate a new deck
        </Link>
      </div>
    </section>
  );
}
