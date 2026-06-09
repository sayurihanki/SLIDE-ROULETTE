"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SlideSyncState = {
  index: number;
  secondsLeft: number;
  isRunning: boolean;
  wordless?: boolean;
};

type SlideSyncMessage = {
  type: "slide-sync";
  deckId: string;
  source: "host" | "presenter";
  index: number;
  wordless?: boolean;
};

type UseSlideSyncOptions = {
  deckId: string;
  role: "host" | "presenter";
  initialIndex: number;
  initialWordless?: boolean;
  enabled?: boolean;
};

function channelName(deckId: string) {
  return `slide-roulette:${deckId}`;
}

export function useSlideSync({
  deckId,
  role,
  initialIndex,
  initialWordless = false,
  enabled = true,
}: UseSlideSyncOptions) {
  const [index, setIndex] = useState(initialIndex);
  const [wordless, setWordlessState] = useState(initialWordless);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const indexRef = useRef(initialIndex);
  const wordlessRef = useRef(initialWordless);

  const publishIndex = useCallback(
    (nextIndex: number | ((current: number) => number)) => {
      setIndex((previous) => {
        const resolved = typeof nextIndex === "function" ? nextIndex(previous) : nextIndex;
        indexRef.current = resolved;

        if (!enabled || typeof window === "undefined") {
          return resolved;
        }

        channelRef.current?.postMessage({
          type: "slide-sync",
          deckId,
          source: role,
          index: resolved,
          wordless: wordlessRef.current,
        } satisfies SlideSyncMessage);

        void fetch(`/api/decks/${deckId}/state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            index: resolved,
            secondsLeft: 120,
            isRunning: false,
            wordless: wordlessRef.current,
          }),
        }).catch(() => undefined);

        return resolved;
      });
    },
    [deckId, enabled, role],
  );

  const publishWordless = useCallback(
    (nextWordless: boolean) => {
      setWordlessState(nextWordless);
      wordlessRef.current = nextWordless;

      if (!enabled || typeof window === "undefined") {
        return;
      }

      channelRef.current?.postMessage({
        type: "slide-sync",
        deckId,
        source: role,
        index: indexRef.current,
        wordless: nextWordless,
      } satisfies SlideSyncMessage);

      void fetch(`/api/decks/${deckId}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          index: indexRef.current,
          secondsLeft: 120,
          isRunning: false,
          wordless: nextWordless,
        }),
      }).catch(() => undefined);
    },
    [deckId, enabled, role],
  );

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const channel = new BroadcastChannel(channelName(deckId));
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<SlideSyncMessage>) => {
      const message = event.data;
      if (message?.type !== "slide-sync" || message.deckId !== deckId || message.source === role) {
        return;
      }

      indexRef.current = message.index;
      setIndex(message.index);
      if (typeof message.wordless === "boolean") {
        wordlessRef.current = message.wordless;
        setWordlessState(message.wordless);
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [deckId, enabled, role]);

  useEffect(() => {
    if (!enabled || role !== "presenter") {
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch(`/api/decks/${deckId}/state`, { cache: "no-store" });
        if (!response.ok || cancelled) {
          return;
        }

        const remote = (await response.json()) as { index?: number; wordless?: boolean };
        if (typeof remote.index === "number" && !cancelled) {
          indexRef.current = remote.index;
          setIndex(remote.index);
        }
        if (typeof remote.wordless === "boolean" && !cancelled) {
          wordlessRef.current = remote.wordless;
          setWordlessState(remote.wordless);
        }
      } catch {
        // ignore polling errors
      }
    }

    poll();
    const timer = window.setInterval(poll, 800);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [deckId, enabled, role]);

  return { index, setIndex: publishIndex, wordless, setWordless: publishWordless };
}
