import {
  DeckRequest,
  DeckRequestSchema,
  DeckSchema,
  KaraokeDeck,
  KaraokeSlide,
  SlideSchema,
  VisualData,
  VisualType,
  completeDeck,
  deckGenerationJsonSchema,
  visualTypes,
  visualVariants,
} from "@/lib/deck";

type GeneratedDeckShape = Pick<KaraokeDeck, "title" | "slides">;

const fallbackPalettes: KaraokeSlide["palette"][] = [
  { paper: "#fff4dc", accentA: "#ef6b4f", accentB: "#65a7c8", strong: "#0f7b78" },
  { paper: "#eaf6f4", accentA: "#f5bd2f", accentB: "#ef6b4f", strong: "#075956" },
  { paper: "#f7edf4", accentA: "#6e5bc7", accentB: "#f5bd2f", strong: "#513f9e" },
  { paper: "#edf3fb", accentA: "#65a7c8", accentB: "#ef6b4f", strong: "#245b74" },
];

const slideKinds: KaraokeSlide["kind"][] = [
  "title",
  "chart",
  "quote",
  "diagram",
  "wildcard",
  "chart",
  "quote",
  "diagram",
  "wildcard",
  "chart",
  "quote",
  "diagram",
];

const fallbackVisualTypes: VisualType[] = [
  "venn",
  "comparison_table",
  "before_after",
  "quadrant",
  "flowchart",
  "funnel",
  "cycle",
  "timeline",
  "hierarchy",
  "pyramid",
  "network",
  "dashboard",
  "radar",
  "heat_matrix",
  "canvas",
  "bento",
  "isometric",
];

const fillerWords = new Set([
  "about",
  "after",
  "audience",
  "committee",
  "company",
  "deck",
  "event",
  "friend",
  "friends",
  "general",
  "local",
  "night",
  "party",
  "people",
  "presentation",
  "strategy",
  "team",
  "the",
  "this",
  "with",
  "work",
]);

const motionWords = [
  "Signals",
  "Tradeoffs",
  "Tension",
  "Momentum",
  "Evidence",
  "Rumors",
  "Constraints",
  "Escalation",
  "Delight",
  "Risk",
  "Timing",
  "Proof",
];

const visualNouns = [
  "Loop",
  "Map",
  "Index",
  "Stack",
  "Model",
  "Matrix",
  "Forecast",
  "Protocol",
  "Grid",
  "Circuit",
  "Ledger",
  "Blueprint",
];

const visualAliases: Record<VisualType, string[]> = {
  venn: ["venn diagram", "euler diagram", "overlap diagram"],
  comparison_table: ["comparison table", "pros and cons", "feature matrix"],
  before_after: ["before vs after", "current state vs future state"],
  quadrant: ["quadrant chart", "perceptual map", "impact vs effort matrix"],
  flowchart: ["flowchart", "workflow", "decision flow", "user flow"],
  funnel: ["sales funnel", "pipeline", "conversion funnel"],
  cycle: ["cycle diagram", "feedback loop", "flywheel"],
  timeline: ["timeline", "roadmap", "milestone timeline", "release schedule"],
  hierarchy: ["org chart", "tree diagram", "taxonomy", "decision tree"],
  pyramid: ["pyramid", "tier diagram", "layer cake", "capability stack"],
  network: ["network diagram", "ecosystem map", "system architecture"],
  dashboard: ["kpi dashboard", "scorecard", "gauge chart", "bullet chart"],
  radar: ["radar chart", "spider diagram", "capability radar"],
  heat_matrix: ["heatmap", "risk matrix", "correlation matrix"],
  canvas: ["lean canvas", "business model canvas", "strategy map"],
  bento: ["bento grid", "modular layout", "floating ui panels"],
  isometric: ["isometric blocks", "architecture layers", "stack diagram"],
};

export type DeckPromptOptions = {
  tweak?: "safer" | "sillier" | "shorter";
  replaceSlideIndex?: number;
  deckTitle?: string;
  neighborHeadings?: string[];
  singleSlide?: boolean;
};

export function applyDeckTweak(
  request: DeckRequest,
  tweak: "safer" | "sillier" | "shorter",
): DeckRequest {
  if (tweak === "shorter") {
    return {
      ...request,
      slideCount: Math.max(6, request.slideCount - 1),
    };
  }

  if (tweak === "sillier") {
    return {
      ...request,
      tone: request.tone === "academic" ? "silly" : request.tone === "polished" ? "chaotic" : request.tone,
    };
  }

  return request;
}

export function buildDeckPrompt(request: DeckRequest, options?: DeckPromptOptions): string {
  const jokes = request.insideJokes
    ? `Optional inside-joke ingredients to use lightly: ${request.insideJokes}.`
    : "No inside jokes were provided.";
  const slideCount = options?.singleSlide ? 1 : request.slideCount;
  const tweakLine =
    options?.tweak === "safer"
      ? "Extra constraint: keep every joke broad, inclusive, and workplace-safe. No edgy punchlines."
      : options?.tweak === "sillier"
        ? "Extra constraint: lean into absurd business jargon, fake confidence, and playful nonsense."
        : options?.tweak === "shorter"
          ? "Extra constraint: make bullets even shorter and punchier for a faster round."
          : null;
  const replaceLine =
    typeof options?.replaceSlideIndex === "number"
      ? `Generate exactly 1 replacement slide for position ${options.replaceSlideIndex + 1} in deck "${options.deckTitle || request.theme}". Neighbor headings: ${(options.neighborHeadings || []).join(" | ") || "none"}.`
      : null;

  return [
    options?.singleSlide
      ? "Create exactly one replacement slide for an existing PowerPoint Karaoke deck."
      : "Create an original PowerPoint Karaoke deck for an in-person host.",
    `Event context: ${request.eventContext}.`,
    `Audience: ${request.audience}.`,
    `Theme: ${request.theme}.`,
    request.themeDescription ? `Theme angle: ${request.themeDescription}.` : "No curated theme angle was provided.",
    `Tone: ${request.tone}.`,
    `Slide count: exactly ${slideCount}.`,
    jokes,
    replaceLine,
    tweakLine,
    "The presenter has not seen the slides and must improvise.",
    "Shape the deck as a fake briefing arc: opening thesis, escalating odd evidence, one crisis slide, a suspicious chart, then a bold recommendation.",
    "Do not repeat the same visualType on consecutive slides.",
    "Vary slide kind across title, chart, quote, diagram, and wildcard.",
    "Make every slide readable on a projector: one big idea, short headings, at most three concise bullets.",
    "Keep it work-safe, inclusive, and broadly understandable.",
    "Avoid real private people, protected brand claims, politics, explicit material, slurs, medical/legal/financial advice, and dense charts.",
    "Use playful business-slide formats: suspicious charts, faux frameworks, bold quotes, questionable roadmaps, and harmless absurdity.",
    `Choose varied visualType values across the deck from: ${visualTypes.join(", ")}.`,
    `Map familiar diagram names onto those types, such as: ${Object.values(visualAliases).flat().join(", ")}.`,
    "For visualData, write a short title, 2-8 concise labels, 0-8 numeric values from 0 to 100 when useful, and 0-4 short notes.",
    "speakerHidden is for the host only and must not be required to understand the slide. Give actionable host cues like callbacks, pacing, or audience prompts.",
    "Return only JSON that matches the provided schema.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateDeck(
  request: DeckRequest,
  options?: DeckPromptOptions,
): Promise<KaraokeDeck> {
  const openAiDeck = await tryOpenAiDeck(request, options);

  if (openAiDeck) {
    return completeDeck(openAiDeck, request, "openai");
  }

  return completeDeck(createFallbackDeck(request), request, "fallback");
}

export async function regenerateDeck(
  deck: KaraokeDeck,
  tweak?: "safer" | "sillier" | "shorter",
): Promise<KaraokeDeck> {
  const baseRequest =
    deck.generation ||
    DeckRequestSchema.parse({
      eventContext: "Live event remix",
      audience: deck.audience,
      theme: deck.theme,
      themeDescription: "",
      tone: deck.tone,
      slideCount: deck.slides.length,
      insideJokes: "",
    });

  const request = tweak ? applyDeckTweak(baseRequest, tweak) : baseRequest;
  const generated = await generateDeck(request, { tweak });
  return DeckSchema.parse({
    ...generated,
    id: deck.id,
    createdAt: deck.createdAt,
    generation: request,
  });
}

export async function swapDeckSlide(deck: KaraokeDeck, slideIndex: number): Promise<KaraokeDeck> {
  const request = deck.generation;
  if (!request) {
    return deck;
  }

  const neighborHeadings = [
    deck.slides[slideIndex - 1]?.heading,
    deck.slides[slideIndex + 1]?.heading,
  ].filter(Boolean) as string[];

  const replacement = await generateReplacementSlide(request, {
    replaceSlideIndex: slideIndex,
    deckTitle: deck.title,
    neighborHeadings,
  });

  const slides = deck.slides.map((slide, index) =>
    index === slideIndex ? { ...replacement, id: slide.id } : slide,
  );

  return DeckSchema.parse({
    ...deck,
    slides,
  });
}

export async function generateReplacementSlide(
  request: DeckRequest,
  options: Pick<DeckPromptOptions, "replaceSlideIndex" | "deckTitle" | "neighborHeadings">,
): Promise<KaraokeSlide> {
  const openAiDeck = await tryOpenAiDeck(request, {
    ...options,
    singleSlide: true,
  });

  if (openAiDeck?.slides[0]) {
    return SlideSchema.parse({ ...openAiDeck.slides[0], id: `generated-${options.replaceSlideIndex ?? 0}` });
  }

  const fallback = createFallbackDeck({ ...request, slideCount: 1 });
  return SlideSchema.parse({
    ...fallback.slides[0],
    id: `fallback-${(options.replaceSlideIndex ?? 0) + 1}`,
  });
}

async function tryOpenAiDeck(
  request: DeckRequest,
  options?: DeckPromptOptions,
): Promise<GeneratedDeckShape | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "You create safe, surprising, readable decks for an improv presentation game.",
          },
          {
            role: "user",
            content: buildDeckPrompt(request, options),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "karaoke_deck",
            schema: deckGenerationJsonSchema,
            strict: true,
          },
        },
        max_output_tokens: 3600,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const outputText = extractOutputText(payload);

    if (!outputText) {
      return null;
    }

    const parsed = JSON.parse(outputText) as GeneratedDeckShape;
    const normalizedSlides = parsed.slides.map((slide, index) =>
      SlideSchema.parse({ ...slide, id: `generated-${index + 1}` }),
    );

    return DeckSchema.pick({ title: true, slides: true }).parse({
      title: parsed.title,
      slides: normalizedSlides,
    });
  } catch {
    return null;
  }
}

function extractOutputText(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "output_text" in payload &&
    typeof payload.output_text === "string"
  ) {
    return payload.output_text;
  }

  const output = typeof payload === "object" && payload !== null && "output" in payload
    ? payload.output
    : null;

  if (!Array.isArray(output)) {
    return null;
  }

  for (const item of output) {
    if (typeof item !== "object" || item === null || !("content" in item)) {
      continue;
    }

    const content = item.content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const part of content) {
      if (
        typeof part === "object" &&
        part !== null &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text;
      }
    }
  }

  return null;
}

export function createFallbackDeck(
  request: DeckRequest,
  seed = crypto.randomUUID(),
): GeneratedDeckShape {
  const random = seededRandom(seed);
  const keywords = buildKeywordBank(request);
  const visualOrder = shuffle([...fallbackVisualTypes], random);
  const variantOrder = shuffle([...visualVariants], random);
  const paletteOrder = shuffle([...fallbackPalettes], random);
  const usedHeadings = new Set<string>();
  const usedVisualLabels = new Set<string>();
  const titleStyle = pick(["Briefing", "Field Report", "Operating Model", "Forecast"], random);
  const title = `${titleCase(request.theme)}: A Totally Prepared ${titleStyle}`;

  const slides = Array.from({ length: request.slideCount }, (_, index) => {
    const visualType = visualOrder[index % visualOrder.length];
    const visualVariant = variantOrder[index % variantOrder.length];
    const slideKeywords = rotate(keywords, index);
    const visualLabel = uniqueText(
      fallbackVisual(visualType, index, slideKeywords, random),
      usedVisualLabels,
      index,
      64,
    );
    const visualData = fallbackVisualData(visualType, index, request, slideKeywords, visualLabel, random);

    return {
      id: `fallback-${index + 1}`,
      kind: slideKinds[index],
      kicker: fallbackKicker(index, visualType, slideKeywords, random),
      heading: uniqueText(fallbackHeading(index, request, visualType, slideKeywords, random), usedHeadings, index, 92),
      points: fallbackPoints(index, request, slideKeywords, random),
      visualLabel,
      visualType,
      visualVariant,
      visualData,
      visualPrompt: `${visualLabel} about ${request.theme} using ${slideKeywords.slice(0, 3).join(", ")}`,
      speakerHidden: `Host note: ask why ${slideKeywords[0]} became the obvious turning point.`,
      palette: paletteOrder[index % paletteOrder.length],
    } satisfies KaraokeSlide;
  });

  return { title, slides };
}

function fallbackKicker(
  index: number,
  visualType: VisualType,
  keywords: string[],
  random: () => number,
): string {
  const options = [
    `${keywords[0]} Signal`,
    `${visualTypeLabel(visualType)} Evidence`,
    `${keywords[1]} Forecast`,
    `${pick(motionWords, random)} Review`,
    `Finding ${index + 1}`,
    `${keywords[2]} Model`,
  ];

  return clip(pick(options, random), 42);
}

function fallbackHeading(
  index: number,
  request: DeckRequest,
  visualType: VisualType,
  keywords: string[],
  random: () => number,
): string {
  const theme = titleCase(request.theme);
  const format = visualTypeLabel(visualType).toLowerCase();
  const options = [
    `${theme} depends on ${keywords[0].toLowerCase()}, unfortunately`,
    `${keywords[1]} became the surprise operating principle`,
    `The ${format} confirms our ${keywords[2].toLowerCase()} problem`,
    `${keywords[0]} and ${keywords[3]} are now in productive tension`,
    `A bold new era of ${keywords[1].toLowerCase()} accountability begins`,
    `${keywords[2]} was hiding inside the agenda the whole time`,
  ];

  if (request.insideJokes && index % 3 === 1) {
    return clip(`${titleCase(parseJokes(request)[0] || keywords[0])} has entered the ${format}`, 92);
  }

  return clip(pick(options, random), 92);
}

function fallbackPoints(
  index: number,
  request: DeckRequest,
  keywords: string[],
  random: () => number,
): string[] {
  const eventWord = clip(request.eventContext, 42);
  const options = [
    [`${keywords[0]} is measurable if nobody asks follow-ups`, `${keywords[1]} unlocks the next suspicious metric`],
    [`Designed for ${eventWord}`, `${keywords[2]} keeps the room aligned enough`],
    [`Phase one: ${keywords[0].toLowerCase()}`, `Phase two: ${keywords[1].toLowerCase()}`, `Phase three: applause`],
    [`The risk is ${keywords[2].toLowerCase()}`, `The upside is ${keywords[3].toLowerCase()}`],
    [`Audience impact: ${request.audience}`, `${keywords[0]} remains the official explanation`],
  ];

  return pick(options, random).map((point) => clip(point, 88));
}

function fallbackVisual(
  visualType: VisualType,
  index: number,
  keywords: string[],
  random: () => number,
): string {
  const noun = pick(visualNouns, random);
  const labels: Record<VisualType, string[]> = {
    venn: [`${keywords[0]} Overlap`, `${keywords[1]} Venn`],
    comparison_table: [`${keywords[0]} Tradeoff Table`, `${keywords[1]} Decision Ledger`],
    before_after: [`${keywords[0]} Before/After`, `${keywords[1]} Transformation Map`],
    quadrant: [`${keywords[0]} Quadrant`, `${keywords[1]} Priority Field`],
    flowchart: [`${keywords[0]} Decision Flow`, `${keywords[1]} Escalation Path`],
    funnel: [`${keywords[0]} Funnel`, `${keywords[1]} Conversion Slide`],
    cycle: [`${keywords[0]} Feedback Loop`, `${keywords[1]} Repeat Cycle`],
    timeline: [`${keywords[0]} Timeline`, `${keywords[1]} Roadmap`],
    hierarchy: [`${keywords[0]} Org Stack`, `${keywords[1]} Taxonomy`],
    pyramid: [`${keywords[0]} Pyramid`, `${keywords[1]} Layer Cake`],
    network: [`${keywords[0]} Network`, `${keywords[1]} Ecosystem`],
    dashboard: [`${keywords[0]} Dashboard`, `${keywords[1]} Scorecard`],
    radar: [`${keywords[0]} Radar`, `${keywords[1]} Capability Web`],
    heat_matrix: [`${keywords[0]} Heat Map`, `${keywords[1]} Risk Matrix`],
    canvas: [`${keywords[0]} Canvas`, `${keywords[1]} Operating Model`],
    bento: [`${keywords[0]} Bento`, `${keywords[1]} Modular Grid`],
    isometric: [`${keywords[0]} Isometric ${noun}`, `${keywords[1]} Stack Diagram`],
  };

  return labels[visualType][index % labels[visualType].length];
}

function fallbackVisualData(
  visualType: VisualType,
  index: number,
  request: DeckRequest,
  keywords: string[],
  title: string,
  random: () => number,
): VisualData {
  const values = fallbackValues(random, 8);
  const notes = [
    request.tone === "academic" ? `${keywords[0]} peer-reviewed vibes` : `${keywords[0]} looks official`,
    `${keywords[1]} remains unexplained`,
  ].map((note) => clip(note, 48));

  switch (visualType) {
    case "venn":
      return { title, labels: labelsFor(keywords, ["Belief", "Process", "Snacks"], 3), values: values.slice(0, 3), notes };
    case "comparison_table":
      return { title, labels: labelsFor(keywords, ["Old plan", "New plan", "Proof", "Doubt"], 4), values: values.slice(0, 4), notes };
    case "before_after":
      return { title, labels: ["Before", "After", clip(keywords[0], 42)], values: values.slice(0, 2), notes };
    case "quadrant":
      return { title, labels: labelsFor(keywords, ["Urgent", "Useful", "Loud", "Weird"], 4), values: values.slice(0, 4), notes };
    case "flowchart":
      return { title, labels: labelsFor(keywords, ["Notice", "Debate", "Chart", "Applause"], 4), values: [], notes };
    case "funnel":
      return { title, labels: labelsFor(keywords, ["Awareness", "Suspicion", "Alignment", "Budget"], 4), values: values.slice(0, 4).sort((a, b) => b - a), notes };
    case "cycle":
      return { title, labels: labelsFor(keywords, ["Spot", "Explain", "Rename", "Repeat"], 4), values: [], notes };
    case "timeline":
      return { title, labels: labelsFor(keywords, ["Now", "Soon", "Later", "Legend"], 4), values: values.slice(0, 4).sort((a, b) => a - b), notes };
    case "hierarchy":
      return { title, labels: labelsFor(keywords, ["Sponsor", "Squad", "Pilot", "Committee"], 4), values: [], notes };
    case "pyramid":
      return { title, labels: labelsFor(keywords, ["Proof", "Process", "Belief", "Applause"], 4), values: values.slice(0, 4), notes };
    case "network":
      return { title, labels: labelsFor(keywords, ["Host", "Presenter", "Metric", "Room", "Outcome"], 5), values: [], notes };
    case "dashboard":
      return { title, labels: labelsFor(keywords, ["Confidence", "Momentum", "Drama", "Readiness"], 4), values: values.slice(0, 4), notes };
    case "radar":
      return { title, labels: labelsFor(keywords, ["Speed", "Logic", "Charm", "Risk", "Snack"], 5), values: values.slice(0, 5), notes };
    case "heat_matrix":
      return { title, labels: labelsFor(keywords, ["Low", "Medium", "High", "Heroic"], 4), values: values.slice(0, 8), notes };
    case "canvas":
      return { title, labels: labelsFor(keywords, ["Audience", "Promise", "Metric", "Risk", "Next move", "Proof"], 6), values: [], notes };
    case "bento":
      return { title, labels: labelsFor(keywords, ["Signal", "Story", "Proof", "Action", "Wildcard"], 5), values: values.slice(0, 5), notes };
    case "isometric":
      return { title, labels: labelsFor(keywords, ["Foundation", "Platform", "Spark", "Launch"], 4), values: values.slice(0, 4), notes };
  }
}

function buildKeywordBank(request: DeckRequest): string[] {
  const raw = [
    request.theme,
    request.themeDescription,
    request.eventContext,
    request.audience,
    request.insideJokes,
  ].join(" ");
  const words = raw
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 2 && !fillerWords.has(word));
  const unique = Array.from(new Set(words)).map(titleCase);
  const fallback = ["Signal", "Momentum", "Evidence", "Budget", "Timing", "Applause", "Risk", "Outcome"];

  return [...unique, ...fallback].slice(0, 12);
}

function labelsFor(keywords: string[], fallbacks: string[], count: number): string[] {
  return Array.from({ length: count }, (_, index) =>
    clip(index < keywords.length ? keywords[index] : fallbacks[index % fallbacks.length], 42),
  );
}

function fallbackValues(random: () => number, count: number): number[] {
  return Array.from({ length: count }, () => 18 + Math.floor(random() * 78));
}

function visualTypeLabel(visualType: VisualType): string {
  return visualType
    .split("_")
    .map(titleCase)
    .join(" ");
}

function rotate<T>(items: T[], offset: number): T[] {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function uniqueText(value: string, used: Set<string>, index: number, length: number): string {
  let candidate = clip(value, length);
  if (used.has(candidate)) {
    candidate = clip(`${candidate} ${index + 1}`, length);
  }
  used.add(candidate);
  return candidate;
}

function seededRandom(seed: string): () => number {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function parseJokes(request: DeckRequest): string[] {
  return request.insideJokes
    .split(/[,.\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function clip(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, Math.max(0, length - 3))}...` : value;
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
