import { describe, expect, it } from "vitest";
import { DeckRequestSchema, DeckSchema } from "@/lib/deck";
import { buildDeckPrompt, createFallbackDeck } from "@/lib/generator";
import { themeCategories, themeOptions } from "@/lib/themes";

const request = DeckRequestSchema.parse({
  eventContext: "Company offsite after lunch",
  audience: "Product, design, operations, and sales teammates",
  theme: "The future of workplace snacks",
  tone: "polished",
  slideCount: 8,
  insideJokes: "printer incident, banana budget",
});

describe("deck generation helpers", () => {
  it("builds a safety-conscious prompt with exact slide count", () => {
    const prompt = buildDeckPrompt(request);

    expect(prompt).toContain("exactly 8");
    expect(prompt).toContain("work-safe");
    expect(buildDeckPrompt({ ...request, themeDescription: "A product design retrospective" })).toContain(
      "A product design retrospective",
    );
    expect(prompt).toContain("fake briefing arc");
    expect(prompt).toContain("Do not repeat the same visualType");
    expect(prompt).toContain("visualType");
    expect(prompt).toContain("venn");
    expect(prompt).toContain("flowchart");
    expect(prompt).not.toContain("No inside jokes were provided");
    expect(prompt).toContain("printer incident");
  });

  it("creates schema-valid fallback decks", () => {
    const partialDeck = createFallbackDeck(request);

    const deck = DeckSchema.parse({
      ...partialDeck,
      id: "deck-id",
      audience: request.audience,
      tone: request.tone,
      theme: request.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
      generation: request,
    });

    expect(deck.slides).toHaveLength(8);
    expect(deck.slides[0].heading.length).toBeGreaterThan(8);
    expect(deck.slides[0].visualType).toBeDefined();
    expect(deck.slides[0].visualData?.labels.length).toBeGreaterThan(1);
    expect(new Set(deck.slides.map((slide) => slide.visualType)).size).toBeGreaterThan(3);
    expect(deck.slides.every((slide) => slide.speakerHidden.length > 8)).toBe(true);
  });

  it("accepts legacy slides without diagram specs", () => {
    const partialDeck = createFallbackDeck(request);
    const legacySlides = partialDeck.slides.map((slide) => {
      const legacySlide = { ...slide };
      delete legacySlide.visualType;
      delete legacySlide.visualData;
      return legacySlide;
    });

    const deck = DeckSchema.parse({
      ...partialDeck,
      slides: legacySlides,
      id: "legacy-deck-id",
      audience: request.audience,
      tone: request.tone,
      theme: request.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
    });

    expect(deck.slides[0].visualType).toBeUndefined();
    expect(deck.slides[0].visualLabel).toBeTruthy();
  });

  it("rejects unsafe empty deck requests", () => {
    const parsed = DeckRequestSchema.safeParse({
      eventContext: "",
      audience: "",
      theme: "",
      tone: "chaotic",
      slideCount: 20,
    });

    expect(parsed.success).toBe(false);
  });

  it("ships a broad curated theme library with metadata", () => {
    expect(themeOptions.length).toBeGreaterThanOrEqual(100);
    expect(themeCategories.length).toBeGreaterThanOrEqual(9);
    expect(themeOptions.every((option) => option.audiences.length > 0)).toBe(true);
  });
});
