"use client";

import { DeckSchema, type KaraokeDeck } from "@/lib/deck";

const deckCachePrefix = "slide-roulette:deck:";

export function saveDeckToBrowser(deck: KaraokeDeck) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(`${deckCachePrefix}${deck.id}`, JSON.stringify(deck));
  } catch {
    // Server storage remains the source of truth when browser storage is unavailable.
  }
}

export function loadDeckFromBrowser(deckId: string): KaraokeDeck | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(`${deckCachePrefix}${deckId}`);
    if (!stored) {
      return null;
    }

    return DeckSchema.parse(JSON.parse(stored));
  } catch {
    window.localStorage.removeItem(`${deckCachePrefix}${deckId}`);
    return null;
  }
}
