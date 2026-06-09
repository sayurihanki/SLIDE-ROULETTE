import type { DeckRequest, KaraokeSlide, VisualType, VisualVariant } from "@/lib/deck";
import { buildKeywordBank, keywordTokens } from "@/lib/keyword-bank";
import { pick, seededRandom, shuffle } from "@/lib/random";
import { getVisualEntry, NarrativeRole, visualRegistry } from "@/lib/visual-registry";

export type SlideCompositionSpec = {
  index: number;
  narrativeRole: NarrativeRole;
  kind: KaraokeSlide["kind"];
  visualType: VisualType;
  visualVariant: VisualVariant;
  affinityNotes: string;
};

const roleArc: NarrativeRole[] = [
  "opening",
  "context",
  "evidence",
  "comparison",
  "friction",
  "crisis",
  "process",
  "forecast",
  "recommendation",
  "closing",
  "evidence",
  "recommendation",
];

const kindsByRole: Record<NarrativeRole, KaraokeSlide["kind"][]> = {
  opening: ["title", "diagram", "wildcard"],
  context: ["diagram", "chart", "title"],
  evidence: ["chart", "diagram"],
  comparison: ["chart", "diagram"],
  friction: ["diagram", "wildcard", "chart"],
  crisis: ["chart", "diagram", "wildcard"],
  process: ["diagram", "chart"],
  forecast: ["chart", "diagram"],
  recommendation: ["diagram", "chart", "wildcard"],
  closing: ["quote", "wildcard", "diagram"],
};

const tagTokenHints: Record<string, string[]> = {
  time: ["time", "zone", "schedule", "calendar", "deadline", "roadmap", "history", "future"],
  comparison: ["versus", "tradeoff", "choice", "compare", "better", "worse"],
  process: ["process", "workflow", "steps", "pipeline", "handoff", "operation"],
  hierarchy: ["rank", "level", "layer", "org", "stack", "priority"],
  metrics: ["score", "metric", "budget", "number", "growth", "cost"],
  risk: ["risk", "crisis", "threat", "safety", "problem", "anxiety"],
  spatial: ["map", "place", "room", "location", "network", "architecture"],
  relationship: ["team", "network", "connection", "audience", "friend"],
  portfolio: ["menu", "collection", "features", "inventory", "options"],
  narrative: ["story", "briefing", "incident", "rumor", "agenda"],
};

const wordlessPreferredTypes = new Set<VisualType>([
  "flowchart",
  "funnel",
  "cycle",
  "timeline",
  "network",
  "dashboard",
  "radar",
  "heat_matrix",
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
]);

export function planDeckComposition(request: DeckRequest, seed: string): SlideCompositionSpec[] {
  const random = seededRandom(`plan:${seed}`);
  const tokens = keywordTokens(request);
  const keywords = buildKeywordBank(request);
  const usedTypes = new Set<VisualType>();
  const specs: SlideCompositionSpec[] = [];

  for (let index = 0; index < request.slideCount; index += 1) {
    const role = roleArc[index % roleArc.length];
    const previousType = specs[index - 1]?.visualType;
    const uniqueStillAvailable = usedTypes.size < visualRegistry.length;
    const ranked = shuffle(visualRegistry, random)
      .map((entry) => {
        let score = 0;
        if (entry.narrativeRoles.includes(role)) {
          score += 18;
        }
        if (request.noWords && wordlessPreferredTypes.has(entry.type)) {
          score += 20;
        }
        for (const affinity of entry.topicAffinities) {
          if (tokens.has(affinity) || Array.from(tokens).some((token) => affinity.includes(token) || token.includes(affinity))) {
            score += 24;
          }
        }
        for (const tag of entry.semanticTags) {
          const hints = tagTokenHints[tag] || [];
          if (hints.some((hint) => tokens.has(hint))) {
            score += 12;
          }
        }
        if (entry.type === previousType) {
          score -= 1000;
        }
        if (uniqueStillAvailable && usedTypes.has(entry.type)) {
          score -= 160;
        }
        score += random() * 34;
        return { entry, score };
      })
      .sort((a, b) => b.score - a.score);

    const maxScore = ranked[0].score;
    const candidatePool = ranked
      .filter((candidate) => maxScore - candidate.score <= 14)
      .slice(0, Math.min(ranked.length, uniqueStillAvailable ? 6 : 4));
    const visualType = candidatePool[Math.floor(random() * candidatePool.length)].entry.type;
    const visualEntry = getVisualEntry(visualType);
    const allowedKinds = visualEntry.kindsAllowed || (request.noWords ? ["diagram", "chart"] : kindsByRole[role]);
    const preferredKinds = request.noWords
      ? allowedKinds.filter((kind) => kind === "diagram" || kind === "chart")
      : kindsByRole[role].filter((kind) => allowedKinds.includes(kind));
    const roleKinds = preferredKinds.length > 0 ? preferredKinds : kindsByRole[role].filter((kind) => allowedKinds.includes(kind));
    const kind = pick(roleKinds.length > 0 ? roleKinds : allowedKinds, random);
    const matchedAffinity = visualEntry.topicAffinities.find((affinity) =>
      Array.from(tokens).some((token) => affinity.includes(token) || token.includes(affinity)),
    );

    usedTypes.add(visualType);
    specs.push({
      index,
      narrativeRole: role,
      kind,
      visualType,
      visualVariant: pickVariant(request.tone, random),
      affinityNotes: `${visualEntry.displayName} fits ${matchedAffinity || keywords[index % keywords.length]} via ${visualEntry.semanticTags.join("/")}.`,
    });
  }

  return specs;
}

function pickVariant(tone: DeckRequest["tone"], random: () => number): VisualVariant {
  const variantsByTone: Record<DeckRequest["tone"], VisualVariant[]> = {
    polished: ["classic", "blueprint", "classic", "field-note"],
    silly: ["poster", "field-note", "classic", "poster"],
    chaotic: ["field-note", "poster", "blueprint", "classic"],
    academic: ["blueprint", "classic", "blueprint", "field-note"],
    retro: ["poster", "field-note", "poster", "classic"],
    deadpan: ["classic", "blueprint", "classic", "poster"],
  };

  return pick(variantsByTone[tone], random);
}
