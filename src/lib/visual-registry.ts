import type { KaraokeSlide, VisualType } from "@/lib/deck";

export type SemanticTag =
  | "time"
  | "comparison"
  | "process"
  | "hierarchy"
  | "metrics"
  | "risk"
  | "spatial"
  | "narrative"
  | "relationship"
  | "portfolio";

export type NarrativeRole =
  | "opening"
  | "context"
  | "evidence"
  | "comparison"
  | "friction"
  | "crisis"
  | "process"
  | "forecast"
  | "recommendation"
  | "closing";

export type VisualRegistryEntry = {
  type: VisualType;
  displayName: string;
  aliases: string[];
  semanticTags: SemanticTag[];
  topicAffinities: string[];
  narrativeRoles: NarrativeRole[];
  labelSlots: {
    min: number;
    max: number;
    values: boolean;
  };
  kindsAllowed?: KaraokeSlide["kind"][];
};

const commonAffinities = ["strategy", "plan", "model", "system", "team", "event"];

export const visualRegistry: VisualRegistryEntry[] = [
  entry("venn", "Venn", ["venn diagram", "overlap diagram"], ["comparison", "relationship"], ["overlap", "shared", "intersection"], ["opening", "context", "comparison"], 3, 3, true),
  entry("comparison_table", "Comparison Table", ["comparison table", "pros and cons", "feature matrix"], ["comparison", "metrics"], ["versus", "tradeoff", "choice", "decision"], ["comparison", "recommendation"], 4, 6, true, ["chart", "diagram"]),
  entry("before_after", "Before/After", ["before vs after", "current state vs future state"], ["time", "comparison", "narrative"], ["before", "after", "change", "transformation"], ["context", "forecast", "closing"], 3, 4, true),
  entry("quadrant", "Quadrant", ["quadrant chart", "impact effort matrix", "perceptual map"], ["comparison", "portfolio", "risk"], ["priority", "impact", "effort", "matrix"], ["comparison", "recommendation"], 4, 4, true, ["chart", "diagram"]),
  entry("flowchart", "Flowchart", ["flowchart", "workflow", "decision flow"], ["process", "narrative"], ["workflow", "decision", "steps", "routing"], ["process", "crisis"], 4, 6, false, ["diagram"]),
  entry("funnel", "Funnel", ["pipeline", "conversion funnel"], ["process", "metrics"], ["pipeline", "conversion", "filter", "adoption"], ["evidence", "process"], 4, 6, true, ["chart", "diagram"]),
  entry("cycle", "Cycle", ["cycle diagram", "feedback loop", "flywheel"], ["process", "time"], ["loop", "repeat", "feedback", "season"], ["process", "closing"], 4, 5, false),
  entry("timeline", "Timeline", ["timeline", "roadmap", "milestone schedule"], ["time", "narrative"], ["time", "zone", "schedule", "roadmap", "calendar", "history", "deadline"], ["context", "forecast"], 4, 6, true, ["diagram", "chart"]),
  entry("hierarchy", "Hierarchy", ["org chart", "tree diagram", "taxonomy"], ["hierarchy", "relationship"], ["org", "rank", "taxonomy", "levels"], ["context", "recommendation"], 4, 6, false),
  entry("pyramid", "Pyramid", ["pyramid", "tier diagram", "capability stack"], ["hierarchy", "portfolio"], ["tier", "layer", "foundation", "stack"], ["evidence", "recommendation"], 4, 5, true),
  entry("network", "Network", ["network diagram", "ecosystem map", "system architecture"], ["relationship", "spatial"], ["network", "ecosystem", "architecture", "connections"], ["context", "crisis"], 5, 7, false),
  entry("dashboard", "Dashboard", ["kpi dashboard", "scorecard", "gauge chart"], ["metrics"], ["metric", "score", "kpi", "dashboard"], ["evidence", "crisis"], 4, 6, true, ["chart"]),
  entry("radar", "Radar", ["radar chart", "spider diagram", "capability radar"], ["metrics", "portfolio"], ["capability", "maturity", "readiness", "skill"], ["evidence", "recommendation"], 5, 6, true, ["chart"]),
  entry("heat_matrix", "Heat Matrix", ["heatmap", "risk matrix", "correlation matrix"], ["metrics", "risk", "comparison"], ["heat", "risk", "correlation", "intensity"], ["crisis", "comparison"], 4, 8, true, ["chart"]),
  entry("canvas", "Canvas", ["lean canvas", "business model canvas", "strategy map"], ["portfolio", "narrative"], ["canvas", "business", "model", "strategy"], ["opening", "recommendation"], 6, 8, false),
  entry("bento", "Bento Grid", ["bento grid", "modular layout", "panel grid"], ["portfolio", "narrative"], ["modules", "features", "inventory", "collection"], ["opening", "evidence"], 5, 7, true),
  entry("isometric", "Isometric Stack", ["isometric blocks", "architecture layers", "stack diagram"], ["spatial", "hierarchy"], ["stack", "architecture", "platform", "layers"], ["context", "recommendation"], 4, 5, true),
  entry("swimlane", "Swimlane", ["swimlane diagram", "handoff map"], ["process", "relationship"], ["handoff", "roles", "owner", "team", "lane"], ["process", "crisis"], 4, 6, false, ["diagram"]),
  entry("sankey", "Sankey", ["sankey diagram", "flow allocation"], ["process", "metrics"], ["flow", "budget", "allocation", "traffic", "energy"], ["evidence", "crisis"], 4, 6, true, ["chart", "diagram"]),
  entry("gauge_row", "Gauge Row", ["gauge row", "readiness gauges"], ["metrics", "risk"], ["score", "readiness", "health", "status"], ["evidence", "recommendation"], 3, 5, true, ["chart"]),
  entry("stacked_bar", "Stacked Bar", ["stacked bar chart", "composition bars"], ["metrics", "comparison"], ["share", "mix", "budget", "split", "composition"], ["evidence", "comparison"], 4, 6, true, ["chart"]),
  entry("pie_callout", "Pie Callout", ["pie chart with callouts", "share breakdown"], ["metrics", "portfolio"], ["share", "portion", "slice", "budget"], ["evidence", "closing"], 3, 5, true, ["chart", "wildcard"]),
  entry("scatter_plot", "Scatter Plot", ["scatter plot", "correlation plot"], ["metrics", "comparison", "risk"], ["correlation", "outlier", "cluster", "tradeoff"], ["comparison", "crisis"], 4, 6, true, ["chart"]),
  entry("waterfall", "Waterfall", ["waterfall chart", "bridge chart"], ["metrics", "time"], ["budget", "change", "delta", "profit", "loss"], ["evidence", "forecast"], 4, 6, true, ["chart"]),
  entry("gantt", "Gantt", ["gantt chart", "project schedule"], ["time", "process"], ["time", "zone", "schedule", "calendar", "deadline", "roadmap", "project"], ["forecast", "process"], 4, 6, true, ["chart", "diagram"]),
  entry("donut_progress", "Donut Progress", ["donut progress", "ring progress", "completion rings"], ["metrics", "portfolio"], ["progress", "completion", "share", "portion", "readiness"], ["evidence", "recommendation"], 3, 5, true, ["chart"]),
  entry("lollipop_chart", "Lollipop Chart", ["lollipop chart", "dot bar chart"], ["metrics", "comparison"], ["rank", "score", "compare", "priority", "option"], ["comparison", "evidence"], 4, 6, true, ["chart"]),
  entry("slope_chart", "Slope Chart", ["slope chart", "before after lines", "change chart"], ["time", "comparison", "metrics"], ["change", "before", "after", "trend", "growth"], ["comparison", "forecast"], 4, 6, true, ["chart"]),
  entry("bubble_map", "Bubble Map", ["bubble map", "bubble cluster", "concept map"], ["spatial", "relationship", "portfolio"], ["cluster", "map", "room", "group", "ecosystem"], ["opening", "context"], 5, 7, true, ["diagram", "chart"]),
  entry("decision_tree", "Decision Tree", ["decision tree", "branching choices", "choice tree"], ["process", "risk", "hierarchy"], ["decision", "choice", "branch", "routing", "if"], ["process", "crisis", "recommendation"], 5, 7, false, ["diagram"]),
  entry("fishbone", "Fishbone", ["fishbone diagram", "cause and effect", "root cause"], ["risk", "process", "narrative"], ["cause", "root", "problem", "friction", "incident"], ["friction", "crisis"], 4, 6, false, ["diagram"]),
  entry("swot_grid", "SWOT Grid", ["swot grid", "strength weakness opportunity threat"], ["comparison", "risk", "portfolio"], ["strength", "weakness", "opportunity", "threat", "strategy"], ["comparison", "recommendation"], 4, 4, false, ["diagram", "chart"]),
  entry("journey_map", "Journey Map", ["journey map", "experience path", "customer journey"], ["time", "process", "narrative"], ["journey", "customer", "experience", "trip", "path"], ["context", "process"], 4, 6, true, ["diagram"]),
  entry("calendar_strip", "Calendar Strip", ["calendar strip", "week strip", "schedule strip"], ["time", "metrics"], ["calendar", "week", "schedule", "time", "deadline"], ["forecast", "process"], 5, 7, true, ["chart", "diagram"]),
  entry("ranking_ladder", "Ranking Ladder", ["ranking ladder", "ranked list", "priority ladder"], ["hierarchy", "comparison", "metrics"], ["rank", "priority", "ladder", "tier", "best"], ["comparison", "recommendation"], 4, 6, true, ["chart", "diagram"]),
  entry("traffic_light", "Traffic Light", ["traffic light", "status lights", "red yellow green"], ["risk", "metrics"], ["status", "health", "risk", "stop", "go"], ["crisis", "recommendation"], 3, 5, true, ["chart", "diagram"]),
  entry("sticky_wall", "Sticky Wall", ["sticky note wall", "brainstorm board", "idea wall"], ["portfolio", "narrative", "relationship"], ["ideas", "brainstorm", "notes", "workshop", "wall"], ["opening", "evidence", "closing"], 6, 8, false, ["diagram", "wildcard"]),
];

export const visualAliases: Record<VisualType, string[]> = Object.fromEntries(
  visualRegistry.map((entry) => [entry.type, entry.aliases]),
) as Record<VisualType, string[]>;

export function getVisualEntry(type: VisualType): VisualRegistryEntry {
  return visualRegistry.find((entry) => entry.type === type) || visualRegistry[0];
}

function entry(
  type: VisualType,
  displayName: string,
  aliases: string[],
  semanticTags: SemanticTag[],
  topicAffinities: string[],
  narrativeRoles: NarrativeRole[],
  min: number,
  max: number,
  values: boolean,
  kindsAllowed?: KaraokeSlide["kind"][],
): VisualRegistryEntry {
  return {
    type,
    displayName,
    aliases,
    semanticTags,
    topicAffinities: [...topicAffinities, ...commonAffinities],
    narrativeRoles,
    labelSlots: { min, max, values },
    kindsAllowed,
  };
}
