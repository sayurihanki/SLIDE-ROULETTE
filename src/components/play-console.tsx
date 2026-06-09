"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Copy,
  ExternalLink,
  Maximize2,
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { KaraokeDeck } from "@/lib/deck";
import { SlideStage } from "@/components/slide-stage";
import { useSlideSync } from "@/hooks/use-slide-sync";

type PlayConsoleProps = {
  deck: KaraokeDeck;
  mode?: "host" | "presenter";
};

const defaultRoundSeconds = 120;
const autoAdvanceSeconds = 28;

function minutesToSeconds(minutes: number) {
  return Math.max(1, Math.round(minutes * 60));
}

export function PlayConsole({ deck, mode = "host" }: PlayConsoleProps) {
  const searchParams = useSearchParams();
  const requestedSlide = Number(searchParams.get("slide") || 0);
  const initialIndex = Number.isFinite(requestedSlide)
    ? Math.min(deck.slides.length - 1, Math.max(-1, requestedSlide - 1))
    : -1;
  const isPresenter = mode === "presenter";

  const { index, setIndex, wordless, setWordless } = useSlideSync({
    deckId: deck.id,
    role: isPresenter ? "presenter" : "host",
    initialIndex,
    initialWordless: deck.generation?.noWords || false,
  });

  const [roundSeconds, setRoundSeconds] = useState(defaultRoundSeconds);
  const [roundMinutesInput, setRoundMinutesInput] = useState("2");
  const [secondsLeft, setSecondsLeft] = useState(defaultRoundSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isHostPanelOpen, setIsHostPanelOpen] = useState(!isPresenter);
  const [isHostCueOpen, setIsHostCueOpen] = useState(true);
  const [origin, setOrigin] = useState("");
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const currentSlide = index >= 0 ? deck.slides[index] : null;
  const slideLabel = currentSlide ? `${index + 1} / ${deck.slides.length}` : "Intro";
  const presenterUrl = origin ? `${origin}/play/${deck.id}/present` : `/play/${deck.id}/present`;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (isPresenter || !isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPresenter, isRunning]);

  useEffect(() => {
    if (!autoAdvance || !isRunning || isPresenter || index < 0 || index >= deck.slides.length - 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => Math.min(deck.slides.length - 1, current + 1));
    }, autoAdvanceSeconds * 1000);

    return () => window.clearInterval(timer);
  }, [autoAdvance, deck.slides.length, index, isPresenter, isRunning, setIndex]);

  useEffect(() => {
    if (isPresenter || secondsLeft !== 0 || !isRunning) {
      return;
    }

    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.frequency.value = 440;
      gain.gain.value = 0.08;
      oscillator.start();
      oscillator.stop(context.currentTime + 0.18);
    } catch {
      // optional buzzer
    }
  }, [isPresenter, isRunning, secondsLeft]);

  useEffect(() => {
    if (isPresenter) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex(Math.min(deck.slides.length - 1, index + 1));
        setIsRunning(true);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex(Math.max(-1, index - 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deck.slides.length, index, isPresenter, setIndex]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  function resetRound() {
    setIndex(-1);
    setSecondsLeft(roundSeconds);
    setIsRunning(false);
  }

  function updateRoundLength(value: string) {
    setRoundMinutesInput(value);

    const minutes = Number(value);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return;
    }

    const nextSeconds = minutesToSeconds(minutes);
    setRoundSeconds(nextSeconds);
    setSecondsLeft(nextSeconds);
    setIsRunning(false);
  }

  async function copyLink(url: string) {
    if (!origin) {
      return;
    }

    await navigator.clipboard?.writeText(url);
  }

  async function enterFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  }

  useEffect(() => {
    if (!origin || isPresenter) {
      return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(presenterUrl)}`;
    setQrDataUrl(qrUrl);
  }, [isPresenter, origin, presenterUrl]);

  if (isPresenter) {
    return (
      <div className="play-shell presenter-shell">
        <main className="stage presenter-stage">
          <SlideStage deck={deck} slide={currentSlide} presenterMode wordless={wordless} />
        </main>
      </div>
    );
  }

  return (
    <div className={`play-shell ${isHostPanelOpen ? "" : "host-collapsed"}`}>
      <main className="stage">
        <SlideStage deck={deck} slide={currentSlide} wordless={wordless} />
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
            <strong className={secondsLeft === 0 && isRunning ? "timer-ended" : ""}>
              {formattedTime}
            </strong>
          </div>

          <label className="round-length-control">
            <span>Round length</span>
            <span className="round-length-input">
              <input
                type="number"
                min="0.1"
                step="0.25"
                value={roundMinutesInput}
                onChange={(event) => updateRoundLength(event.target.value)}
              />
              <span>min</span>
            </span>
          </label>

          <div className="slide-controls">
            <button
              className="icon-button"
              type="button"
              onClick={() => setIndex(Math.max(-1, index - 1))}
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
              onClick={() => {
                setIndex(Math.min(deck.slides.length - 1, index + 1));
                setIsRunning(true);
              }}
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
              onClick={() => copyLink(`${origin}/play/${deck.id}`)}
              title="Copy host link"
              aria-label="Copy host link"
            >
              <Copy size={18} aria-hidden="true" />
            </button>
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(event) => setAutoAdvance(event.target.checked)}
            />
            <span>Auto-advance every {autoAdvanceSeconds}s while timer runs</span>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={wordless}
              onChange={(event) => setWordless(event.target.checked)}
            />
            <span>Simple mode</span>
          </label>

          {currentSlide ? (
            <section className="host-cue-card" aria-label="Host cue">
              <button
                className="host-cue-toggle"
                type="button"
                onClick={() => setIsHostCueOpen((value) => !value)}
                aria-expanded={isHostCueOpen}
              >
                Host cue
              </button>
              {isHostCueOpen ? <p>{currentSlide.speakerHidden}</p> : null}
            </section>
          ) : (
            <p className="host-note">Advance to the first slide to reveal host-only cues.</p>
          )}

          <div className="presenter-share">
            <label className="copy-field">
              <span>Presenter screen</span>
              <input readOnly value={presenterUrl} />
            </label>
            <div className="presenter-share-actions">
              <a className="button secondary" href={presenterUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={16} aria-hidden="true" />
                Open projector view
              </a>
              <button className="button secondary" type="button" onClick={() => copyLink(presenterUrl)}>
                <Copy size={16} aria-hidden="true" />
                Copy presenter link
              </button>
            </div>
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- external QR API URL
              <img className="presenter-qr" src={qrDataUrl} alt="" width={120} height={120} />
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
