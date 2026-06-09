import type { DeckRequest, VisualData } from "@/lib/deck";
import type { SlideCompositionSpec } from "@/lib/composition-planner";
import { clip } from "@/lib/keyword-bank";

export function buildFallbackVisualData(
  spec: SlideCompositionSpec,
  request: DeckRequest,
  keywords: string[],
  title: string,
  random: () => number,
): VisualData {
  const values = fallbackValues(random, 8);
  const labels = labelSet(spec.visualType, keywords).map((label) =>
    request.noWords ? compactSimpleLabel(label) : label,
  );
  const notes = [
    request.tone === "academic" ? `${keywords[0]} peer-reviewed vibes` : `${keywords[0]} looks official`,
    `${keywords[1]} remains unresolved`,
    spec.affinityNotes,
  ].map((note) => clip(note, 48));

  return {
    title,
    labels: labels.map((label) => clip(label, 42)),
    values: needsValues(spec.visualType) || request.noWords
      ? shapeValues(spec.visualType, values, request.noWords)
      : [],
    notes,
  };
}

function labelSet(type: SlideCompositionSpec["visualType"], k: string[]): string[] {
  const labels: Record<SlideCompositionSpec["visualType"], string[]> = {
    venn: [`${k[0]} overlap`, `${k[1]} coalition`, `${k[2]} confusion`],
    comparison_table: [`Legacy ${k[0]}`, `Future ${k[0]}`, `${k[2]} upside`, `${k[3]} concern`],
    before_after: [`Before ${k[0]}`, `After ${k[0]}`, `${k[2]} proof`],
    quadrant: [`High ${k[0]}`, `Low ${k[1]}`, `${k[2]} urgency`, `${k[3]} payoff`],
    flowchart: [`Spot ${k[0]}`, `Debate ${k[1]}`, `Escalate ${k[2]}`, `Declare ${k[3]}`],
    funnel: [`Notice ${k[0]}`, `Trust ${k[1]}`, `Adopt ${k[2]}`, `Defend ${k[3]}`],
    cycle: [`Observe ${k[0]}`, `Rename ${k[1]}`, `Budget ${k[2]}`, `Repeat ${k[3]}`],
    timeline: [`Now: ${k[0]}`, `Soon: ${k[1]}`, `Later: ${k[2]}`, `Legend: ${k[3]}`],
    hierarchy: [`Executive ${k[0]}`, `${k[1]} office`, `${k[2]} desk`, `${k[3]} basement`],
    pyramid: [`Foundation: ${k[0]}`, `${k[1]} layer`, `${k[2]} layer`, `Peak ${k[3]}`],
    network: [k[0], `${k[1]} node`, `${k[2]} node`, `${k[3]} node`, `${k[4]} node`],
    dashboard: [`${k[0]} score`, `${k[1]} drift`, `${k[2]} risk`, `${k[3]} readiness`],
    radar: [`${k[0]} readiness`, `${k[1]} clarity`, `${k[2]} speed`, `${k[3]} nerve`, `${k[4]} charm`],
    heat_matrix: [`Low ${k[0]}`, `Medium ${k[1]}`, `High ${k[2]}`, `Heroic ${k[3]}`],
    canvas: [`Audience ${k[0]}`, `${k[1]} promise`, `${k[2]} channel`, `${k[3]} cost`, `${k[4]} win`, `${k[5]} proof`],
    bento: [`${k[0]} module`, `${k[1]} card`, `${k[2]} card`, `${k[3]} card`, `${k[4]} card`],
    isometric: [`Base ${k[0]}`, `Layer ${k[1]}`, `Platform ${k[2]}`, `Launch ${k[3]}`],
    swimlane: [`${k[0]} owner`, `${k[1]} handoff`, `${k[2]} check`, `${k[3]} signoff`],
    sankey: [`${k[0]} input`, `${k[1]} stream`, `${k[2]} leak`, `${k[3]} outcome`],
    gauge_row: [`${k[0]} readiness`, `${k[1]} pressure`, `${k[2]} confidence`],
    stacked_bar: [`${k[0]} share`, `${k[1]} share`, `${k[2]} share`, `${k[3]} share`],
    pie_callout: [`${k[0]} slice`, `${k[1]} slice`, `${k[2]} slice`, `${k[3]} remainder`],
    scatter_plot: [`${k[0]} outlier`, `${k[1]} cluster`, `${k[2]} trend`, `${k[3]} anomaly`],
    waterfall: [`Start ${k[0]}`, `Add ${k[1]}`, `Lose ${k[2]}`, `Recover ${k[3]}`, `End ${k[4]}`],
    gantt: [`Week 1 ${k[0]}`, `Week 2 ${k[1]}`, `Week 3 ${k[2]}`, `Week 4 ${k[3]}`],
    donut_progress: [`${k[0]} progress`, `${k[1]} almost`, `${k[2]} still waiting`],
    lollipop_chart: [`${k[0]} high`, `${k[1]} medium`, `${k[2]} surprise`, `${k[3]} tiny`],
    slope_chart: [`Before ${k[0]}`, `After ${k[1]}`, `${k[2]} rose`, `${k[3]} dipped`],
    bubble_map: [`${k[0]} hub`, `${k[1]} crowd`, `${k[2]} corner`, `${k[3]} orbit`, `${k[4]} rumor`],
    decision_tree: [`Start ${k[0]}`, `Pick ${k[1]}`, `Avoid ${k[2]}`, `Ask ${k[3]}`, `Commit ${k[4]}`],
    fishbone: [`Cause ${k[0]}`, `Cause ${k[1]}`, `Cause ${k[2]}`, `Cause ${k[3]}`, `Root ${k[4]}`],
    swot_grid: [`${k[0]} strength`, `${k[1]} weakness`, `${k[2]} opening`, `${k[3]} threat`],
    journey_map: [`Arrive ${k[0]}`, `Notice ${k[1]}`, `Debate ${k[2]}`, `Adopt ${k[3]}`, `Defend ${k[4]}`],
    calendar_strip: [`Mon ${k[0]}`, `Tue ${k[1]}`, `Wed ${k[2]}`, `Thu ${k[3]}`, `Fri ${k[4]}`],
    ranking_ladder: [`Top ${k[0]}`, `Next ${k[1]}`, `Middle ${k[2]}`, `Almost ${k[3]}`, `Bottom ${k[4]}`],
    traffic_light: [`Green ${k[0]}`, `Yellow ${k[1]}`, `Red ${k[2]}`],
    sticky_wall: [`${k[0]} idea`, `${k[1]} note`, `${k[2]} maybe`, `${k[3]} fix`, `${k[4]} vote`, `${k[5]} wild card`],
  };

  return labels[type];
}

function needsValues(type: SlideCompositionSpec["visualType"]): boolean {
  return ![
    "flowchart",
    "cycle",
    "hierarchy",
    "network",
    "canvas",
    "swimlane",
    "decision_tree",
    "fishbone",
    "swot_grid",
    "sticky_wall",
  ].includes(type);
}

function shapeValues(
  type: SlideCompositionSpec["visualType"],
  values: number[],
  noWords = false,
): number[] {
  if (type === "funnel") {
    return values.slice(0, 4).sort((a, b) => b - a);
  }
  if (type === "timeline" || type === "gantt" || type === "calendar_strip" || type === "journey_map") {
    return values.slice(0, 4).sort((a, b) => a - b);
  }
  if (type === "waterfall" && !noWords) {
    return [42, 18, 26, 11, 71];
  }
  return values;
}

function fallbackValues(random: () => number, count: number): number[] {
  return Array.from({ length: count }, () => 18 + Math.floor(random() * 78));
}

function compactSimpleLabel(label: string): string {
  const weakPrefixes = new Set([
    "Add",
    "After",
    "Almost",
    "Arrive",
    "Ask",
    "Avoid",
    "Before",
    "Cause",
    "Commit",
    "Debate",
    "Defend",
    "End",
    "Executive",
    "Everyone",
    "Future",
    "Green",
    "High",
    "Host",
    "Legacy",
    "Lose",
    "Low",
    "Mon",
    "Notice",
    "Ops",
    "Pick",
    "Recover",
    "Red",
    "Room",
    "Spot",
    "Start",
    "Thu",
    "Top",
    "Tue",
    "Wed",
    "Week",
    "Yellow",
  ]);
  const words = label
    .replace(/[:/]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  while (words.length > 2 && weakPrefixes.has(words[0])) {
    words.shift();
  }

  if (words.length > 3) {
    return clip([words[0], words[words.length - 1]].join(" "), 28);
  }

  return clip(words.slice(0, 3).join(" "), 28);
}
