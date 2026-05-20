import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { KaraokeDeck, DeckSchema } from "@/lib/deck";

const dataDir = path.join(process.cwd(), ".data");
const storePath = path.join(dataDir, "decks.json");
const deckTtlSeconds = 60 * 60 * 72;

type DeckStore = Record<string, KaraokeDeck>;

export async function saveDeck(deck: KaraokeDeck): Promise<KaraokeDeck> {
  const validated = DeckSchema.parse(deck);
  await writeRemoteDeck(validated);
  await writeFileDeck(validated);
  return validated;
}

export async function getDeck(id: string): Promise<KaraokeDeck | null> {
  const remote = await readRemoteDeck(id);
  if (remote) {
    return remote;
  }

  const store = await readFileStore();
  return store[id] || null;
}

export async function updateDeck(
  id: string,
  updater: (deck: KaraokeDeck) => KaraokeDeck,
): Promise<KaraokeDeck | null> {
  const current = await getDeck(id);
  if (!current) {
    return null;
  }

  return saveDeck(updater(current));
}

async function writeFileDeck(deck: KaraokeDeck): Promise<void> {
  const store = await readFileStore();
  store[deck.id] = deck;
  await mkdir(dataDir, { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

async function readFileStore(): Promise<DeckStore> {
  try {
    const contents = await readFile(storePath, "utf8");
    const parsed = JSON.parse(contents) as DeckStore;
    return Object.fromEntries(
      Object.entries(parsed).map(([id, deck]) => [id, DeckSchema.parse(deck)]),
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

function deckKey(id: string) {
  return `slide-roulette:deck:${id}`;
}

async function readRemoteDeck(id: string): Promise<KaraokeDeck | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  try {
    const response = await fetch(`${url}/get/${encodeURIComponent(deckKey(id))}`, {
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

    return DeckSchema.parse(JSON.parse(payload.result));
  } catch {
    return null;
  }
}

async function writeRemoteDeck(deck: KaraokeDeck): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return;
  }

  try {
    await fetch(
      `${url}/set/${encodeURIComponent(deckKey(deck.id))}/${encodeURIComponent(JSON.stringify(deck))}?EX=${deckTtlSeconds}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  } catch {
    // file store remains available locally
  }
}
