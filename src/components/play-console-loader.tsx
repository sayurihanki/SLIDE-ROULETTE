"use client";

import { useEffect, useState } from "react";
import { MissingDeckMessage } from "@/components/missing-deck-message";
import { PlayConsole } from "@/components/play-console";
import { loadDeckFromBrowser, saveDeckToBrowser } from "@/lib/browser-deck-cache";
import type { KaraokeDeck } from "@/lib/deck";

type PlayConsoleLoaderProps = {
  deckId: string;
  initialDeck: KaraokeDeck | null;
  mode?: "host" | "presenter";
};

export function PlayConsoleLoader({
  deckId,
  initialDeck,
  mode = "host",
}: PlayConsoleLoaderProps) {
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
    return <PlayConsole deck={deck} mode={mode} />;
  }

  return <MissingDeckMessage checking={!hasCheckedBrowser} />;
}
