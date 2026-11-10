/**
 * Plot primitives.
 *
 * Every figure is inline SVG on a 720x360 grid so it scales with the content
 * column, prints at any size, and keeps its colours in theme tokens. When the
 * compiler emits a portal it inlines a matplotlib SVG instead; the framing,
 * caption, and caption numbering are the parts shared with that path.
 */

const W = 720;
const H = 360;
const PAD = {top: 24, right: 24, bottom: 40, left: 56};

function frame(children: React.ReactNode, label: string) {
  return (
    <svg
      className="figure-frame"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}>
      {children}
    </svg>
  );
}

/** Grouped bar chart: two conditions across five trials. */
export function BarChart() {
  const groups = ['T1', 'T2', 'T3', 'T4', 'T5'];
  const a = [0.62, 0.71, 0.68, 0.79, 0.83];
  const b = [0.54, 0.58, 0.66, 0.7, 0.74];
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / groups.length;
  const barW = slot * 0.28;

  return frame(
    <>
      <g className="grid">
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + plotH * t}
            y2={PAD.top + plotH * t}
          />
        ))}
      </g>
      <line
        className="axis"
        x1={PAD.left}
        x2={W - PAD.right}
        y1={PAD.top + plotH}
        y2={PAD.top + plotH}
      />
      {groups.map((label, i) => {
        const x = PAD.left + slot * i + slot / 2;
        const hA = plotH * a[i];
        const hB = plotH * b[i];
        return (
          <g key={label}>
            <rect
              className="bar"
              x={x - barW - 2}
              y={PAD.top + plotH - hA}
              width={barW}
              height={hA}
            />
            <rect
              className="bar-accent"
              x={x + 2}
              y={PAD.top + plotH - hB}
              width={barW}
              height={hB}
            />
            <text x={x} y={H - PAD.bottom + 20} textAnchor="middle">
              {label}
            </text>
          </g>
        );
      })}
      <text x={PAD.left} y={PAD.top - 8}>
        accuracy
      </text>
      <text x={W - PAD.right} y={H - 6} textAnchor="end">
        trial · baseline vs treatment
      </text>
    </>,
    'Grouped bar chart of accuracy per trial for two conditions',
  );
}

/** Scatter with a fitted trend, the shape a correlation report needs. */
export function ScatterPlot() {
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const points = [
    [0.08, 0.18], [0.14, 0.24], [0.2, 0.2], [0.27, 0.36], [0.31, 0.3],
    [0.38, 0.44], [0.44, 0.4], [0.5, 0.55], [0.55, 0.5], [0.6, 0.62],
    [0.66, 0.58], [0.72, 0.7], [0.78, 0.66], [0.84, 0.82], [0.9, 0.78],
  ] as const;
  const px = (v: number) => PAD.left + v * plotW;
  const py = (v: number) => PAD.top + plotH - v * plotH;

  return frame(
    <>
      <g className="grid">
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + plotH * t}
            y2={PAD.top + plotH * t}
          />
        ))}
      </g>
      <line className="axis" x1={PAD.left} x2={W - PAD.right} y1={py(0)} y2={py(0)} />
      <line className="axis" x1={px(0)} x2={px(0)} y1={PAD.top} y2={py(0)} />
      <polyline
        className="trend"
        points={`${px(0.05)},${py(0.14)} ${px(0.95)},${py(0.84)}`}
      />
      {points.map(([x, y], i) => (
        <circle key={i} className="dot" cx={px(x)} cy={py(y)} r={4} />
      ))}
      <text x={PAD.left} y={PAD.top - 8}>
        throughput
      </text>
      <text x={W - PAD.right} y={H - 6} textAnchor="end">
        batch size · r² = 0.94
      </text>
    </>,
    'Scatter plot of throughput against batch size with a fitted trend line',
  );
}

/** Cluster view: the 2D projection a latent-space report shows. */
export function ClusterPlot() {
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const px = (v: number) => PAD.left + v * plotW;
  const py = (v: number) => PAD.top + plotH - v * plotH;

  const clusters: Array<{cls: string; cx: number; cy: number; pts: Array<[number, number]>}> = [
    {
      cls: 'cluster-a',
      cx: 0.28,
      cy: 0.62,
      pts: [[0.22, 0.66], [0.3, 0.58], [0.26, 0.7], [0.34, 0.64], [0.24, 0.6]],
    },
    {
      cls: 'cluster-b',
      cx: 0.62,
      cy: 0.34,
      pts: [[0.56, 0.38], [0.64, 0.3], [0.6, 0.42], [0.68, 0.34], [0.58, 0.28]],
    },
    {
      cls: 'cluster-c',
      cx: 0.8,
      cy: 0.72,
      pts: [[0.74, 0.76], [0.82, 0.68], [0.78, 0.8], [0.86, 0.72], [0.76, 0.7]],
    },
  ];

  return frame(
    <>
      <g className="grid">
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + plotH * t}
            y2={PAD.top + plotH * t}
          />
        ))}
      </g>
      <line className="axis" x1={PAD.left} x2={W - PAD.right} y1={py(0)} y2={py(0)} />
      <line className="axis" x1={px(0)} x2={px(0)} y1={PAD.top} y2={py(0)} />
      {clusters.map(cluster => (
        <g key={cluster.cls}>
          {cluster.pts.map(([x, y], i) => (
            <circle
              key={i}
              className={cluster.cls}
              cx={px(x)}
              cy={py(y)}
              r={5}
              opacity={0.85}
            />
          ))}
          <text x={px(cluster.cx)} y={py(cluster.cy) - 14} textAnchor="middle">
            n=5
          </text>
        </g>
      ))}
      <text x={PAD.left} y={PAD.top - 8}>
        dim 2
      </text>
      <text x={W - PAD.right} y={H - 6} textAnchor="end">
        dim 1 · three clusters, k=3
      </text>
    </>,
    'Two dimensional projection with three labelled clusters',
  );
}
