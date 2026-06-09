import type { KaraokeSlide } from "@/lib/deck";

export function shouldShowSlideWords() {
  return true;
}

export function shouldShowSlideKicker(simpleMode: boolean) {
  return !simpleMode;
}

export function shouldShowSlideDetails(simpleMode: boolean) {
  return !simpleMode;
}

export function visibleGeneratedSlideText(
  slide: KaraokeSlide,
  simpleMode: boolean,
): string[] {
  if (simpleMode) {
    return [
      slide.heading,
      ...(slide.visualData?.labels || []),
    ].filter((value): value is string => Boolean(value));
  }

  return [
    slide.kicker,
    slide.heading,
    ...slide.points,
    slide.visualLabel,
    slide.visualData?.title,
    ...(slide.visualData?.labels || []),
    ...(slide.visualData?.values || []).map(String),
  ].filter((value): value is string => Boolean(value));
}
