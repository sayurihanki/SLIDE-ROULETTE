import type { DeckRequest } from "@/lib/deck";

export const fillerWords = new Set([
  "about",
  "adobe",
  "after",
  "aggressive",
  "audience",
  "committee",
  "company",
  "deck",
  "event",
  "friend",
  "friends",
  "general",
  "humanity",
  "invention",
  "local",
  "most",
  "night",
  "passive",
  "party",
  "people",
  "presentation",
  "team",
  "the",
  "this",
  "with",
  "work",
]);

export function buildKeywordBank(request: DeckRequest): string[] {
  const theme = titleCase(request.theme);
  const themeWords = significantWords(request.theme);
  const raw = [
    request.themeDescription,
    request.eventContext,
    request.audience,
    request.insideJokes,
  ].join(" ");
  const contextWords = raw
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 3 && !fillerWords.has(word))
    .map(titleCase);
  const uniqueContextWords = Array.from(new Set(contextWords));
  const themeSpecific = themeWords.flatMap((word) => [
    word,
    `${word} Logic`,
    `${word} Drift`,
    `${word} Protocol`,
    `${word} Map`,
  ]);
  const themePhrases = [
    theme,
    ...themeSpecific,
    ...uniqueContextWords.slice(0, 8),
    `${theme} Politics`,
    `${themeWords[0] || theme} Math`,
    `${themeWords[1] || theme} Exceptions`,
    `${themeWords[0] || theme} Anxiety`,
    `${themeWords[1] || theme} Alignment`,
    `${themeWords[0] || theme} Forecast`,
    `${themeWords[1] || theme} Playbook`,
    ...themeSpecific,
  ];
  const fallback = [
    `${theme} Signal`,
    `${theme} Momentum`,
    `${theme} Evidence`,
    `${theme} Risk`,
    `${theme} Outcome`,
  ];

  return Array.from(new Set([...themePhrases, ...uniqueContextWords, ...fallback])).slice(0, 22);
}

export function keywordTokens(request: DeckRequest): Set<string> {
  return new Set(
    [
      request.theme,
      request.themeDescription,
      request.eventContext,
      request.audience,
      request.insideJokes,
    ]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2 && !fillerWords.has(word)),
  );
}

export function parseJokes(request: DeckRequest): string[] {
  return request.insideJokes
    .split(/[,.\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function significantWords(value: string): string[] {
  const words = value
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 2 && !fillerWords.has(word))
    .map(titleCase);

  return words.length > 0 ? Array.from(new Set(words)) : ["Topic"];
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function clip(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, Math.max(0, length - 3))}...` : value;
}
