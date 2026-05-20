"use client";

import type { CSSProperties, ReactNode } from "react";
import type { KaraokeSlide, VisualData, VisualType } from "@/lib/deck";

type SlideVisualProps = {
  slide: KaraokeSlide;
};

export function SlideVisual({ slide }: SlideVisualProps) {
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
      className={`slide-visual visual-${visualVariant}`}
      style={style}
      aria-label={slide.visualLabel}
    >
      <figcaption>{slide.visualData.title}</figcaption>
      {renderVisual(slide.visualType, slide.visualData)}
    </figure>
  );
}

function renderVisual(type: VisualType, data: VisualData): ReactNode {
  switch (type) {
    case "venn":
      return <Venn data={data} />;
    case "comparison_table":
      return <ComparisonTable data={data} />;
    case "before_after":
      return <BeforeAfter data={data} />;
    case "quadrant":
      return <Quadrant data={data} />;
    case "flowchart":
      return <Flowchart data={data} />;
    case "funnel":
      return <Funnel data={data} />;
    case "cycle":
      return <Cycle data={data} />;
    case "timeline":
      return <Timeline data={data} />;
    case "hierarchy":
      return <Hierarchy data={data} />;
    case "pyramid":
      return <Pyramid data={data} />;
    case "network":
      return <Network data={data} />;
    case "dashboard":
      return <Dashboard data={data} />;
    case "radar":
      return <Radar data={data} />;
    case "heat_matrix":
      return <HeatMatrix data={data} />;
    case "canvas":
      return <CanvasGrid data={data} />;
    case "bento":
      return <Bento data={data} />;
    case "isometric":
      return <Isometric data={data} />;
  }
}

function Venn({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 3);

  return (
    <svg className="visual-svg" viewBox="0 0 420 260" role="img">
      <circle className="venn-a" cx="166" cy="126" r="86" />
      <circle className="venn-b" cx="252" cy="126" r="86" />
      <circle className="venn-c" cx="210" cy="174" r="70" />
      <text x="126" y="116">{labels[0]}</text>
      <text x="268" y="116">{labels[1]}</text>
      <text x="210" y="196">{labels[2]}</text>
    </svg>
  );
}

function ComparisonTable({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="visual-table">
      {labels.slice(0, 4).map((label, index) => (
        <div className={index < 2 ? "table-head" : ""} key={label}>
          <strong>{label}</strong>
          <span>{index % 2 === 0 ? "High conviction" : "Medium proof"}</span>
        </div>
      ))}
    </div>
  );
}

function BeforeAfter({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 3);

  return (
    <div className="before-after">
      <div>
        <span>Before</span>
        <strong>{labels[2]}</strong>
      </div>
      <b aria-hidden="true">-&gt;</b>
      <div>
        <span>After</span>
        <strong>{data.notes[0] || "New confidence"}</strong>
      </div>
    </div>
  );
}

function Quadrant({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="quadrant-visual">
      {labels.slice(0, 4).map((label, index) => (
        <span className={`quadrant-dot q${index + 1}`} key={label}>
          {label}
        </span>
      ))}
    </div>
  );
}

function Flowchart({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="flow-visual">
      {labels.slice(0, 4).map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}

function Funnel({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="funnel-visual">
      {labels.slice(0, 4).map((label, index) => (
        <span key={label} style={{ width: `${100 - index * 14}%` }}>
          {label}
        </span>
      ))}
    </div>
  );
}

function Cycle({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="cycle-visual">
      {labels.slice(0, 4).map((label, index) => (
        <span className={`cycle-node c${index + 1}`} key={label}>
          {label}
        </span>
      ))}
    </div>
  );
}

function Timeline({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="timeline-visual">
      {labels.slice(0, 4).map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}

function Hierarchy({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="hierarchy-visual">
      <strong>{labels[0]}</strong>
      <div>
        {labels.slice(1, 4).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function Pyramid({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="pyramid-visual">
      {labels.slice(0, 4).map((label, index) => (
        <span key={label} style={{ width: `${44 + index * 16}%` }}>
          {label}
        </span>
      ))}
    </div>
  );
}

function Network({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);

  return (
    <svg className="visual-svg network-svg" viewBox="0 0 420 260" role="img">
      <path d="M210 126 L104 72 M210 126 L322 78 M210 126 L112 198 M210 126 L324 198" />
      <NetworkNode x={210} y={126} label={labels[0]} />
      <NetworkNode x={104} y={72} label={labels[1]} />
      <NetworkNode x={322} y={78} label={labels[2]} />
      <NetworkNode x={112} y={198} label={labels[3]} />
      <NetworkNode x={324} y={198} label={labels[4]} />
    </svg>
  );
}

function NetworkNode({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="33" />
      <text x={x} y={y + 4}>{label}</text>
    </g>
  );
}

function Dashboard({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);
  const values = ensureValues(data.values, 4);

  return (
    <div className="dashboard-visual">
      {labels.slice(0, 4).map((label, index) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{values[index]}</strong>
          <i style={{ width: `${values[index]}%` }} />
        </div>
      ))}
    </div>
  );
}

function Radar({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);
  const values = ensureValues(data.values, 5);
  const points = values
    .map((value, index) => {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / values.length;
      const radius = 28 + value * 0.72;
      return `${210 + Math.cos(angle) * radius},${128 + Math.sin(angle) * radius}`;
    })
    .join(" ");

  return (
    <svg className="visual-svg radar-svg" viewBox="0 0 420 260" role="img">
      <polygon points="210,34 302,101 267,210 153,210 118,101" />
      <polygon className="radar-fill" points={points} />
      {labels.slice(0, 5).map((label, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / labels.length;
        return (
          <text key={label} x={210 + Math.cos(angle) * 126} y={132 + Math.sin(angle) * 112}>
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function HeatMatrix({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);
  const values = ensureValues(data.values, 9);

  return (
    <div className="heat-visual">
      {values.slice(0, 9).map((value, index) => (
        <span key={`${value}-${index}`} style={{ opacity: 0.25 + value / 135 }}>
          {index < 4 ? labels[index] : ""}
        </span>
      ))}
    </div>
  );
}

function CanvasGrid({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 6);

  return (
    <div className="canvas-visual">
      {labels.slice(0, 6).map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}

function Bento({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);

  return (
    <div className="bento-visual">
      {labels.slice(0, 5).map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}

function Isometric({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="isometric-visual">
      {labels.slice(0, 4).map((label, index) => (
        <span className={`iso-block i${index + 1}`} key={label}>
          {label}
        </span>
      ))}
    </div>
  );
}

function ensureLabels(labels: string[], count: number): string[] {
  const defaults = ["Signal", "Story", "Proof", "Risk", "Action", "Outcome", "Budget", "Momentum"];
  return Array.from({ length: count }, (_, index) => labels[index] || defaults[index]);
}

function ensureValues(values: number[], count: number): number[] {
  const defaults = [74, 56, 88, 41, 67, 92, 35, 63, 79];
  return Array.from({ length: count }, (_, index) => values[index] ?? defaults[index]);
}
