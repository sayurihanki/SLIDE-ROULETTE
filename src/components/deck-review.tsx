"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, RefreshCw, Shuffle, WandSparkles } from "lucide-react";
import type { KaraokeDeck } from "@/lib/deck";

type DeckReviewProps = {
  deck: KaraokeDeck;
};

export function DeckReview({ deck: initialDeck }: DeckReviewProps) {
  const router = useRouter();
  const [deck, setDeck] = useState(initialDeck);
  const [swapIndex, setSwapIndex] = useState(1);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function patchDeck(body: Record<string, unknown>) {
    setError("");
    setBusyAction(String(body.action));

    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deck update failed.");
      }

      setDeck(data.deck);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Deck update failed.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="deck-review">
      <div className="deck-review-header">
        <p className="eyebrow">Pre-flight review</p>
        <h1>{deck.title}</h1>
        <p>
          {deck.slides.length} slides · {deck.tone} · {deck.theme}. Slide content stays hidden
          from the presenter until showtime.
        </p>
      </div>

      <div className="deck-review-meta">
        <article className="card">
          <h2>Deck setup</h2>
          <p>
            <strong>Audience:</strong> {deck.audience}
          </p>
          <p>
            <strong>Event:</strong> {deck.generation?.eventContext || "Custom event"}
          </p>
          {deck.generation?.insideJokes ? (
            <p>
              <strong>Inside jokes:</strong> {deck.generation.insideJokes}
            </p>
          ) : null}
        </article>
        <article className="card">
          <h2>Host checklist</h2>
          <ul className="review-checklist">
            <li>Open presenter view on the projector</li>
            <li>Keep this review screen on your laptop</li>
            <li>Read host cues during the round, not aloud to the room</li>
          </ul>
        </article>
      </div>

      <div className="deck-review-actions">
        <button
          className="button secondary"
          type="button"
          disabled={!!busyAction}
          onClick={() => patchDeck({ action: "regenerate" })}
        >
          <RefreshCw size={17} aria-hidden="true" />
          {busyAction === "regenerate" ? "Regenerating..." : "Regenerate deck"}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={!!busyAction}
          onClick={() => patchDeck({ action: "regenerate", tweak: "safer" })}
        >
          Safer rewrite
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={!!busyAction}
          onClick={() => patchDeck({ action: "regenerate", tweak: "sillier" })}
        >
          Sillier rewrite
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={!!busyAction}
          onClick={() => patchDeck({ action: "regenerate", tweak: "shorter" })}
        >
          Shorter deck
        </button>
      </div>

      <div className="deck-review-swap">
        <label>
          <span>Swap one slide</span>
          <select
            value={swapIndex}
            onChange={(event) => setSwapIndex(Number(event.target.value))}
          >
            {deck.slides.map((slide, index) => (
              <option key={slide.id} value={index}>
                Slide {index + 1}: {slide.kicker}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button secondary"
          type="button"
          disabled={!!busyAction}
          onClick={() => patchDeck({ action: "swap-slide", slideIndex: swapIndex })}
        >
          <Shuffle size={17} aria-hidden="true" />
          {busyAction === "swap-slide" ? "Swapping..." : "Swap selected slide"}
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="deck-review-launch">
        <button className="button accent" type="button" onClick={() => router.push(`/play/${deck.id}`)}>
          <WandSparkles size={18} aria-hidden="true" />
          Launch host console
        </button>
        <Link className="button secondary" href={`/play/${deck.id}/present`} target="_blank">
          Open presenter view
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
