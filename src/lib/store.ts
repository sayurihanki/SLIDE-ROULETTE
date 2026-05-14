import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { KaraokeDeck, DeckSchema } from "@/lib/deck";

const dataDir = path.join(process.cwd(), ".data");
const storePath = path.join(dataDir, "decks.json");

type DeckStore = Record<string, KaraokeDeck>;

export async function saveDeck(deck: KaraokeDeck): Promise<KaraokeDeck> {
  const store = await readStore();
  store[deck.id] = deck;
  await mkdir(dataDir, { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
  return deck;
}

export async function getDeck(id: string): Promise<KaraokeDeck | null> {
  const store = await readStore();
  return store[id] || null;
}

async function readStore(): Promise<DeckStore> {
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
