import { z } from "zod";

export const tones = [
  "polished",
  "silly",
  "chaotic",
  "academic",
  "retro",
  "deadpan",
] as const;

export const visualTypes = [
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
  "swimlane",
  "sankey",
  "gauge_row",
  "stacked_bar",
  "pie_callout",
  "scatter_plot",
  "waterfall",
  "gantt",
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

export const visualVariants = ["classic", "poster", "blueprint", "field-note"] as const;

export const DeckRequestSchema = z.object({
  eventContext: z.string().trim().min(3).max(300),
  audience: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => value || "general audience")
    .pipe(z.string().min(2).max(200)),
  theme: z.string().trim().min(2).max(120),
  themeDescription: z.string().trim().max(300).optional().default(""),
  tone: z.enum(tones),
  slideCount: z.coerce.number().int().min(5).max(10),
  insideJokes: z.string().trim().max(300).optional().default(""),
  noWords: z.boolean().optional().default(false),
});

export const DeckGenerationSchema = DeckRequestSchema.extend({
  slideCount: z.coerce.number().int().min(5).max(12),
});

export const VisualDataSchema = z.object({
  title: z.string().min(2).max(64),
  labels: z.array(z.string().min(1).max(42)).min(2).max(8),
  values: z.array(z.number().min(0).max(100)).max(8).default([]),
  notes: z.array(z.string().min(1).max(48)).max(4).default([]),
});

export const SlideSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["title", "chart", "quote", "diagram", "wildcard"]),
  kicker: z.string().min(1).max(42),
  heading: z.string().min(4).max(92),
  points: z.array(z.string().min(2).max(88)).min(0).max(3),
  visualLabel: z.string().min(2).max(64),
  visualType: z.enum(visualTypes).optional(),
  visualVariant: z.enum(visualVariants).optional(),
  visualData: VisualDataSchema.optional(),
  visualPrompt: z.string().min(8).max(240),
  speakerHidden: z.string().min(8).max(220),
  palette: z.object({
    paper: z.string().min(4).max(24),
    accentA: z.string().min(4).max(24),
    accentB: z.string().min(4).max(24),
    strong: z.string().min(4).max(24),
  }),
});

export const DeckSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(4).max(88),
  audience: z.string().min(2).max(200),
  tone: z.enum(tones),
  theme: z.string().min(2).max(120),
  source: z.enum(["openai", "fallback"]),
  createdAt: z.string().datetime(),
  slides: z.array(SlideSchema).min(5).max(12),
  generation: DeckGenerationSchema.optional(),
});

export type DeckRequest = z.infer<typeof DeckRequestSchema>;
export type VisualType = (typeof visualTypes)[number];
export type VisualVariant = (typeof visualVariants)[number];
export type VisualData = z.infer<typeof VisualDataSchema>;
export type KaraokeSlide = z.infer<typeof SlideSchema>;
export type KaraokeDeck = z.infer<typeof DeckSchema>;

export const deckGenerationJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "slides"],
  properties: {
    title: {
      type: "string",
    },
    slides: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "kind",
          "kicker",
          "heading",
          "points",
          "visualLabel",
          "visualType",
          "visualVariant",
          "visualData",
          "visualPrompt",
          "speakerHidden",
          "palette",
        ],
        properties: {
          kind: {
            type: "string",
            enum: ["title", "chart", "quote", "diagram", "wildcard"],
          },
          kicker: { type: "string" },
          heading: { type: "string" },
          points: {
            type: "array",
            items: { type: "string" },
          },
          visualLabel: { type: "string" },
          visualType: {
            type: "string",
            enum: visualTypes,
          },
          visualVariant: {
            type: "string",
            enum: visualVariants,
          },
          visualData: {
            type: "object",
            additionalProperties: false,
            required: ["title", "labels", "values", "notes"],
            properties: {
              title: { type: "string" },
              labels: {
                type: "array",
                items: { type: "string" },
              },
              values: {
                type: "array",
                items: { type: "number" },
              },
              notes: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
          visualPrompt: { type: "string" },
          speakerHidden: { type: "string" },
          palette: {
            type: "object",
            additionalProperties: false,
            required: ["paper", "accentA", "accentB", "strong"],
            properties: {
              paper: { type: "string" },
              accentA: { type: "string" },
              accentB: { type: "string" },
              strong: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;

export function completeDeck(
  partial: Pick<KaraokeDeck, "title" | "slides">,
  request: DeckRequest,
  source: KaraokeDeck["source"],
): KaraokeDeck {
  const id = crypto.randomUUID();
  const deck = {
    id,
    title: partial.title,
    audience: request.audience,
    tone: request.tone,
    theme: request.theme,
    source,
    createdAt: new Date().toISOString(),
    generation: request,
    slides: partial.slides.map((slide, index) => ({
      ...slide,
      id: slide.id || `${id}-${index + 1}`,
    })),
  };

  return DeckSchema.parse(deck);
}
