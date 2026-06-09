import {
  DeckRequest,
  DeckGenerationSchema,
  DeckRequestSchema,
  DeckSchema,
  KaraokeDeck,
  KaraokeSlide,
  SlideSchema,
  VisualType,
  completeDeck,
  deckGenerationJsonSchema,
  visualTypes,
} from "@/lib/deck";
import { planDeckComposition, SlideCompositionSpec } from "@/lib/composition-planner";
import { evaluateDeckQuality } from "@/lib/deck-quality";
import { buildFallbackVisualData } from "@/lib/fallback-visuals";
import { buildKeywordBank, clip, parseJokes, significantWords, titleCase } from "@/lib/keyword-bank";
import { pick, rotate, seededRandom, shuffle } from "@/lib/random";
import { getVisualEntry, visualAliases } from "@/lib/visual-registry";

type GeneratedDeckShape = Pick<KaraokeDeck, "title" | "slides">;

const fallbackPalettes: KaraokeSlide["palette"][] = [
  { paper: "#fff4dc", accentA: "#ef6b4f", accentB: "#65a7c8", strong: "#0f7b78" },
  { paper: "#eaf6f4", accentA: "#f5bd2f", accentB: "#ef6b4f", strong: "#075956" },
  { paper: "#f7edf4", accentA: "#6e5bc7", accentB: "#f5bd2f", strong: "#513f9e" },
  { paper: "#edf3fb", accentA: "#65a7c8", accentB: "#ef6b4f", strong: "#245b74" },
];

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

export type DeckPromptOptions = {
  tweak?: "safer" | "sillier" | "shorter";
  replaceSlideIndex?: number;
  deckTitle?: string;
  neighborHeadings?: string[];
  singleSlide?: boolean;
  compositionPlan?: SlideCompositionSpec[];
};

export function applyDeckTweak(
  request: DeckRequest,
  tweak: "safer" | "sillier" | "shorter",
): DeckRequest {
  if (tweak === "shorter") {
    return {
      ...request,
      slideCount: Math.max(5, request.slideCount - 1),
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
  const compositionPlan =
    options?.compositionPlan ||
    planDeckComposition({ ...request, slideCount }, `prompt:${request.theme}:${slideCount}`);
  const planLines = compositionPlan
    .slice(0, slideCount)
    .map((spec) => {
      const entry = getVisualEntry(spec.visualType);
      return `${spec.index + 1}. kind=${spec.kind}; visualType=${spec.visualType}; visualVariant=${spec.visualVariant}; role=${spec.narrativeRole}; labels=${entry.labelSlots.min}-${entry.labelSlots.max}; values=${entry.labelSlots.values ? "use numeric values" : "values optional"}; why=${spec.affinityNotes}`;
    })
    .join("\n");
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
  const wordlessLine = request.noWords
    ? "Simple mode: visible slides keep the same layout with one short heading and short diagram labels. Bullets, captions, quote attribution, and extra callouts are hidden on the slide, so use 4-8 word headings and 1-3 word labels while still filling all text fields for review, host cues, accessibility, and regeneration."
    : "Normal mode: make the copy theme-coherent, but avoid repeating the exact same theme phrase on every slide.";

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
    wordlessLine,
    jokes,
    replaceLine,
    tweakLine,
    "The presenter has not seen the slides and must improvise.",
    "Shape the deck as a fake briefing arc: opening thesis, escalating odd evidence, one crisis slide, a suspicious chart, then a bold recommendation.",
    "Follow this slide plan exactly for kind, visualType, and visualVariant. Fill only the copy and visualData content:",
    planLines,
    "Do not repeat the same visualType on consecutive slides.",
    "Make every slide readable on a projector: one big idea, short headings, at most three concise bullets.",
    "Keep it work-safe, inclusive, and broadly understandable.",
    "Avoid real private people, protected brand claims, politics, explicit material, slurs, medical/legal/financial advice, and dense charts.",
    "Use playful business-slide formats: suspicious charts, faux frameworks, bold quotes, questionable roadmaps, and harmless absurdity.",
    `Valid visualType values are: ${visualTypes.join(", ")}.`,
    `Map familiar diagram names onto those types, such as: ${Object.values(visualAliases).flat().join(", ")}.`,
    "For visualData, write a short title, labels that match each planned slot count, numeric values from 0 to 100 only when useful, and 0-4 short notes.",
    "Labels must name concrete entities from the theme or event. Do not use generic labels like Signal, Proof, Risk, Phase one, or Outcome.",
    "Do not reuse the same visible phrase across multiple headings, labels, or bullets unless the deck is intentionally calling back to it.",
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
  const seed = crypto.randomUUID();
  const compositionPlan = planDeckComposition(request, seed);
  const openAiDeck = await tryOpenAiDeck(request, { ...options, compositionPlan });

  if (openAiDeck) {
    return completeDeck(repairDeckWithFallback(openAiDeck, request, compositionPlan, seed), request, "openai");
  }

  return completeDeck(createFallbackDeck(request, seed), request, "fallback");
}

export async function regenerateDeck(
  deck: KaraokeDeck,
  tweak?: "safer" | "sillier" | "shorter",
): Promise<KaraokeDeck> {
  const generation =
    deck.generation ||
    DeckGenerationSchema.parse({
      eventContext: "Live event remix",
      audience: deck.audience,
      theme: deck.theme,
      themeDescription: "",
      tone: deck.tone,
      slideCount: deck.slides.length,
      insideJokes: "",
    });
  const baseRequest = DeckRequestSchema.parse({
    ...generation,
    slideCount: Math.min(10, Math.max(5, generation.slideCount)),
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
  const seed = crypto.randomUUID();
  const compositionPlan = planDeckComposition({ ...request, slideCount: 1 }, seed);
  const openAiDeck = await tryOpenAiDeck(request, {
    ...options,
    singleSlide: true,
    compositionPlan,
  });

  if (openAiDeck?.slides[0]) {
    const repaired = repairDeckWithFallback(openAiDeck, { ...request, slideCount: 1 }, compositionPlan, seed);
    return SlideSchema.parse({ ...repaired.slides[0], id: `generated-${options.replaceSlideIndex ?? 0}` });
  }

  const fallback = createFallbackDeck({ ...request, slideCount: 1 }, seed);
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
      SlideSchema.parse({
        ...slide,
        kind: options?.compositionPlan?.[index]?.kind || slide.kind,
        visualType: options?.compositionPlan?.[index]?.visualType || slide.visualType,
        visualVariant: options?.compositionPlan?.[index]?.visualVariant || slide.visualVariant,
        id: `generated-${index + 1}`,
      }),
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
  const compositionPlan = planDeckComposition(request, seed);
  const paletteOrder = shuffle([...fallbackPalettes], random);
  const usedHeadings = new Set<string>();
  const usedVisualLabels = new Set<string>();
  const titleStyle = pick(["Briefing", "Field Report", "Operating Model", "Forecast"], random);
  const title = `${titleCase(request.theme)}: A Totally Prepared ${titleStyle}`;

  const slides = compositionPlan.map((spec, index) => {
    const visualType = spec.visualType;
    const slideKeywords = rotate(keywords, index);
    const visualLabel = uniqueText(
      fallbackVisual(spec, index, slideKeywords, random),
      usedVisualLabels,
      index,
      64,
    );
    const visualData = buildFallbackVisualData(spec, request, slideKeywords, visualLabel, random);

    return {
      id: `fallback-${index + 1}`,
      kind: spec.kind,
      kicker: fallbackKicker(spec, index, slideKeywords, random),
      heading: uniqueText(fallbackHeading(spec, index, request, slideKeywords, random), usedHeadings, index, 92),
      points: fallbackPoints(spec, request, slideKeywords, random),
      visualLabel,
      visualType,
      visualVariant: spec.visualVariant,
      visualData,
      visualPrompt: `${visualLabel} about ${request.theme} using ${slideKeywords.slice(0, 3).join(", ")}`,
      speakerHidden: fallbackSpeakerHidden(spec, request, slideKeywords, random),
      palette: paletteOrder[index % paletteOrder.length],
    } satisfies KaraokeSlide;
  });

  return repairDeckWithFallback({ title, slides }, request, compositionPlan, seed);
}

function fallbackKicker(
  spec: SlideCompositionSpec,
  index: number,
  keywords: string[],
  random: () => number,
): string {
  const visualType = spec.visualType;
  const options = [
    `${keywords[0]} Signal`,
    `${visualTypeLabel(visualType)} Evidence`,
    `${titleCase(spec.narrativeRole)} Brief`,
    `${keywords[1]} ${spec.narrativeRole}`,
    `${pick(motionWords, random)} Review`,
    `${keywords[2]} Model`,
    `${visualTypeLabel(visualType)} Snapshot`,
  ];

  return clip(pick(options, random), 42);
}

function fallbackHeading(
  spec: SlideCompositionSpec,
  index: number,
  request: DeckRequest,
  keywords: string[],
  random: () => number,
): string {
  const theme = titleCase(request.theme);
  const concepts = significantWords(request.theme);
  const primary = concepts[index % concepts.length] || keywords[0];
  const secondary = concepts[(index + 1) % concepts.length] || keywords[1];
  const format = visualTypeLabel(spec.visualType).toLowerCase();
  const simplePatterns: Record<SlideCompositionSpec["narrativeRole"], string[]> = {
    opening: [`${primary} needs a map`, `${secondary} has a plan`],
    context: [`${primary} explains the room`, `${secondary} sets the stage`],
    evidence: [`${keywords[2]} has receipts`, `${primary} looks measurable`],
    comparison: [`${primary} beats ${secondary}`, `${secondary} changes the math`],
    friction: [`${secondary} creates drag`, `${primary} hits friction`],
    crisis: [`${primary} enters crisis mode`, `${keywords[6]} raises the alarm`],
    process: [`${primary} follows the arrows`, `${secondary} runs the loop`],
    forecast: [`${secondary} is next`, `${primary} moves by Friday`],
    recommendation: [`Choose the practical chaos`, `${keywords[2]} gets approved`],
    closing: [`${primary} was the answer`, `${secondary} gets the roadmap`],
  };

  if (request.noWords) {
    return clip(pick(simplePatterns[spec.narrativeRole], random), 56);
  }

  const rolePatterns: Record<SlideCompositionSpec["narrativeRole"], string[]> = {
    opening: [`${theme} gets one surprisingly defensible thesis`, `${primary} becomes the official starting point`],
    context: [`The room underestimated the ${secondary.toLowerCase()} layer`, `${primary} context gets stranger at slide speed`],
    evidence: [`${keywords[2]} produces just enough evidence`, `The ${format} makes ${primary.toLowerCase()} look measurable`],
    comparison: [`${primary} beats ${secondary.toLowerCase()} by committee logic`, `The tradeoff turns on ${keywords[4].toLowerCase()}`],
    friction: [`${secondary} creates a very presentable problem`, `Nobody budgeted for the ${keywords[5].toLowerCase()} variable`],
    crisis: [`${primary} enters the crisis quadrant with confidence`, `${keywords[6]} changed the risk profile overnight`],
    process: [`The process now routes through ${secondary.toLowerCase()}`, `${primary} becomes a repeatable operating ritual`],
    forecast: [`The forecast points directly at ${keywords[8].toLowerCase()}`, `${secondary} is scheduled to become next week's problem`],
    recommendation: [`The recommendation is bold and mostly laminated`, `${keywords[2]} is the safest-looking next move`],
    closing: [`The final answer was ${primary.toLowerCase()} all along`, `${secondary} leaves the room with a roadmap`],
  };
  const options = rolePatterns[spec.narrativeRole];

  if (request.insideJokes && index % 3 === 1) {
    return clip(`${titleCase(parseJokes(request)[0] || keywords[0])} has entered the ${format}`, 92);
  }

  return clip(pick(options, random), 92);
}

function fallbackPoints(
  spec: SlideCompositionSpec,
  request: DeckRequest,
  keywords: string[],
  random: () => number,
): string[] {
  const eventWord = clip(request.eventContext, 42);
  const options: Record<SlideCompositionSpec["narrativeRole"], string[][]> = {
    opening: [[`${keywords[0]} frames the whole room`, `Designed for ${eventWord}`]],
    context: [[`${keywords[1]} explains the setup`, `${keywords[2]} keeps the backstory moving`]],
    evidence: [[`${keywords[0]} is measurable if nobody asks follow-ups`, `${keywords[3]} unlocks the next metric`]],
    comparison: [[`${keywords[2]} wins on vibes`, `${keywords[4]} wins on paperwork`]],
    friction: [[`The risk is ${keywords[5].toLowerCase()}`, `The upside is ${keywords[6].toLowerCase()}`]],
    crisis: [[`${keywords[3]} now requires a mitigation slide`, `${keywords[7]} remains technically under control`]],
    process: [[`First route through ${keywords[1].toLowerCase()}`, `Then let ${keywords[4].toLowerCase()} pretend it was planned`]],
    forecast: [[`${keywords[0]} peaks before anyone is ready`, `${keywords[2]} becomes next week's agenda`]],
    recommendation: [[`Approve the ${keywords[3].toLowerCase()} pilot`, `Name ${keywords[5].toLowerCase()} as the success metric`]],
    closing: [[`Audience impact: ${request.audience}`, `${keywords[7]} remains the official explanation`]],
  };

  return pick(options[spec.narrativeRole], random).map((point) => clip(point, 88));
}

function fallbackVisual(
  spec: SlideCompositionSpec,
  index: number,
  keywords: string[],
  random: () => number,
): string {
  const visualType = spec.visualType;
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
    swimlane: [`${keywords[0]} Swimlane`, `${keywords[1]} Handoff Map`],
    sankey: [`${keywords[0]} Allocation Flow`, `${keywords[1]} Sankey`],
    gauge_row: [`${keywords[0]} Gauge Row`, `${keywords[1]} Readiness Meters`],
    stacked_bar: [`${keywords[0]} Stacked Bar`, `${keywords[1]} Share Breakdown`],
    pie_callout: [`${keywords[0]} Pie Callout`, `${keywords[1]} Slice Report`],
    scatter_plot: [`${keywords[0]} Scatter Plot`, `${keywords[1]} Outlier Map`],
    waterfall: [`${keywords[0]} Waterfall`, `${keywords[1]} Delta Bridge`],
    gantt: [`${keywords[0]} Gantt`, `${keywords[1]} Project Schedule`],
    donut_progress: [`${keywords[0]} Donut Progress`, `${keywords[1]} Completion Rings`],
    lollipop_chart: [`${keywords[0]} Lollipop Chart`, `${keywords[1]} Dot Ranking`],
    slope_chart: [`${keywords[0]} Slope Chart`, `${keywords[1]} Change Lines`],
    bubble_map: [`${keywords[0]} Bubble Map`, `${keywords[1]} Cluster Field`],
    decision_tree: [`${keywords[0]} Decision Tree`, `${keywords[1]} Branch Logic`],
    fishbone: [`${keywords[0]} Fishbone`, `${keywords[1]} Root Cause Map`],
    swot_grid: [`${keywords[0]} SWOT Grid`, `${keywords[1]} Strategy Grid`],
    journey_map: [`${keywords[0]} Journey Map`, `${keywords[1]} Experience Path`],
    calendar_strip: [`${keywords[0]} Calendar Strip`, `${keywords[1]} Week View`],
    ranking_ladder: [`${keywords[0]} Ranking Ladder`, `${keywords[1]} Priority Steps`],
    traffic_light: [`${keywords[0]} Traffic Light`, `${keywords[1]} Status Signal`],
    sticky_wall: [`${keywords[0]} Sticky Wall`, `${keywords[1]} Idea Board`],
  };

  return labels[visualType][index % labels[visualType].length];
}

function fallbackSpeakerHidden(
  spec: SlideCompositionSpec,
  request: DeckRequest,
  keywords: string[],
  random: () => number,
): string {
  const cues = [
    `Ask the room which part of ${keywords[0]} deserves a budget.`,
    `Pause after naming ${keywords[1]} like it was obvious all along.`,
    `Invite one brave defense of ${keywords[2]} before moving on.`,
    `Callback ${request.eventContext} if the slide needs a rescue line.`,
    `Treat the ${visualTypeLabel(spec.visualType).toLowerCase()} as extremely official.`,
  ];

  return clip(pick(cues, random), 220);
}

function visualTypeLabel(visualType: VisualType): string {
  return visualType
    .split("_")
    .map(titleCase)
    .join(" ");
}

function uniqueText(value: string, used: Set<string>, index: number, length: number): string {
  let candidate = clip(value, length);
  if (used.has(candidate)) {
    const suffixes = [
      "under pressure",
      "in the wild",
      "with receipts",
      "for the next phase",
      "against all forecasts",
    ];
    candidate = clip(`${candidate}, ${suffixes[index % suffixes.length]}`, length);
  }
  used.add(candidate);
  return candidate;
}

function repairDeckWithFallback(
  deck: GeneratedDeckShape,
  request: DeckRequest,
  compositionPlan: SlideCompositionSpec[],
  seed: string,
): GeneratedDeckShape {
  const issues = evaluateDeckQuality(deck, request, compositionPlan);

  if (issues.length === 0) {
    return deck;
  }

  const fallback = createFallbackDeckWithoutRepair(request, seed, compositionPlan);
  const issueIndexes = new Set(issues.map((issue) => issue.slideIndex));

  return {
    ...deck,
    slides: deck.slides.map((slide, index) =>
      issueIndexes.has(index) ? { ...fallback.slides[index], id: slide.id } : slide,
    ),
  };
}

function createFallbackDeckWithoutRepair(
  request: DeckRequest,
  seed: string,
  compositionPlan: SlideCompositionSpec[],
): GeneratedDeckShape {
  const random = seededRandom(seed);
  const keywords = buildKeywordBank(request);
  const paletteOrder = shuffle([...fallbackPalettes], random);
  const usedHeadings = new Set<string>();
  const usedVisualLabels = new Set<string>();
  const titleStyle = pick(["Briefing", "Field Report", "Operating Model", "Forecast"], random);
  const title = `${titleCase(request.theme)}: A Totally Prepared ${titleStyle}`;
  const slides = compositionPlan.map((spec, index) => {
    const slideKeywords = rotate(keywords, index);
    const visualLabel = uniqueText(fallbackVisual(spec, index, slideKeywords, random), usedVisualLabels, index, 64);
    return {
      id: `fallback-${index + 1}`,
      kind: spec.kind,
      kicker: fallbackKicker(spec, index, slideKeywords, random),
      heading: uniqueText(fallbackHeading(spec, index, request, slideKeywords, random), usedHeadings, index, 92),
      points: fallbackPoints(spec, request, slideKeywords, random),
      visualLabel,
      visualType: spec.visualType,
      visualVariant: spec.visualVariant,
      visualData: buildFallbackVisualData(spec, request, slideKeywords, visualLabel, random),
      visualPrompt: `${visualLabel} about ${request.theme} using ${slideKeywords.slice(0, 3).join(", ")}`,
      speakerHidden: fallbackSpeakerHidden(spec, request, slideKeywords, random),
      palette: paletteOrder[index % paletteOrder.length],
    } satisfies KaraokeSlide;
  });

  return { title, slides };
}
