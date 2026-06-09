"use client";

import { useEffect, useState } from "react";
import { DeckReview } from "@/components/deck-review";
import { MissingDeckMessage } from "@/components/missing-deck-message";
import { loadDeckFromBrowser, saveDeckToBrowser } from "@/lib/browser-deck-cache";
import type { KaraokeDeck } from "@/lib/deck";

type DeckReviewLoaderProps = {
  deckId: string;
  initialDeck: KaraokeDeck | null;
};

export function DeckReviewLoader({ deckId, initialDeck }: DeckReviewLoaderProps) {
  const [deck, setDeck] = useState<KaraokeDeck | null>(initialDeck);
  const [hasCheckedBrowser, setHasCheckedBrowser] = useState(Boolean(initialDeck));

  useEffect(() => {
    if (initialDeck) {
      saveDeckToBrowser(initialDeck);
      setHasCheckedBrowser(true);
      return;
    }

    setDeck(loadDeckFromBrowser(deckId));
    setHasCheckedBrowser(true);
  }, [deckId, initialDeck]);

  if (deck) {
    return <DeckReview deck={deck} />;
  }

  return <MissingDeckMessage checking={!hasCheckedBrowser} />;
}
