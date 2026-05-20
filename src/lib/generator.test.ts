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

  it("defaults blank or missing audience to a general audience", () => {
    const blankAudienceRequest = DeckRequestSchema.parse({
      eventContext: "Birthday party after dinner",
      audience: "",
      theme: "Dessert logistics",
      tone: "silly",
      slideCount: 6,
      insideJokes: "",
    });
    const missingAudienceRequest = DeckRequestSchema.parse({
      eventContext: "Team lunch",
      theme: "Napkin strategy",
      tone: "deadpan",
      slideCount: 6,
    });

    expect(blankAudienceRequest.audience).toBe("general audience");
    expect(blankAudienceRequest.insideJokes).toBe("");
    expect(missingAudienceRequest.audience).toBe("general audience");
    expect(missingAudienceRequest.insideJokes).toBe("");
  });

  it("builds natural prompts and fallback decks without audience or jokes", () => {
    const optionalRequest = DeckRequestSchema.parse({
      eventContext: "Neighborhood game night",
      theme: "Folding chair economics",
      tone: "chaotic",
      slideCount: 6,
    });
    const prompt = buildDeckPrompt(optionalRequest);
    const partialDeck = createFallbackDeck(optionalRequest);

    const deck = DeckSchema.parse({
      ...partialDeck,
      id: "optional-deck-id",
      audience: optionalRequest.audience,
      tone: optionalRequest.tone,
      theme: optionalRequest.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
    });

    expect(prompt).toContain("Audience: general audience.");
    expect(prompt).toContain("No inside jokes were provided.");
    expect(prompt).not.toContain("Audience: .");
    expect(deck.audience).toBe("general audience");
    expect(deck.slides).toHaveLength(6);
    expect(deck.slides.every((slide) => slide.visualPrompt.includes(optionalRequest.theme))).toBe(true);
  });

  it("creates shuffled, theme-specific fallback decks with a fixed seed", () => {
    const seededRequest = DeckRequestSchema.parse({
      eventContext: "Local browser verification night",
      theme: "Snack committee strategy",
      tone: "polished",
      slideCount: 8,
    });
    const partialDeck = createFallbackDeck(seededRequest, "fixed-seed");
    const deck = DeckSchema.parse({
      ...partialDeck,
      id: "seeded-deck-id",
      audience: seededRequest.audience,
      tone: seededRequest.tone,
      theme: seededRequest.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
    });
    const visualTypes = deck.slides.map((slide) => slide.visualType);
    const headings = deck.slides.map((slide) => slide.heading);
    const labels = deck.slides.flatMap((slide) => slide.visualData?.labels || []);
    const variants = deck.slides.map((slide) => slide.visualVariant);

    expect(new Set(visualTypes).size).toBe(8);
    expect(visualTypes).not.toEqual([
      "venn",
      "comparison_table",
      "before_after",
      "quadrant",
      "flowchart",
      "funnel",
      "cycle",
      "timeline",
    ]);
    expect(new Set(headings).size).toBe(headings.length);
    expect(labels.join(" ")).toMatch(/Snack|Strategy|Browser|Verification/i);
    expect(new Set(variants).size).toBeGreaterThan(1);
  });

  it("creates fresh fallback decks from identical requests", () => {
    const first = createFallbackDeck(request);
    const second = createFallbackDeck(request);
    const firstSignature = first.slides
      .map((slide) => `${slide.visualType}:${slide.visualVariant}:${slide.visualData?.labels.join("|")}`)
      .join(",");
    const secondSignature = second.slides
      .map((slide) => `${slide.visualType}:${slide.visualVariant}:${slide.visualData?.labels.join("|")}`)
      .join(",");

    expect(firstSignature).not.toBe(secondSignature);
  });

  it("accepts legacy slides without diagram specs", () => {
    const partialDeck = createFallbackDeck(request);
    const legacySlides = partialDeck.slides.map((slide) => {
      const legacySlide = { ...slide };
      delete legacySlide.visualType;
      delete legacySlide.visualVariant;
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
