"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  Copy,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { KaraokeDeck } from "@/lib/deck";
import { SlideVisual } from "@/components/slide-visual";

type PlayConsoleProps = {
  deck: KaraokeDeck;
};

const secondsPerRound = 240;

export function PlayConsole({ deck }: PlayConsoleProps) {
  const searchParams = useSearchParams();
  const requestedSlide = Number(searchParams.get("slide") || 0);
  const initialIndex = Number.isFinite(requestedSlide)
    ? Math.min(deck.slides.length - 1, Math.max(-1, requestedSlide - 1))
    : -1;
  const [index, setIndex] = useState(initialIndex);
  const [secondsLeft, setSecondsLeft] = useState(secondsPerRound);
  const [isRunning, setIsRunning] = useState(false);
  const [isHostPanelOpen, setIsHostPanelOpen] = useState(true);
  const [origin, setOrigin] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const copyResetRef = useRef<number | null>(null);
  const currentSlide = index >= 0 ? deck.slides[index] : null;
  const slideLabel = currentSlide ? `${index + 1} / ${deck.slides.length}` : "Intro";

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    return () => {
      if (copyResetRef.current !== null) {
        window.clearTimeout(copyResetRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  const nextSlide = useCallback(() => {
    setIndex((value) => Math.min(deck.slides.length - 1, value + 1));
    setIsRunning(true);
  }, [deck.slides.length]);

  const previousSlide = useCallback(() => {
    setIndex((value) => Math.max(-1, value - 1));
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousSlide();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, previousSlide]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  function resetRound() {
    setIndex(-1);
    setSecondsLeft(secondsPerRound);
    setIsRunning(false);
  }

  async function copyLink() {
    if (!origin) {
      return;
    }

    const url = `${origin}/play/${deck.id}`;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(url);
      if (copyResetRef.current !== null) {
        window.clearTimeout(copyResetRef.current);
      }
      setCopyState("copied");
      copyResetRef.current = window.setTimeout(() => {
        setCopyState("idle");
        copyResetRef.current = null;
      }, 2000);
    } catch {
      if (copyResetRef.current !== null) {
        window.clearTimeout(copyResetRef.current);
      }
      setCopyState("failed");
      copyResetRef.current = window.setTimeout(() => {
        setCopyState("idle");
        copyResetRef.current = null;
      }, 2500);
    }
  }

  async function enterFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  }

  return (
    <div className={`play-shell ${isHostPanelOpen ? "" : "host-collapsed"}`}>
      <main className="stage">
        <section
          className={`slide-frame ${currentSlide ? "" : "is-cover"}`}
          aria-live="polite"
        >
          {currentSlide ? (
            <>
              <div
                className="slide-bg"
                style={
                  {
                    "--slide-paper": currentSlide.palette.paper,
                    "--accent-a": currentSlide.palette.accentA,
                    "--accent-b": currentSlide.palette.accentB,
                    "--accent-strong": currentSlide.palette.strong,
                  } as CSSProperties
                }
              />
              <div className="slide-content">
                <span className="slide-kicker">{currentSlide.kicker}</span>
                <div className="slide-main">
                  <div className="slide-copy">
                    <h1 className="slide-heading">{currentSlide.heading}</h1>
                    <ul className="slide-points">
                      {currentSlide.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <SlideVisual slide={currentSlide} />
                </div>
              </div>
            </>
          ) : (
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
          )}
        </section>
      </main>

      <button
        className="panel-toggle"
        type="button"
        onClick={() => setIsHostPanelOpen((value) => !value)}
        title={isHostPanelOpen ? "Hide host controls" : "Show host controls"}
        aria-label={isHostPanelOpen ? "Hide host controls" : "Show host controls"}
        aria-expanded={isHostPanelOpen}
      >
        {isHostPanelOpen ? (
          <PanelRightClose size={18} aria-hidden="true" />
        ) : (
          <PanelRightOpen size={18} aria-hidden="true" />
        )}
      </button>

      {isHostPanelOpen ? (
        <aside className="host-panel" aria-label="Host controls">
          <p className="sr-only" role="status" aria-live="polite">
            {copyState === "copied"
              ? "Share link copied to clipboard."
              : copyState === "failed"
                ? "Could not copy link. Select the field and copy manually."
                : ""}
          </p>
          <div>
            <p className="eyebrow">Host console</p>
            <h2>{deck.title}</h2>
            <p className="play-meta">
              {deck.slides.length} slides · {deck.tone} ·{" "}
              {deck.source === "openai" ? "AI generated" : "demo generated"}
            </p>
          </div>

          <div className="timer-card">
            <span>{slideLabel}</span>
            <strong>{formattedTime}</strong>
          </div>

          <div className="slide-controls">
            <button
              className="icon-button"
              type="button"
              onClick={previousSlide}
              disabled={index < 0}
              title="Previous slide"
              aria-label="Previous slide"
            >
              <SkipBack size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={() => setIsRunning((value) => !value)}
              title={isRunning ? "Pause timer" : "Start timer"}
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              {isRunning ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={nextSlide}
              disabled={index === deck.slides.length - 1}
              title="Next slide"
              aria-label="Next slide"
            >
              <SkipForward size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={resetRound}
              title="Reset round"
              aria-label="Reset round"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={enterFullscreen}
              title="Fullscreen"
              aria-label="Fullscreen"
            >
              <Maximize2 size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={copyLink}
              title="Copy share link"
              aria-label="Copy share link"
              disabled={!origin}
            >
              <Copy size={18} aria-hidden="true" />
            </button>
          </div>

          <label className="copy-field">
            <span>
              Share link
              {copyState === "copied" ? (
                <span className="copy-hint copy-hint-success"> · Copied</span>
              ) : null}
              {copyState === "failed" ? (
                <span className="copy-hint copy-hint-error">
                  {" "}
                  · Copy blocked — select the field and use copy (Ctrl+C or Cmd+C)
                </span>
              ) : null}
            </span>
            <input readOnly value={origin ? `${origin}/play/${deck.id}` : `/play/${deck.id}`} />
          </label>

          <p className="host-note">
            Keep the presenter on the main screen. Host-only notes are stored with the deck but
            intentionally hidden from the slideshow.
          </p>
        </aside>
      ) : null}
    </div>
  );
}
