import { describe, expect, it } from "vitest";
import { DeckRequestSchema, DeckSchema, visualTypes } from "@/lib/deck";
import { planDeckComposition } from "@/lib/composition-planner";
import { evaluateDeckQuality } from "@/lib/deck-quality";
import { buildDeckPrompt, createFallbackDeck } from "@/lib/generator";
import { visibleGeneratedSlideText } from "@/lib/slide-visibility";
import { themeCategories, themeOptions } from "@/lib/themes";
import { getVisualEntry } from "@/lib/visual-registry";

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
    expect(prompt).toContain("Follow this slide plan exactly");
    expect(prompt).toContain("Do not repeat the same visualType");
    expect(prompt).toContain("visualType");
    expect(prompt).toContain("venn");
    expect(prompt).toContain("flowchart");
    expect(prompt).toContain("gantt");
    expect(prompt).toContain("Labels must name concrete entities");
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

  it("supports the new 5 to 10 slide generation range", () => {
    const fiveSlideRequest = DeckRequestSchema.parse({
      ...request,
      slideCount: 5,
    });
    const tenSlideRequest = DeckRequestSchema.parse({
      ...request,
      slideCount: 10,
    });
    const fiveSlideDeck = DeckSchema.parse({
      ...createFallbackDeck(fiveSlideRequest, "five-slide-seed"),
      id: "five-slide-deck-id",
      audience: fiveSlideRequest.audience,
      tone: fiveSlideRequest.tone,
      theme: fiveSlideRequest.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
      generation: fiveSlideRequest,
    });
    const tenSlideDeck = DeckSchema.parse({
      ...createFallbackDeck(tenSlideRequest, "ten-slide-seed"),
      id: "ten-slide-deck-id",
      audience: tenSlideRequest.audience,
      tone: tenSlideRequest.tone,
      theme: tenSlideRequest.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
      generation: tenSlideRequest,
    });

    expect(fiveSlideDeck.slides).toHaveLength(5);
    expect(tenSlideDeck.slides).toHaveLength(10);
    expect(DeckRequestSchema.safeParse({ ...request, slideCount: 11 }).success).toBe(false);
  });

  it("keeps legacy 12-slide decks parseable", () => {
    const tenSlideRequest = DeckRequestSchema.parse({
      ...request,
      slideCount: 10,
    });
    const partialDeck = createFallbackDeck(tenSlideRequest, "legacy-range-seed");
    const legacySlides = [
      ...partialDeck.slides,
      ...partialDeck.slides.slice(0, 2).map((slide, index) => ({
        ...slide,
        id: `legacy-extra-${index + 1}`,
      })),
    ];
    const deck = DeckSchema.parse({
      ...partialDeck,
      id: "legacy-12-slide-deck",
      audience: request.audience,
      tone: request.tone,
      theme: request.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
      generation: {
        ...request,
        slideCount: 12,
      },
      slides: legacySlides,
    });

    expect(deck.slides).toHaveLength(12);
    expect(deck.generation?.slideCount).toBe(12);
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

  it("defaults Simple mode off and parses the legacy noWords field when requested", () => {
    const defaultRequest = DeckRequestSchema.parse({
      eventContext: "Training room warmup",
      theme: "Escalation Maps",
      tone: "polished",
      slideCount: 5,
    });
    const noWordsRequest = DeckRequestSchema.parse({
      ...defaultRequest,
      noWords: true,
    });

    expect(defaultRequest.noWords).toBe(false);
    expect(noWordsRequest.noWords).toBe(true);
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

  it("keeps normal fallback copy coherent without repeated finding labels", () => {
    const coherentRequest = DeckRequestSchema.parse({
      eventContext: "Lehi SC Training",
      audience: "Tech Pre-Sales Teammates",
      theme: "Customer Onboarding",
      tone: "polished",
      slideCount: 8,
    });
    const partialDeck = createFallbackDeck(coherentRequest, "coherent-copy-seed");
    const headings = partialDeck.slides.map((slide) => slide.heading);
    const combinedHeadings = headings.join(" ");
    const exactThemeMatches = combinedHeadings.match(/Customer Onboarding/g) || [];

    expect(new Set(headings).size).toBe(headings.length);
    expect(combinedHeadings).not.toMatch(/Finding \d/i);
    expect(exactThemeMatches.length).toBeLessThanOrEqual(2);
    expect(combinedHeadings).toMatch(/Customer|Onboarding/i);
  });

  it("builds schema-valid Simple mode fallback decks with varied diagrams and shorter labels", () => {
    const noWordsRequest = DeckRequestSchema.parse({
      eventContext: "Lehi SC Training",
      audience: "Tech Pre-Sales Teammates",
      theme: "Pipeline Readiness",
      tone: "polished",
      slideCount: 8,
      noWords: true,
    });
    const first = createFallbackDeck(noWordsRequest);
    const second = createFallbackDeck(noWordsRequest);
    const deck = DeckSchema.parse({
      ...first,
      id: "simple-deck-id",
      audience: noWordsRequest.audience,
      tone: noWordsRequest.tone,
      theme: noWordsRequest.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
      generation: noWordsRequest,
    });
    const firstSignature = first.slides
      .map((slide) => `${slide.visualType}:${slide.visualData?.values.join("|")}`)
      .join(",");
    const secondSignature = second.slides
      .map((slide) => `${slide.visualType}:${slide.visualData?.values.join("|")}`)
      .join(",");
    const simpleLabels = deck.slides.flatMap((slide) => slide.visualData?.labels || []);
    const simpleHeadings = deck.slides.map((slide) => slide.heading);

    expect(deck.generation?.noWords).toBe(true);
    expect(new Set(deck.slides.map((slide) => slide.visualType)).size).toBe(8);
    expect(firstSignature).not.toBe(secondSignature);
    expect(buildDeckPrompt(noWordsRequest)).toContain("Simple mode");
    expect(simpleLabels.every((label) => label.split(/\s+/).length <= 3)).toBe(true);
    expect(simpleHeadings.every((heading) => heading.split(/\s+/).length <= 8)).toBe(true);
  });

  it("keeps Simple mode slide text minimal while preserving heading and diagram labels", () => {
    const noWordsRequest = DeckRequestSchema.parse({
      eventContext: "Lehi SC Training",
      audience: "Tech Pre-Sales Teammates",
      theme: "Diagram Theater",
      tone: "polished",
      slideCount: 5,
      noWords: true,
    });
    const partialDeck = createFallbackDeck(noWordsRequest, "wordless-render-seed");
    const deck = DeckSchema.parse({
      ...partialDeck,
      id: "simple-render-deck",
      audience: noWordsRequest.audience,
      tone: noWordsRequest.tone,
      theme: noWordsRequest.theme,
      source: "fallback",
      createdAt: new Date().toISOString(),
      generation: noWordsRequest,
    });
    const slide = deck.slides[0];
    const simpleVisibleText = visibleGeneratedSlideText(slide, true);

    expect(simpleVisibleText).toEqual(
      expect.arrayContaining([
        slide.heading,
        ...(slide.visualData?.labels || []),
      ]),
    );
    expect(simpleVisibleText).not.toContain(slide.kicker);
    expect(simpleVisibleText).not.toContain(slide.points[0]);
    expect(simpleVisibleText).not.toContain(slide.visualLabel);
    expect(simpleVisibleText).not.toContain(slide.visualData?.title);
    expect(visibleGeneratedSlideText(slide, false)).toEqual(
      expect.arrayContaining([
        slide.kicker,
        slide.heading,
        slide.visualLabel,
        slide.visualData?.title || "",
      ]),
    );
  });

  it("plans topic-aware, non-repeating visual compositions", () => {
    const plan = planDeckComposition(
      DeckRequestSchema.parse({
        eventContext: "Distributed team planning session",
        audience: "Product managers and support leads",
        theme: "Time Zones",
        tone: "academic",
        slideCount: 8,
      }),
      "time-plan-seed",
    );
    const firstThreeTimeTagged = plan
      .slice(0, 3)
      .filter((spec) => getVisualEntry(spec.visualType).semanticTags.includes("time"));

    expect(new Set(plan.map((spec) => spec.visualType)).size).toBe(8);
    expect(firstThreeTimeTagged.length).toBeGreaterThanOrEqual(2);
    expect(plan.every((spec, index) => index === 0 || spec.visualType !== plan[index - 1].visualType)).toBe(true);
    expect(plan.some((spec) => spec.visualType === "gantt" || spec.visualType === "timeline")).toBe(true);
  });

  it("keeps local labels centered on the theme instead of weak context fragments", () => {
    const timeZoneRequest = DeckRequestSchema.parse({
      eventContext: "Local browser verification night",
      audience: "",
      theme: "Time Zones",
      themeDescription: "Humanity most passive aggressive invention",
      tone: "polished",
      slideCount: 8,
    });
    const partialDeck = createFallbackDeck(timeZoneRequest, "time-zone-seed");
    const labels = partialDeck.slides.flatMap((slide) => slide.visualData?.labels || []);
    const headings = partialDeck.slides.map((slide) => slide.heading);
    const allLabels = labels.join(" ");

    expect(allLabels).toContain("Time Zones");
    expect(labels.filter((label) => /Time|Zones/i.test(label)).length).toBeGreaterThan(12);
    expect(allLabels).not.toMatch(/\b(Most|Passive|Aggressive|Adobe|Humanity|Invention)\b/i);
    expect(headings.every((heading) => !/\s\d+$/.test(heading))).toBe(true);
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
    const firstTypes = first.slides.map((slide) => slide.visualType);
    const secondTypes = second.slides.map((slide) => slide.visualType);
    const changedPositions = firstTypes.filter((type, index) => type !== secondTypes[index]).length;

    expect(changedPositions / firstTypes.length).toBeGreaterThanOrEqual(0.7);
  });

  it("keeps generated fallback decks passing deck quality checks", () => {
    const seed = "quality-seed";
    const plan = planDeckComposition(request, seed);
    const partialDeck = createFallbackDeck(request, seed);
    const issues = evaluateDeckQuality(partialDeck, request, plan);

    expect(issues).toEqual([]);
    expect(partialDeck.slides.some((slide) => slide.visualType === "swimlane" || slide.visualType === "gantt")).toBe(true);
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

  it("registers the extra easy-to-read diagram catalog", () => {
    const newVisualTypes = [
      "donut_progress",
      "lollipop_chart",
      "slope_chart",
      "bubble_map",
      "decision_tree",
      "fishbone",
      "swot_grid",
      "journey_map",
      "calendar_strip",
      "ranking_ladder",
      "traffic_light",
      "sticky_wall",
    ] as const;
    const prompt = buildDeckPrompt(request);

    expect(visualTypes).toEqual(expect.arrayContaining(newVisualTypes));
    expect(newVisualTypes.every((type) => getVisualEntry(type).labelSlots.min >= 3)).toBe(true);
    expect(prompt).toContain("donut_progress");
    expect(prompt).toContain("sticky_wall");
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
    expect(themeOptions.length).toBeGreaterThanOrEqual(180);
    expect(themeCategories.length).toBeGreaterThanOrEqual(9);
    expect(themeOptions.every((option) => option.audiences.length > 0)).toBe(true);
  });
});
