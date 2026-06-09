"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle, WandSparkles } from "lucide-react";
import { tones } from "@/lib/deck";
import { saveDeckToBrowser } from "@/lib/browser-deck-cache";
import {
  audienceLabels,
  themeCategories,
  themeOptions,
  type AudienceHint,
  type ThemeCategory,
  type ThemeOption,
} from "@/lib/themes";

const toneLabels: Record<(typeof tones)[number], string> = {
  polished: "Polished",
  silly: "Silly",
  chaotic: "Chaotic",
  academic: "Academic",
  retro: "Retro",
  deadpan: "Deadpan",
};

const defaultEventContext = "Lehi SC Training";
const defaultAudience = "Tech Pre-Sales Teammates";
const defaultSlideCount = 5;
const defaultThemePool = themeOptions.filter(
  (option) => option.workSafeLevel === "safe" && option.audiences.includes("company"),
);

function pickRandomTheme(pool: ThemeOption[]) {
  const options = pool.length > 0 ? pool : themeOptions;
  return options[Math.floor(Math.random() * options.length)];
}

export function GenerateDeckForm() {
  const router = useRouter();
  const [slideCount, setSlideCount] = useState(defaultSlideCount);
  const [tone, setTone] = useState<(typeof tones)[number]>("polished");
  const [category, setCategory] = useState<ThemeCategory | "All">("All");
  const [audienceFilter, setAudienceFilter] = useState<AudienceHint | "all">("company");
  const [themeValue, setThemeValue] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [themeStatus, setThemeStatus] = useState("");
  const [noWords, setNoWords] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const progressMessages = [
    "Sketching the fake executive summary...",
    "Commissioning suspicious charts...",
    "Writing host cues the presenter must not see...",
    "Polishing jargon for maximum confidence...",
    "Almost ready for the room...",
  ];
  const filteredThemes = themeOptions.filter((option) => {
    const matchesCategory = category === "All" || option.category === category;
    const matchesAudience =
      audienceFilter === "all" || option.audiences.includes(audienceFilter);
    return matchesCategory && matchesAudience;
  });

  useEffect(() => {
    const option = pickRandomTheme(defaultThemePool);
    setThemeValue(option.theme);
    setThemeDescription(option.desc);
    setThemeStatus(`Random pick: ${option.theme}`);
  }, []);

  function selectTheme(option: ThemeOption) {
    setThemeValue(option.theme);
    setThemeDescription(option.desc);
    setThemeStatus(`${option.theme} selected`);
  }

  function randomizeTheme() {
    const pool = filteredThemes.length > 0 ? filteredThemes : themeOptions;
    const option = pool[Math.floor(Math.random() * pool.length)];
    selectTheme(option);
    setThemeStatus(`Random pick: ${option.theme}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    setProgressStep(0);

    const progressTimer = window.setInterval(() => {
      setProgressStep((value) => Math.min(progressMessages.length - 1, value + 1));
    }, 2200);

    const formData = new FormData(event.currentTarget);
    const payload = {
      eventContext: String(formData.get("eventContext") || ""),
      audience: String(formData.get("audience") || ""),
      theme: themeValue,
      themeDescription,
      tone,
      slideCount,
      insideJokes: String(formData.get("insideJokes") || ""),
      noWords,
    };

    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deck generation failed.");
      }

      saveDeckToBrowser(data.deck);
      router.push(`/review/${data.deck.id}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Deck generation failed.",
      );
    } finally {
      window.clearInterval(progressTimer);
      setIsSubmitting(false);
    }
  }

  return (
    <form className="deck-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="eventContext">Event context</label>
        <input
          id="eventContext"
          name="eventContext"
          required
          defaultValue={defaultEventContext}
          minLength={3}
          maxLength={300}
          placeholder="Company offsite after lunch, mixed departments"
        />
      </div>

      <div className="field">
        <label htmlFor="audience">Audience (optional)</label>
        <input
          id="audience"
          name="audience"
          defaultValue={defaultAudience}
          minLength={2}
          maxLength={200}
          placeholder="Product, design, ops, and sales teammates"
        />
        <span className="field-help">Leave blank for a general-audience deck.</span>
      </div>

      <div className="field">
        <label htmlFor="theme">Theme</label>
        <input
          id="theme"
          name="theme"
          required
          minLength={2}
          maxLength={120}
          value={themeValue}
          onChange={(event) => {
            setThemeValue(event.target.value);
            setThemeDescription("");
            setThemeStatus("");
          }}
          placeholder="The future of workplace snacks"
        />
        {themeDescription ? <span className="field-help">{themeDescription}</span> : null}
        {themeStatus ? <span className="field-help theme-status">{themeStatus}</span> : null}
      </div>

      <section className="theme-picker" aria-label="Theme picker">
        <div className="theme-picker-header">
          <div>
            <h2>Browse prompts</h2>
            <p>Pick a tested theme, filter the list, or type your own above.</p>
          </div>
          <button className="button secondary" type="button" onClick={randomizeTheme}>
            <Shuffle size={17} aria-hidden="true" />
            Randomize
          </button>
        </div>

        <div className="theme-filters">
          <label>
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ThemeCategory | "All")}
            >
              <option value="All">All categories</option>
              {themeCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Audience</span>
            <select
              value={audienceFilter}
              onChange={(event) => setAudienceFilter(event.target.value as AudienceHint | "all")}
            >
              <option value="all">Any audience</option>
              {Object.entries(audienceLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="theme-results">
          {filteredThemes.slice(0, 18).map((option) => (
            <button
              className={themeValue === option.theme ? "theme-card selected" : "theme-card"}
              key={`${option.category}-${option.theme}`}
              type="button"
              onClick={() => selectTheme(option)}
            >
              <strong>{option.theme}</strong>
              <span>{option.desc}</span>
              <small>
                {option.category} · {option.workSafeLevel === "safe" ? "work-safe" : "edgier"}
              </small>
            </button>
          ))}
        </div>
      </section>

      <fieldset className="field">
        <legend className="radio-label">Tone</legend>
        <div className="radio-grid">
          {tones.map((option) => (
            <label className="tone-option" key={option}>
              <input
                type="radio"
                name="tone"
                value={option}
                checked={tone === option}
                onChange={() => setTone(option)}
              />
              <span>{toneLabels[option]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="slideCount">Slides</label>
        <div className="slider-row">
          <input
            id="slideCount"
            name="slideCount"
            type="range"
            min="5"
            max="10"
            value={slideCount}
            onChange={(event) => setSlideCount(Number(event.target.value))}
          />
          <strong>{slideCount}</strong>
        </div>
        <span className="field-help">5 slides is the quick default; use up to 10 for a longer round.</span>
      </div>

      <div className="field">
        <label htmlFor="insideJokes">Inside jokes (optional)</label>
        <textarea
          id="insideJokes"
          name="insideJokes"
          maxLength={300}
          placeholder="The printer incident, too many status colors, mysterious banana budget"
        />
        <span className="field-help">Add a few light references, or skip this entirely.</span>
      </div>

      <label className="form-toggle-row">
        <input
          type="checkbox"
          checked={noWords}
          onChange={(event) => setNoWords(event.target.checked)}
        />
        <span>
          <strong>Simple mode</strong>
          <small>Slides keep their shape with a short heading, tiny labels, and fewer distractions.</small>
        </span>
      </label>

      {error ? <p className="form-error">{error}</p> : null}
      {isSubmitting ? <p className="generation-progress">{progressMessages[progressStep]}</p> : null}

      <button className="button accent" type="submit" disabled={isSubmitting}>
        <WandSparkles size={18} aria-hidden="true" />
        {isSubmitting ? "Building your surprise deck..." : "Generate surprise deck"}
      </button>
    </form>
  );
}
