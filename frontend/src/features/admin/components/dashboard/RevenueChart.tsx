import React from 'react';
import { useDashboardStore } from '../../store/dashboard.store';

export function RevenueChart() {
  const { revenueData } = useDashboardStore();
  const max = Math.max(...revenueData.flatMap((d) => [d.thisWeek, d.lastWeek]));
  const W = 580, H = 160, pad = { top: 20, right: 10, bottom: 24, left: 40 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const xStep = chartW / (revenueData.length - 1);
  const yScale = (v: number) => chartH - (v / max) * chartH;

  const makePath = (key: 'thisWeek' | 'lastWeek') =>
    revenueData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${pad.left + i * xStep},${pad.top + yScale(d[key])}`)
      .join(' ');

  const makeArea = (key: 'thisWeek' | 'lastWeek') => {
    const pts = revenueData.map((d, i) => `${pad.left + i * xStep},${pad.top + yScale(d[key])}`).join(' L ');
    const last = revenueData.length - 1;
    return `M ${pad.left},${pad.top + chartH} L ${pts} L ${pad.left + last * xStep},${pad.top + chartH} Z`;
  };

  // Y axis labels
  const yLabels = [0, 3000, 6000, 9000, 12000, 15000];

  // Peak point for Friday
  const peakIdx = revenueData.findIndex(d => d.day === 'Fri');
  const peakX = pad.left + peakIdx * xStep;
  const peakY = pad.top + yScale(revenueData[peakIdx]?.thisWeek ?? 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Revenue Overview</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />This Week</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" />Last Week</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y grid lines + labels */}
          {yLabels.map((v) => {
            const y = pad.top + yScale(v);
            return (
              <g key={v}>
                <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
                <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">₹{(v / 1000).toFixed(0)}K</text>
              </g>
            );
          })}

          {/* Areas */}
          <path d={makeArea('lastWeek')} fill="url(#grayGrad)" />
          <path d={makeArea('thisWeek')} fill="url(#orangeGrad)" />

          {/* Lines */}
          <path d={makePath('lastWeek')} fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d={makePath('thisWeek')} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots on thisWeek */}
          {revenueData.map((d, i) => (
            <circle key={i} cx={pad.left + i * xStep} cy={pad.top + yScale(d.thisWeek)} r="3" fill="#f97316" stroke="white" strokeWidth="1.5" />
          ))}

          {/* Peak callout */}
          <rect x={peakX - 42} y={peakY - 28} width="84" height="20" rx="4" fill="#1f2937" />
          <text x={peakX} y={peakY - 14} textAnchor="middle" fontSize="9" fill="white">Friday  ₹12,450.80</text>
          <line x1={peakX} y1={peakY - 8} x2={peakX} y2={peakY - 3} stroke="#1f2937" strokeWidth="1" />

          {/* X labels */}
          {revenueData.map((d, i) => (
            <text key={i} x={pad.left + i * xStep} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.day}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}