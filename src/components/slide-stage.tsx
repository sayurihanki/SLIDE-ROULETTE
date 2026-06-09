import type { CSSProperties } from "react";
import type { KaraokeDeck, KaraokeSlide } from "@/lib/deck";
import { SlideVisual } from "@/components/slide-visual";
import { shouldShowSlideDetails, shouldShowSlideKicker } from "@/lib/slide-visibility";

type SlideStageProps = {
  deck: KaraokeDeck;
  slide: KaraokeSlide | null;
  presenterMode?: boolean;
  wordless?: boolean;
};

export function SlideStage({
  deck,
  slide,
  presenterMode = false,
  wordless = false,
}: SlideStageProps) {
  const simpleMode = wordless;
  const frameClass = [
    "slide-frame",
    slide ? "" : "is-cover",
    slide ? `kind-${slide.kind}` : "",
    presenterMode ? "presenter-mode" : "",
    slide && simpleMode ? "is-simple" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!slide) {
    return (
      <section className={frameClass} aria-live="polite">
        <div className="slide-content">
          <span className="slide-kicker">Presenter ready screen</span>
          <div className="slide-main cover-main">
            <div className="slide-copy">
              <h1 className="slide-heading">{deck.title}</h1>
              <ul className="slide-points">
                <li>Presenter has not seen these slides</li>
                <li>Advance with arrow keys or host controls</li>
                <li>No skipping once the round starts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const paletteStyle = {
    "--slide-paper": slide.palette.paper,
    "--accent-a": slide.palette.accentA,
    "--accent-b": slide.palette.accentB,
    "--accent-strong": slide.palette.strong,
  } as CSSProperties;

  const showKicker = shouldShowSlideKicker(simpleMode);
  const showDetails = shouldShowSlideDetails(simpleMode);

  return (
    <section className={frameClass} aria-live="polite">
      <div className="slide-bg" style={paletteStyle} />
      <div className="slide-content">
        {showKicker ? <span className="slide-kicker">{slide.kicker}</span> : null}
        <div className="slide-main">
          <div className="slide-copy">
            {slide.kind === "quote" && showDetails ? (
              <blockquote className="slide-quote">{slide.heading}</blockquote>
            ) : (
              <h1 className="slide-heading">{slide.heading}</h1>
            )}
            {showDetails && slide.kind !== "quote" && slide.points.length > 0 ? (
              <ul className="slide-points">
                {slide.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {showDetails && slide.kind === "quote" && slide.points.length > 0 ? (
              <p className="slide-quote-attribution">{slide.points[0]}</p>
            ) : null}
            {showDetails && slide.kind === "wildcard" && slide.points[1] ? (
              <p className="slide-wildcard-callout">{slide.points[1]}</p>
            ) : null}
          </div>
          <SlideVisual slide={slide} wordless={simpleMode} />
        </div>
      </div>
    </section>
  );
}
