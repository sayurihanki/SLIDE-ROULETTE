import type { CSSProperties, ReactNode } from "react";
import type { VisualData, VisualType } from "@/lib/deck";

export function renderVisual(
  type: VisualType,
  data: VisualData,
  wordless = false,
): ReactNode {
  if (wordless) {
    return <WordlessVisual type={type} data={data} />;
  }

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
    case "swimlane":
      return <Swimlane data={data} />;
    case "sankey":
      return <Sankey data={data} />;
    case "gauge_row":
      return <GaugeRow data={data} />;
    case "stacked_bar":
      return <StackedBar data={data} />;
    case "pie_callout":
      return <PieCallout data={data} />;
    case "scatter_plot":
      return <ScatterPlot data={data} />;
    case "waterfall":
      return <Waterfall data={data} />;
    case "gantt":
      return <Gantt data={data} />;
    case "donut_progress":
      return <DonutProgress data={data} />;
    case "lollipop_chart":
      return <LollipopChart data={data} />;
    case "slope_chart":
      return <SlopeChart data={data} />;
    case "bubble_map":
      return <BubbleMap data={data} />;
    case "decision_tree":
      return <DecisionTree data={data} />;
    case "fishbone":
      return <Fishbone data={data} />;
    case "swot_grid":
      return <SwotGrid data={data} />;
    case "journey_map":
      return <JourneyMap data={data} />;
    case "calendar_strip":
      return <CalendarStrip data={data} />;
    case "ranking_ladder":
      return <RankingLadder data={data} />;
    case "traffic_light":
      return <TrafficLight data={data} />;
    case "sticky_wall":
      return <StickyWall data={data} />;
  }
}

function WordlessVisual({ type, data }: { type: VisualType; data: VisualData }) {
  const values = ensureValues(data.values, 8);
  const value = (index: number, min = 0, span = 100) => min + (values[index % values.length] % span);
  const barHeight = (index: number) => 34 + (values[index % values.length] % 118);

  switch (type) {
    case "venn":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <circle className="wordless-fill-a" cx="158" cy="122" r={74 + value(0, 0, 20)} />
          <circle className="wordless-fill-b" cx="260" cy="122" r={70 + value(1, 0, 22)} />
          <circle className="wordless-fill-c" cx="212" cy="172" r={58 + value(2, 0, 18)} />
        </svg>
      );
    case "comparison_table":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <rect
              className={index < 2 ? "wordless-fill-accent" : "wordless-fill-a"}
              key={index}
              x={54 + (index % 2) * 160}
              y={48 + Math.floor(index / 2) * 88}
              width={126 + value(index, 0, 22)}
              height="58"
              rx="12"
            />
          ))}
          <path className="wordless-stroke" d="M210 36 V224 M44 130 H376" />
        </svg>
      );
    case "before_after":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <rect className="wordless-fill-a" x="42" y="64" width="112" height="130" rx="16" />
          <path className="wordless-stroke" d="M178 130 H244" />
          <path className="wordless-fill-accent" d="M244 130 L218 112 V148 Z" />
          <rect className="wordless-fill-accent" x="268" y="48" width="112" height="158" rx="16" />
          <circle className="wordless-fill-b" cx="98" cy="130" r={22 + value(0, 0, 18)} />
          <circle className="wordless-fill-b" cx="324" cy="128" r={32 + value(1, 0, 22)} />
        </svg>
      );
    case "quadrant":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <path className="wordless-stroke" d="M210 28 V232 M42 130 H378" />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <circle
              className={index % 3 === 0 ? "wordless-fill-accent" : index % 2 ? "wordless-fill-a" : "wordless-fill-b"}
              key={index}
              cx={70 + value(index, 0, 280)}
              cy={42 + value(index + 3, 0, 170)}
              r={12 + value(index + 1, 0, 18)}
            />
          ))}
        </svg>
      );
    case "flowchart":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <rect
              className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"}
              key={index}
              x={36 + index * 94}
              y={84 + (index % 2) * 28}
              width="66"
              height="58"
              rx="14"
            />
          ))}
          <path className="wordless-stroke" d="M102 114 H130 V142 H160 M226 142 H254 V114 H290" />
          <path className="wordless-fill-b" d="M160 142 L140 130 V154 Z M290 114 L270 102 V126 Z" />
        </svg>
      );
    case "funnel":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => {
            const inset = 44 + index * 32;
            return (
              <path
                className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"}
                key={index}
                d={`M${inset} ${42 + index * 46} H${420 - inset} L${376 - inset / 2} ${78 + index * 46} H${44 + inset / 2} Z`}
              />
            );
          })}
        </svg>
      );
    case "cycle":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <path className="wordless-stroke" d="M210 52 A78 78 0 1 1 132 130 M210 52 L184 42 M210 52 L202 80" />
          <path className="wordless-stroke" d="M210 208 A78 78 0 1 1 288 130 M210 208 L236 218 M210 208 L218 180" />
          {[0, 1, 2, 3].map((index) => (
            <circle
              className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"}
              key={index}
              cx={[210, 294, 210, 126][index]}
              cy={[54, 130, 206, 130][index]}
              r={22 + value(index, 0, 8)}
            />
          ))}
        </svg>
      );
    case "timeline":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <path className="wordless-stroke" d="M48 132 H372" />
          {[0, 1, 2, 3, 4].map((index) => (
            <g key={index}>
              <circle className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"} cx={62 + index * 74} cy="132" r={16 + value(index, 0, 12)} />
              <rect className="wordless-fill-b" x={48 + index * 74} y={68 + (index % 2) * 96} width="28" height="42" rx="8" />
            </g>
          ))}
        </svg>
      );
    case "hierarchy":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <rect className="wordless-fill-accent" x="156" y="34" width="108" height="58" rx="14" />
          <path className="wordless-stroke" d="M210 92 V132 M92 132 H328 M92 132 V164 M210 132 V164 M328 132 V164" />
          {[0, 1, 2].map((index) => (
            <rect className={index % 2 ? "wordless-fill-a" : "wordless-fill-b"} key={index} x={50 + index * 118} y="164" width="84" height="56" rx="14" />
          ))}
        </svg>
      );
    case "pyramid":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <path
              className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"}
              key={index}
              d={`M${170 - index * 28} ${48 + index * 44} H${250 + index * 28} L${278 + index * 28} ${84 + index * 44} H${142 - index * 28} Z`}
            />
          ))}
        </svg>
      );
    case "network":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <path className="wordless-stroke" d="M210 130 L94 70 M210 130 L324 74 M210 130 L106 202 M210 130 L330 198 M94 70 L324 74" />
          {[{ x: 210, y: 130 }, { x: 94, y: 70 }, { x: 324, y: 74 }, { x: 106, y: 202 }, { x: 330, y: 198 }].map((point, index) => (
            <circle className={index === 0 ? "wordless-fill-accent" : index % 2 ? "wordless-fill-a" : "wordless-fill-b"} key={index} cx={point.x} cy={point.y} r={22 + value(index, 0, 10)} />
          ))}
        </svg>
      );
    case "dashboard":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <g key={index}>
              <rect className="wordless-panel" x={46 + (index % 2) * 170} y={34 + Math.floor(index / 2) * 104} width="138" height="78" rx="14" />
              <rect className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"} x={66 + (index % 2) * 170} y={78 + Math.floor(index / 2) * 104} width={44 + value(index, 0, 72)} height="12" rx="6" />
              <circle className="wordless-fill-b" cx={96 + (index % 2) * 170} cy={60 + Math.floor(index / 2) * 104} r={12 + value(index + 2, 0, 10)} />
            </g>
          ))}
        </svg>
      );
    case "radar": {
      const points = values.slice(0, 5).map((item, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / 5;
        const radius = 32 + item * 0.74;
        return `${210 + Math.cos(angle) * radius},${130 + Math.sin(angle) * radius}`;
      }).join(" ");
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <polygon className="wordless-stroke-fill" points="210,32 304,100 268,210 152,210 116,100" />
          <polygon className="wordless-fill-accent wordless-radar" points={points} />
        </svg>
      );
    }
    case "heat_matrix":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <rect
              className={index % 3 === 0 ? "wordless-fill-accent" : index % 2 ? "wordless-fill-a" : "wordless-fill-b"}
              key={index}
              x={58 + (index % 4) * 78}
              y={42 + Math.floor(index / 4) * 58}
              width="58"
              height="42"
              rx="8"
              style={{ opacity: 0.3 + value(index, 0, 58) / 100 }}
            />
          ))}
        </svg>
      );
    case "canvas":
    case "bento":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <rect className="wordless-fill-accent" x="44" y="36" width="154" height="82" rx="16" />
          <rect className="wordless-fill-a" x="216" y="36" width="70" height="82" rx="16" />
          <rect className="wordless-fill-b" x="304" y="36" width="70" height="82" rx="16" />
          <rect className="wordless-panel" x="44" y="138" width="86" height="78" rx="16" />
          <rect className="wordless-fill-a" x="146" y="138" width="228" height="78" rx="16" />
        </svg>
      );
    case "isometric":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <path
              className={index % 3 === 0 ? "wordless-fill-accent" : index % 2 ? "wordless-fill-a" : "wordless-fill-b"}
              key={index}
              d={`M${132 + index * 28} ${58 + index * 34} L${230 + index * 28} ${30 + index * 34} L${296 + index * 28} ${62 + index * 34} L${198 + index * 28} ${92 + index * 34} Z`}
            />
          ))}
        </svg>
      );
    case "swimlane":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <g key={index}>
              <rect className="wordless-panel" x="42" y={40 + index * 48} width="336" height="34" rx="10" />
              <rect className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"} x={62 + index * 18} y={49 + index * 48} width={188 - index * 18 + value(index, 0, 48)} height="16" rx="8" />
            </g>
          ))}
        </svg>
      );
    case "sankey":
      return (
        <svg className="visual-svg wordless-svg wordless-sankey" viewBox="0 0 420 260" aria-hidden="true">
          <path className="wordless-flow-a" d="M46 68 C150 68 168 128 276 128 S338 70 378 70" />
          <path className="wordless-flow-b" d="M46 190 C150 190 168 128 276 128 S338 190 378 190" />
          <circle className="wordless-fill-accent" cx="276" cy="128" r={24 + value(0, 0, 18)} />
        </svg>
      );
    case "gauge_row":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <g key={index} transform={`translate(${52 + index * 112} 76)`}>
              <path className="wordless-stroke" d="M10 78 A48 48 0 0 1 106 78" />
              <path className={index % 2 ? "wordless-stroke-a" : "wordless-stroke-accent"} d={`M10 78 A48 48 0 0 1 ${58 + value(index, 8, 44)} ${30 + value(index + 1, 0, 42)}`} />
              <circle className="wordless-fill-b" cx="58" cy="78" r="8" />
            </g>
          ))}
        </svg>
      );
    case "stacked_bar":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <g key={row}>
              {[0, 1, 2, 3].map((index) => (
                <rect
                  className={index % 3 === 0 ? "wordless-fill-accent" : index % 2 ? "wordless-fill-a" : "wordless-fill-b"}
                  key={index}
                  x={54 + index * 74}
                  y={62 + row * 54}
                  width={42 + value(index + row, 0, 26)}
                  height="30"
                  rx="8"
                />
              ))}
            </g>
          ))}
        </svg>
      );
    case "pie_callout":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <circle className="wordless-fill-a" cx="150" cy="130" r="78" />
          <path className="wordless-fill-accent" d="M150 130 L150 52 A78 78 0 0 1 224 154 Z" />
          <path className="wordless-fill-b" d="M150 130 L224 154 A78 78 0 0 1 116 200 Z" />
          <path className="wordless-stroke" d="M226 88 H344 M240 132 H368 M222 178 H338" />
          <circle className="wordless-fill-accent" cx="344" cy="88" r="10" />
          <circle className="wordless-fill-a" cx="368" cy="132" r="10" />
          <circle className="wordless-fill-b" cx="338" cy="178" r="10" />
        </svg>
      );
    case "scatter_plot":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          <path className="wordless-stroke" d="M54 218 V38 M54 218 H374" />
          {Array.from({ length: 11 }, (_, index) => (
            <circle
              className={index % 3 === 0 ? "wordless-fill-accent" : index % 2 ? "wordless-fill-a" : "wordless-fill-b"}
              key={index}
              cx={74 + value(index, 0, 276)}
              cy={54 + value(index + 2, 0, 142)}
              r={7 + value(index + 4, 0, 11)}
            />
          ))}
        </svg>
      );
    case "waterfall":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((index) => (
            <rect
              className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"}
              key={index}
              x={58 + index * 62}
              y={206 - barHeight(index)}
              width="42"
              height={barHeight(index)}
              rx="8"
            />
          ))}
          <path className="wordless-stroke" d="M100 134 H120 M162 98 H182 M224 156 H244 M286 82 H306" />
        </svg>
      );
    case "gantt":
      return (
        <svg className="visual-svg wordless-svg" viewBox="0 0 420 260" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <g key={index}>
              <rect className="wordless-panel" x="44" y={48 + index * 44} width="332" height="24" rx="8" />
              <rect
                className={index % 2 ? "wordless-fill-a" : "wordless-fill-accent"}
                x={64 + value(index, 0, 112)}
                y={52 + index * 44}
                width={92 + value(index + 2, 0, 72)}
                height="16"
                rx="8"
              />
            </g>
          ))}
        </svg>
      );
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
  const notes = ensureLabels(data.notes, 4, "Note");

  return (
    <div className="visual-table">
      {labels.slice(0, 4).map((label, index) => (
        <div className={index < 2 ? "table-head" : ""} key={label}>
          <strong>{label}</strong>
          <span>{notes[index]}</span>
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
        <span>{labels[0]}</span>
        <strong>{labels[2]}</strong>
      </div>
      <b aria-hidden="true">-&gt;</b>
      <div>
        <span>{labels[1]}</span>
        <strong>{data.notes[0] || labels[1]}</strong>
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

function Swimlane({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="swimlane-visual">
      {labels.slice(0, 4).map((label, index) => (
        <div key={label}>
          <strong>{label}</strong>
          <span style={{ width: `${72 - index * 8}%` }} />
        </div>
      ))}
    </div>
  );
}

function Sankey({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <svg className="visual-svg sankey-svg" viewBox="0 0 420 260" role="img">
      <path d="M44 80 C150 80 162 128 270 128 S330 80 382 80" />
      <path d="M44 178 C150 178 164 128 270 128 S330 178 382 178" />
      <text x="64" y="68">{labels[0]}</text>
      <text x="68" y="202">{labels[1]}</text>
      <text x="226" y="118">{labels[2]}</text>
      <text x="346" y="132">{labels[3]}</text>
    </svg>
  );
}

function GaugeRow({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 3);
  const values = ensureValues(data.values, 3);

  return (
    <div className="gauge-row-visual">
      {labels.slice(0, 3).map((label, index) => (
        <div key={label}>
          <svg viewBox="0 0 120 76" role="img">
            <path d="M18 62 A42 42 0 0 1 102 62" />
            <path className="gauge-fill" d="M18 62 A42 42 0 0 1 102 62" style={{ strokeDashoffset: 132 - values[index] * 1.32 }} />
          </svg>
          <strong>{values[index]}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function StackedBar({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);
  const values = ensureValues(data.values, 4);

  return (
    <div className="stacked-bar-visual">
      <div>
        {labels.slice(0, 4).map((label, index) => (
          <span key={label} style={{ width: `${Math.max(14, values[index])}%` }}>
            {label}
          </span>
        ))}
      </div>
      <ul>
        {labels.slice(0, 4).map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  );
}

function PieCallout({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);

  return (
    <div className="pie-callout-visual">
      <div className="pie-shape" />
      <div>
        {labels.slice(0, 4).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function ScatterPlot({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);
  const values = ensureValues(data.values, 8);

  return (
    <div className="scatter-visual">
      {labels.slice(0, 4).map((label, index) => (
        <span
          key={label}
          style={{
            left: `${12 + (values[index] % 68)}%`,
            bottom: `${12 + (values[index + 4] % 68)}%`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function Waterfall({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);
  const values = ensureValues(data.values, 5);

  return (
    <div className="waterfall-visual">
      {labels.slice(0, 5).map((label, index) => (
        <span key={label} style={{ height: `${32 + (values[index] % 56)}%` }}>
          {label}
        </span>
      ))}
    </div>
  );
}

function Gantt({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);
  const values = ensureValues(data.values, 4);

  return (
    <div className="gantt-visual">
      {labels.slice(0, 4).map((label, index) => (
        <div key={label}>
          <strong>{label}</strong>
          <span style={{ marginLeft: `${index * 10}%`, width: `${34 + (values[index] % 28)}%` }} />
        </div>
      ))}
    </div>
  );
}

function DonutProgress({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 3);
  const values = ensureValues(data.values, 3);

  return (
    <div className="donut-progress-visual">
      {labels.slice(0, 3).map((label, index) => (
        <div
          key={`${label}-${index}`}
          style={{ "--progress": `${Math.max(8, values[index])}%` } as CSSProperties}
        >
          <span />
          <strong>{values[index]}%</strong>
          <em>{label}</em>
        </div>
      ))}
    </div>
  );
}

function LollipopChart({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);
  const values = ensureValues(data.values, 5);

  return (
    <div className="lollipop-visual">
      {labels.slice(0, 5).map((label, index) => (
        <div key={`${label}-${index}`}>
          <span style={{ height: `${28 + (values[index] % 62)}%` }} />
          <strong>{label}</strong>
        </div>
      ))}
    </div>
  );
}

function SlopeChart({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);
  const values = ensureValues(data.values, 8);
  const rows = labels.slice(0, 4).map((label, index) => {
    const start = 48 + (values[index] % 142);
    const end = 48 + (values[index + 4] % 142);
    return { label, start, end };
  });

  return (
    <svg className="visual-svg slope-svg" viewBox="0 0 420 260" role="img">
      <path className="slope-axis" d="M92 38 V220 M328 38 V220" />
      {rows.map((row, index) => (
        <g key={`${row.label}-${index}`}>
          <path d={`M92 ${row.start} L328 ${row.end}`} />
          <circle cx="92" cy={row.start} r="8" />
          <circle cx="328" cy={row.end} r="8" />
          <text x="208" y={(row.start + row.end) / 2 - 6}>{shortLabel(row.label, 18)}</text>
        </g>
      ))}
    </svg>
  );
}

function BubbleMap({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 6);
  const values = ensureValues(data.values, 6);

  return (
    <div className="bubble-map-visual">
      {labels.slice(0, 6).map((label, index) => (
        <span
          className={`bubble-${index + 1}`}
          key={`${label}-${index}`}
          style={{ "--bubble-size": `${54 + (values[index] % 58)}px` } as CSSProperties}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function DecisionTree({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);

  return (
    <div className="decision-tree-visual">
      <strong>{labels[0]}</strong>
      <div>
        {labels.slice(1, 3).map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <div>
        {labels.slice(3, 5).map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function Fishbone({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);

  return (
    <svg className="visual-svg fishbone-svg" viewBox="0 0 420 260" role="img">
      <path className="fishbone-spine" d="M52 132 H350 L378 104 M350 132 L378 160" />
      {labels.slice(0, 4).map((label, index) => {
        const x = 112 + index * 58;
        const up = index % 2 === 0;
        return (
          <g key={`${label}-${index}`}>
            <path d={`M${x} 132 L${x + 34} ${up ? 72 : 192}`} />
            <text x={x + 48} y={up ? 68 : 204}>{shortLabel(label, 16)}</text>
          </g>
        );
      })}
      <text className="fishbone-head" x="338" y="96">{shortLabel(labels[4], 15)}</text>
    </svg>
  );
}

function SwotGrid({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 4);
  const quadrants = ["S", "W", "O", "T"];

  return (
    <div className="swot-grid-visual">
      {labels.slice(0, 4).map((label, index) => (
        <span key={`${label}-${index}`}>
          <strong>{quadrants[index]}</strong>
          {label}
        </span>
      ))}
    </div>
  );
}

function JourneyMap({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);
  const values = ensureValues(data.values, 5);

  return (
    <div className="journey-map-visual">
      {labels.slice(0, 5).map((label, index) => (
        <span key={`${label}-${index}`} style={{ transform: `translateY(${(values[index] % 34) - 17}px)` }}>
          {label}
        </span>
      ))}
    </div>
  );
}

function CalendarStrip({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);
  const values = ensureValues(data.values, 5);

  return (
    <div className="calendar-strip-visual">
      {labels.slice(0, 5).map((label, index) => (
        <span key={`${label}-${index}`} style={{ opacity: 0.56 + (values[index] % 44) / 100 }}>
          <strong>{index + 1}</strong>
          {label}
        </span>
      ))}
    </div>
  );
}

function RankingLadder({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 5);

  return (
    <div className="ranking-ladder-visual">
      {labels.slice(0, 5).map((label, index) => (
        <span key={`${label}-${index}`} style={{ width: `${96 - index * 10}%` }}>
          <strong>{index + 1}</strong>
          {label}
        </span>
      ))}
    </div>
  );
}

function TrafficLight({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 3);

  return (
    <div className="traffic-light-visual">
      {labels.slice(0, 3).map((label, index) => (
        <span className={`traffic-${index + 1}`} key={`${label}-${index}`}>
          <i />
          <strong>{label}</strong>
        </span>
      ))}
    </div>
  );
}

function StickyWall({ data }: { data: VisualData }) {
  const labels = ensureLabels(data.labels, 6);

  return (
    <div className="sticky-wall-visual">
      {labels.slice(0, 6).map((label, index) => (
        <span key={`${label}-${index}`}>{label}</span>
      ))}
    </div>
  );
}

function ensureLabels(labels: string[], count: number, prefix = "Label"): string[] {
  return Array.from({ length: count }, (_, index) => labels[index] || `${prefix} ${index + 1}`);
}

function ensureValues(values: number[], count: number): number[] {
  const defaults = [74, 56, 88, 41, 67, 92, 35, 63, 79];
  return Array.from({ length: count }, (_, index) => values[index] ?? defaults[index]);
}

function shortLabel(label: string, maxLength: number): string {
  return label.length <= maxLength ? label : `${label.slice(0, Math.max(4, maxLength - 3)).trim()}...`;
}
