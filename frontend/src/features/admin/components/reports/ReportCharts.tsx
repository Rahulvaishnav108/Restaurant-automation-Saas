import React from 'react';
import { useReportsStore } from '../../store/reports.store';
import type { DateRange } from '../../store/reports.store';

const RANGES: DateRange[] = ['Daily', 'Weekly', 'Monthly'];

// ── Orders Trend ──────────────────────────────────────────────────────────

export function OrdersTrend(): JSX.Element {
  const { ordersTrend, stats, ordersRange, setOrdersRange } = useReportsStore();

  const W = 380, H = 180, PAD = { t: 20, r: 16, b: 36, l: 44 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;

  const maxVal = Math.max(...ordersTrend.map((d) => d.orders));
  const minVal = Math.min(...ordersTrend.map((d) => d.orders));
  const range  = maxVal - minVal || 1;

  const pts = ordersTrend.map((d, i) => ({
    x: PAD.l + (i / (ordersTrend.length - 1)) * chartW,
    y: PAD.t + (1 - (d.orders - minVal) / range) * chartH,
    ...d,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${PAD.t + chartH} L${pts[0].x},${PAD.t + chartH} Z`;

  const ySteps = [maxVal, Math.round((maxVal + minVal) / 2), minVal];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex-1 min-w-0">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Orders Trend</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-black text-gray-900 dark:text-gray-100">{stats.totalOrders.toLocaleString()}</span>
            <span className="text-xs text-green-500 font-semibold">{stats.totalOrdersChange}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">vs May 5 – May 11, 2025</p>
        </div>
        <div className="flex bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setOrdersRange(r)}
              className={`text-xs px-2.5 py-1.5 font-medium transition-colors ${
                ordersRange === r
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2">
        <defs>
          <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ySteps.map((val, i) => {
          const y = PAD.t + (i / (ySteps.length - 1)) * chartH;
          return (
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={PAD.l + chartW} y2={y} stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
              <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{val}</text>
            </g>
          );
        })}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{p.date}</text>
        ))}
        <path d={areaPath} fill="url(#ordGrad)" />
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#3b82f6" stroke="white" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}

// ── Sales By Channel ──────────────────────────────────────────────────────

export function SalesByChannel(): JSX.Element {
  const { salesByChannel, stats } = useReportsStore();

  const r = 52, cx = 70, cy = 70, circumference = 2 * Math.PI * r;
  let offset = 0;
  const segments = salesByChannel.map((ch) => {
    const dash = (ch.pct / 100) * circumference;
    const seg  = { ...ch, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 w-64 flex-shrink-0">
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Sales by Channel</h3>
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={-seg.offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fontWeight="800" fill="#111827" className="dark:fill-gray-100">{stats.totalRevenue}</text>
            <text x={cx} y={cy + 9} textAnchor="middle" fontSize="8" fill="#9ca3af">Total Revenue</text>
          </svg>
        </div>
      </div>
      <div className="space-y-2 mt-2">
        {salesByChannel.map((ch) => (
          <div key={ch.channel} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: ch.color }} />
              <span className="text-gray-600 dark:text-gray-400">{ch.channel}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{ch.pct}%</span>
              <span className="text-gray-400 ml-1">{ch.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}