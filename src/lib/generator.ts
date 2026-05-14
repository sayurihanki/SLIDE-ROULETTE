import {
  DeckRequest,
  DeckSchema,
  KaraokeDeck,
  KaraokeSlide,
  SlideSchema,
  VisualData,
  VisualType,
  completeDeck,
  deckGenerationJsonSchema,
  visualTypes,
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

export function buildDeckPrompt(request: DeckRequest): string {
  const jokes = request.insideJokes
    ? `Optional inside-joke ingredients to use lightly: ${request.insideJokes}.`
    : "No inside jokes were provided.";

  return [
    "Create an original PowerPoint Karaoke deck for an in-person host.",
    `Event context: ${request.eventContext}.`,
    `Audience: ${request.audience}.`,
    `Theme: ${request.theme}.`,
    request.themeDescription ? `Theme angle: ${request.themeDescription}.` : "No curated theme angle was provided.",
    `Tone: ${request.tone}.`,
    `Slide count: exactly ${request.slideCount}.`,
    jokes,
    "The presenter has not seen the slides and must improvise.",
    "Make every slide readable on a projector: one big idea, short headings, at most three concise bullets.",
    "Keep it work-safe, inclusive, and broadly understandable.",
    "Avoid real private people, protected brand claims, politics, explicit material, slurs, medical/legal/financial advice, and dense charts.",
    "Use playful business-slide formats: suspicious charts, faux frameworks, bold quotes, questionable roadmaps, and harmless absurdity.",
    `Choose varied visualType values across the deck from: ${visualTypes.join(", ")}.`,
    `Map familiar diagram names onto those types, such as: ${Object.values(visualAliases).flat().join(", ")}.`,
    "For visualData, write a short title, 2-8 concise labels, 0-8 numeric values from 0 to 100 when useful, and 0-4 short notes.",
    "speakerHidden is for the host only and must not be required to understand the slide.",
    "Return only JSON that matches the provided schema.",
  ].join("\n");
}

export async function generateDeck(request: DeckRequest): Promise<KaraokeDeck> {
  const openAiDeck = await tryOpenAiDeck(request);

  if (openAiDeck) {
    return completeDeck(openAiDeck, request, "openai");
  }

  return completeDeck(createFallbackDeck(request), request, "fallback");
}

async function tryOpenAiDeck(request: DeckRequest): Promise<GeneratedDeckShape | null> {
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
            content: buildDeckPrompt(request),
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

export function createFallbackDeck(request: DeckRequest): GeneratedDeckShape {
  const count = request.slideCount;
  const title = `${titleCase(request.theme)}: A Totally Prepared Briefing`;
  const rawJokes = request.insideJokes
    .split(/[,.\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const slides = Array.from({ length: count }, (_, index) => {
    const slideNumber = index + 1;
    const palette = fallbackPalettes[index % fallbackPalettes.length];
    const joke = rawJokes[index % Math.max(rawJokes.length, 1)];
    const visualType = fallbackVisualTypes[index % fallbackVisualTypes.length];

    return {
      id: `fallback-${slideNumber}`,
      kind: slideKinds[index],
      kicker: fallbackKicker(index, request),
      heading: fallbackHeading(index, request, joke),
      points: fallbackPoints(index, request, joke),
      visualLabel: fallbackVisual(visualType, index),
      visualType,
      visualData: fallbackVisualData(visualType, index, request, joke),
      visualPrompt: `${fallbackVisual(visualType, index)} about ${request.theme} for ${request.audience}`,
      speakerHidden: `Host note: invite the presenter to justify this slide as if it were completely intentional.`,
      palette,
    } satisfies KaraokeSlide;
  });

  return { title, slides };
}

function fallbackKicker(index: number, request: DeckRequest): string {
  const options = [
    "Executive Summary",
    "Key Finding",
    "Methodology",
    "Market Signal",
    "Unexpected Risk",
    "Final Recommendation",
  ];

  return options[index % options.length] || titleCase(request.tone);
}

function fallbackHeading(index: number, request: DeckRequest, joke?: string): string {
  const theme = titleCase(request.theme);
  const headings = [
    `${theme} was always a people problem`,
    `The data points to more dramatic entrances`,
    `Our roadmap begins with one confident rectangle`,
    `This room is entering its alignment era`,
    `A small process change unlocks heroic nonsense`,
    `The recommendation is simple: commit to the bit`,
  ];

  if (joke && index % 3 === 2) {
    return `${titleCase(joke)} is now a strategic pillar`;
  }

  return headings[index % headings.length];
}

function fallbackPoints(index: number, request: DeckRequest, joke?: string): string[] {
  const sets = [
    ["One metric improved for reasons we will invent", "Stakeholders described the shape as promising"],
    ["Phase one: confidence", "Phase two: a chart", "Phase three: applause"],
    ["No one remembers approving this", "Everyone agrees it looks official"],
    [`Designed for ${request.eventContext.slice(0, 46)}`, "Calibrated for maximum projector readability"],
    ["Low risk", "High commitment", "Moderate use of dramatic pauses"],
  ];

  if (joke && index % 4 === 1) {
    return [`Includes ${joke}`, "Presented as if this was in the plan all along"];
  }

  return sets[index % sets.length];
}

function fallbackVisual(visualType: VisualType, index: number): string {
  const labels: Record<VisualType, string[]> = {
    venn: ["Overlap diagram", "Consensus Venn"],
    comparison_table: ["Feature matrix", "Pros and cons"],
    before_after: ["Before vs after", "Current to future"],
    quadrant: ["Consensus quadrant", "Priority map"],
    flowchart: ["Decision flow", "SOP flow"],
    funnel: ["Conversion funnel", "Pipeline diagram"],
    cycle: ["Feedback loop", "Flywheel"],
    timeline: ["Roadmap", "Milestone timeline"],
    hierarchy: ["Role hierarchy", "Taxonomy tree"],
    pyramid: ["Tier pyramid", "Capability stack"],
    network: ["Ecosystem map", "Dependency map"],
    dashboard: ["KPI dashboard", "Scorecard"],
    radar: ["Spider diagram", "Capability radar"],
    heat_matrix: ["Risk heatmap", "Correlation matrix"],
    canvas: ["Strategy canvas", "Operating model"],
    bento: ["Bento layout", "Modular grid"],
    isometric: ["Isometric blocks", "Layer stack"],
  };

  const options = labels[visualType];
  return options[index % options.length];
}

function fallbackVisualData(
  visualType: VisualType,
  index: number,
  request: DeckRequest,
  joke?: string,
): VisualData {
  const theme = titleCase(request.theme);
  const labels = fallbackLabels(index, theme, joke);
  const values = fallbackValues(index);

  const shared = {
    title: fallbackVisual(visualType, index),
    labels,
    values,
    notes: [
      request.tone === "academic" ? "Peer-reviewed vibes" : "Looks official",
      joke ? clip(`Includes ${joke}`, 48) : "No one asked why",
    ],
  };

  switch (visualType) {
    case "venn":
      return { ...shared, labels: labels.slice(0, 3), values: [62, 58, 34] };
    case "comparison_table":
      return { ...shared, labels: ["Old plan", "New plan", "Confidence", "Snacks"], values: [42, 81, 73, 66] };
    case "before_after":
      return { ...shared, labels: ["Before", "After", clip(theme, 42)], values: [32, 84] };
    case "quadrant":
      return { ...shared, labels: ["Urgent", "Useful", "Loud", "Mysterious"], values: [68, 78, 36, 52] };
    case "flowchart":
      return { ...shared, labels: ["Idea", "Committee", "Chart", "Applause"], values: [] };
    case "funnel":
      return { ...shared, labels: ["Awareness", "Debate", "Alignment", "Budget"], values: [100, 74, 48, 28] };
    case "cycle":
      return { ...shared, labels: ["Notice", "Explain", "Rebrand", "Repeat"], values: [] };
    case "timeline":
      return { ...shared, labels: ["Now", "Soon", "Later", "Legend"], values: [20, 45, 70, 92] };
    case "hierarchy":
      return { ...shared, labels: ["Executive Snack", "Task Force", "Pilot Team", "Committee"], values: [] };
    case "pyramid":
      return { ...shared, labels: ["Proof", "Process", "Belief", "Applause"], values: [25, 45, 70, 100] };
    case "network":
      return { ...shared, labels: ["Host", "Presenter", "Audience", "Mystery Metric", clip(theme, 42)], values: [] };
    case "dashboard":
      return { ...shared, labels: ["Confidence", "Momentum", "Alignment", "Drama"], values: [87, 64, 72, 91] };
    case "radar":
      return { ...shared, labels: ["Speed", "Logic", "Charm", "Risk", "Snacks"], values: [78, 43, 91, 56, 69] };
    case "heat_matrix":
      return { ...shared, labels: ["Low", "Medium", "High", "Heroic"], values: [18, 42, 75, 91, 55, 24, 68, 83] };
    case "canvas":
      return { ...shared, labels: ["Audience", "Promise", "Metric", "Risk", "Next move", clip(theme, 42)], values: [] };
    case "bento":
      return { ...shared, labels: ["Signal", "Story", "Proof", "Action", clip(theme, 42)], values: [74, 66, 48, 82, 57] };
    case "isometric":
      return { ...shared, labels: ["Foundation", "Layer two", "Platform", "Sparkle"], values: [26, 48, 72, 91] };
  }
}

function fallbackLabels(index: number, theme: string, joke?: string): string[] {
  const sets = [
    [clip(theme, 42), "Confidence", "Budget", "Momentum"],
    ["Research", "Consensus", "Pilot", "Scale"],
    ["Useful", "Loud", "Possible", "Suspicious"],
    ["Team", "Process", "Story", clip(joke || "Mystery", 42)],
  ];

  return sets[index % sets.length];
}

function fallbackValues(index: number): number[] {
  const sets = [
    [78, 56, 84, 39],
    [42, 67, 91, 74],
    [24, 48, 72, 96],
    [88, 61, 47, 75],
  ];

  return sets[index % sets.length];
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
