import React, { useState } from 'react';

const weekData = [
  { day: 'Mon', thisWeek: 88000, lastWeek: 71000 },
  { day: 'Tue', thisWeek: 95000, lastWeek: 84000 },
  { day: 'Wed', thisWeek: 90000, lastWeek: 92000 },
  { day: 'Thu', thisWeek: 110000, lastWeek: 89000 },
  { day: 'Fri', thisWeek: 130000, lastWeek: 120000 },
  { day: 'Sat', thisWeek: 125000, lastWeek: 118000 },
  { day: 'Sun', thisWeek: 108000, lastWeek: 98000 },
];

const MAX_VAL = 150000;
const CHART_W = 600;
const CHART_H = 220;

function toX(i: number, total: number) {
  return (i / (total - 1)) * CHART_W;
}

function toY(val: number) {
  return CHART_H - (val / MAX_VAL) * CHART_H;
}

function formatINR(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
}

export function RevenueChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(4);
  const pts = weekData.length;

  const thisWeekPath = weekData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i, pts)},${toY(d.thisWeek)}`)
    .join(' ');

  const lastWeekPath = weekData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i, pts)},${toY(d.lastWeek)}`)
    .join(' ');

  const fillPath =
    thisWeekPath +
    ` L${toX(pts - 1, pts)},${CHART_H} L0,${CHART_H} Z`;

  const yLabels = [
    { label: '₹1.5L', val: 150000 },
    { label: '₹1.2L', val: 120000 },
    { label: '₹90K',  val: 90000  },
    { label: '₹60K',  val: 60000  },
    { label: '₹30K',  val: 30000  },
    { label: '₹0',    val: 0      },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Revenue Overview</h3>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg width="24" height="2" viewBox="0 0 24 2">
              <line x1="0" y1="1" x2="24" y2="1" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            </svg>
            This Week
          </span>
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg width="24" height="2" viewBox="0 0 24 2">
              <line
                x1="0" y1="1" x2="24" y2="1"
                stroke="#9ca3af" strokeWidth="2"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            </svg>
            Last Week
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ height: CHART_H, overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="revFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
            </linearGradient>
            <clipPath id="chartClip">
              <rect x="0" y="0" width={CHART_W} height={CHART_H} />
            </clipPath>
          </defs>

          {/* Y-axis labels */}
          {yLabels.map(({ label, val }) => (
            <text
              key={label}
              x={-8}
              y={toY(val) + (val === 0 ? 0 : 4)}
              textAnchor="end"
              fontSize="11"
              fill="#9ca3af"
              fontFamily="system-ui, sans-serif"
              dominantBaseline={val === 0 ? 'auto' : 'middle'}
            >
              {label}
            </text>
          ))}

          {/* Horizontal grid lines */}
          {yLabels.map(({ val }) => (
            <line
              key={val}
              x1="0" x2={CHART_W}
              y1={toY(val)} y2={toY(val)}
              stroke="#e5e7eb"
              strokeWidth="0.8"
            />
          ))}

          {/* Area fill */}
          <path d={fillPath} fill="url(#revFillGrad)" clipPath="url(#chartClip)" />

          {/* Last week dashed line */}
          <path
            d={lastWeekPath}
            fill="none"
            stroke="#d1d5db"
            strokeWidth="1.8"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* This week solid line */}
          <path
            d={thisWeekPath}
            fill="none"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover interaction layer */}
          {weekData.map((d, i) => {
            const cx = toX(i, pts);
            const cy = toY(d.thisWeek);
            const isHovered = hoveredIdx === i;

            // Tooltip sizing in SVG units
            const tooltipW = 72;
            const tooltipH = 26;
            const tooltipR = 6;
            const arrowSize = 5;

            // Clamp tooltip X so it stays within chart
            let tx = cx - tooltipW / 2;
            if (tx < 0) tx = 0;
            if (tx + tooltipW > CHART_W) tx = CHART_W - tooltipW;

            // Position tooltip above the point
            const tooltipY = cy - tooltipH - arrowSize - 8;
            const clampedTooltipY = Math.max(0, tooltipY);

            // Arrow tip X stays at cx, clamped
            const arrowTipX = Math.min(Math.max(cx, tx + 12), tx + tooltipW - 12);

            return (
              <g key={i}>
                {/* Hit area */}
                <rect
                  x={cx - (CHART_W / pts) / 2}
                  y={0}
                  width={CHART_W / pts}
                  height={CHART_H}
                  fill="transparent"
                  style={{ cursor: 'crosshair' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Vertical dotted line */}
                {isHovered && (
                  <line
                    x1={cx} x2={cx}
                    y1={0} y2={CHART_H}
                    stroke="#f97316"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                )}

                {/* Data point — crisp circle */}
                {isHovered ? (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="#f97316"
                    stroke="white"
                    strokeWidth="2"
                    style={{ pointerEvents: 'none' }}
                  />
                ) : (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill="#f97316"
                    stroke="white"
                    strokeWidth="1.5"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Tooltip */}
                {isHovered && (
                  <g style={{ pointerEvents: 'none' }}>
                    {/* Tooltip background */}
                    <rect
                      x={tx}
                      y={clampedTooltipY}
                      width={tooltipW}
                      height={tooltipH}
                      rx={tooltipR}
                      ry={tooltipR}
                      fill="#111827"
                    />

                    {/* Arrow */}
                    <polygon
                      points={`
                        ${arrowTipX - arrowSize},${clampedTooltipY + tooltipH}
                        ${arrowTipX + arrowSize},${clampedTooltipY + tooltipH}
                        ${arrowTipX},${clampedTooltipY + tooltipH + arrowSize}
                      `}
                      fill="#111827"
                    />

                    {/* Tooltip text */}
                    <text
                      x={tx + tooltipW / 2}
                      y={clampedTooltipY + tooltipH / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="white"
                      fontFamily="system-ui, sans-serif"
                    >
                      {formatINR(d.thisWeek)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div
          className="flex justify-between mt-2 px-0 text-sm text-gray-400 dark:text-gray-500"
          style={{ paddingLeft: 0 }}
        >
          {weekData.map((d) => (
            <span
              key={d.day}
              className="flex-1 text-center"
            >
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}