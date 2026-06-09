import type { SlideSyncState } from "@/hooks/use-slide-sync";

type PlayStateStore = Record<string, SlideSyncState>;

const memoryStore: PlayStateStore = {};
const defaultState: SlideSyncState = {
  index: -1,
  secondsLeft: 120,
  isRunning: false,
};

export async function getPlayState(deckId: string): Promise<SlideSyncState> {
  const remote = await readRemotePlayState(deckId);
  if (remote) {
    memoryStore[deckId] = remote;
    return remote;
  }

  return memoryStore[deckId] || { ...defaultState };
}

export async function setPlayState(deckId: string, state: SlideSyncState): Promise<void> {
  memoryStore[deckId] = state;
  await writeRemotePlayState(deckId, state);
}

async function readRemotePlayState(deckId: string): Promise<SlideSyncState | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    const response = await fetch(`${url}/get/${encodeURIComponent(playStateKey(deckId))}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { result?: string | null };
    if (!payload.result) {
      return null;
    }

    return JSON.parse(payload.result) as SlideSyncState;
  } catch {
    return null;
  }
}

async function writeRemotePlayState(deckId: string, state: SlideSyncState): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return;
  }

  const ttlSeconds = 60 * 60 * 6;

  try {
    await fetch(`${url}/set/${encodeURIComponent(playStateKey(deckId))}/${encodeURIComponent(JSON.stringify(state))}?EX=${ttlSeconds}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // ignore remote sync failures; BroadcastChannel still works locally
  }
}

function playStateKey(deckId: string) {
  return `slide-roulette:state:${deckId}`;
}
