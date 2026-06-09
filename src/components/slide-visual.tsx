"use client";

import type { CSSProperties } from "react";
import { renderVisual } from "@/components/visuals";
import type { KaraokeSlide } from "@/lib/deck";
import { shouldShowSlideDetails } from "@/lib/slide-visibility";

type SlideVisualProps = {
  slide: KaraokeSlide;
  wordless?: boolean;
};

export function SlideVisual({ slide, wordless = false }: SlideVisualProps) {
  const simpleMode = wordless;
  const showDetails = shouldShowSlideDetails(simpleMode);

  if (!slide.visualType || !slide.visualData) {
    return <span className="visual-label">{slide.visualLabel}</span>;
  }
  const visualVariant = slide.visualVariant || "classic";

  const style = {
    "--visual-accent": slide.palette.strong,
    "--visual-a": slide.palette.accentA,
    "--visual-b": slide.palette.accentB,
  } as CSSProperties;

  return (
    <figure
      className={`slide-visual visual-${visualVariant}${simpleMode ? " visual-simple" : ""}`}
      style={style}
      aria-label={slide.visualLabel}
    >
      {showDetails ? <figcaption>{slide.visualData.title}</figcaption> : null}
      {renderVisual(slide.visualType, slide.visualData)}
    </figure>
  );
}
