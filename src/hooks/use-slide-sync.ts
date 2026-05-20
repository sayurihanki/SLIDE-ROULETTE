"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SlideSyncState = {
  index: number;
  secondsLeft: number;
  isRunning: boolean;
};

type SlideSyncMessage = {
  type: "slide-sync";
  deckId: string;
  source: "host" | "presenter";
  index: number;
};

type UseSlideSyncOptions = {
  deckId: string;
  role: "host" | "presenter";
  initialIndex: number;
  enabled?: boolean;
};

function channelName(deckId: string) {
  return `slide-roulette:${deckId}`;
}

export function useSlideSync({
  deckId,
  role,
  initialIndex,
  enabled = true,
}: UseSlideSyncOptions) {
  const [index, setIndex] = useState(initialIndex);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const publishIndex = useCallback(
    (nextIndex: number | ((current: number) => number)) => {
      setIndex((previous) => {
        const resolved = typeof nextIndex === "function" ? nextIndex(previous) : nextIndex;

        if (!enabled || typeof window === "undefined") {
          return resolved;
        }

        channelRef.current?.postMessage({
          type: "slide-sync",
          deckId,
          source: role,
          index: resolved,
        } satisfies SlideSyncMessage);

        void fetch(`/api/decks/${deckId}/state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index: resolved, secondsLeft: 240, isRunning: false }),
        }).catch(() => undefined);

        return resolved;
      });
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

      setIndex(message.index);
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

        const remote = (await response.json()) as { index?: number };
        if (typeof remote.index === "number" && !cancelled) {
          setIndex(remote.index);
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

  return { index, setIndex: publishIndex };
}
