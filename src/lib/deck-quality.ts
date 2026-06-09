import type { DeckRequest, KaraokeDeck, KaraokeSlide } from "@/lib/deck";
import type { SlideCompositionSpec } from "@/lib/composition-planner";
import { keywordTokens } from "@/lib/keyword-bank";

export type DeckQualityIssue = {
  slideIndex: number;
  reason: "adjacent-duplicate" | "generic-labels" | "off-plan-type" | "duplicate-heading";
};

const genericLabels = new Set([
  "signal",
  "story",
  "proof",
  "risk",
  "action",
  "outcome",
  "budget",
  "momentum",
  "before",
  "after",
  "phase one",
  "phase two",
  "phase three",
]);

export function evaluateDeckQuality(
  deck: Pick<KaraokeDeck, "slides">,
  request: DeckRequest,
  plan: SlideCompositionSpec[],
): DeckQualityIssue[] {
  const issues: DeckQualityIssue[] = [];
  const tokens = keywordTokens(request);
  const headings = new Set<string>();

  deck.slides.forEach((slide, index) => {
    if (slide.visualType && slide.visualType === deck.slides[index - 1]?.visualType) {
      issues.push({ slideIndex: index, reason: "adjacent-duplicate" });
    }
    if (plan[index] && slide.visualType && slide.visualType !== plan[index].visualType) {
      issues.push({ slideIndex: index, reason: "off-plan-type" });
    }
    const headingKey = slide.heading.toLowerCase();
    if (headings.has(headingKey)) {
      issues.push({ slideIndex: index, reason: "duplicate-heading" });
    }
    headings.add(headingKey);

    if (slide.visualData && !labelsPass(slide, tokens)) {
      issues.push({ slideIndex: index, reason: "generic-labels" });
    }
  });

  return dedupeIssues(issues);
}

export function slideHasThemeLabel(slide: KaraokeSlide, request: DeckRequest): boolean {
  return labelsPass(slide, keywordTokens(request));
}

function labelsPass(slide: KaraokeSlide, tokens: Set<string>): boolean {
  const labels = slide.visualData?.labels || [];
  const allLabels = labels.join(" ").toLowerCase();
  const hasThemeToken = Array.from(tokens).some((token) => token.length > 2 && allLabels.includes(token));
  const hasGenericOnly = labels.every((label) => genericLabels.has(label.toLowerCase()));

  return hasThemeToken && !hasGenericOnly;
}

function dedupeIssues(issues: DeckQualityIssue[]): DeckQualityIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.slideIndex}:${issue.reason}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
