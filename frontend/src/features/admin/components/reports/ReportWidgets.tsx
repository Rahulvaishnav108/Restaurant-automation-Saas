import React from 'react';
import { useReportsStore } from '../../store/reports.store';
import type { DateRange } from '../../store/reports.store';

const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'];

// ── Peak Hours Heatmap ────────────────────────────────────────────────────

export function PeakHours(): JSX.Element {
  const { peakHourCells } = useReportsStore();

  function getColor(intensity: number) {
    const alpha = 0.1 + intensity * 0.9;
    return `rgba(249,115,22,${alpha})`;
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Peak Hours</h3>
          <p className="text-[11px] text-gray-400">Busiest times based on orders</p>
        </div>
        <select className="text-xs py-1 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-600 dark:text-gray-400">
          <option>All Orders</option>
          <option>Dine-in</option>
          <option>Takeaway</option>
        </select>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 340 }}>
          {/* Hour headers */}
          <div className="flex mb-1 ml-10">
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-gray-400 font-medium">{h}</div>
            ))}
          </div>
          {/* Rows */}
          {DAYS.map((day) => (
            <div key={day} className="flex items-center mb-1">
              <span className="w-10 text-[10px] text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">{day}</span>
              {HOURS.map((hour) => {
                const cell = peakHourCells.find((c) => c.day === day && c.hour === hour);
                return (
                  <div
                    key={hour}
                    className="flex-1 mx-0.5 h-7 rounded"
                    style={{ background: getColor(cell?.intensity ?? 0.1) }}
                    title={`${day} ${hour}: ${Math.round((cell?.intensity ?? 0) * 100)}%`}
                  />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-1 mt-2 ml-10">
            <span className="text-[9px] text-gray-400">Low</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
              <div key={v} className="w-6 h-3 rounded-sm" style={{ background: getColor(v) }} />
            ))}
            <span className="text-[9px] text-gray-400">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Top Selling Items ─────────────────────────────────────────────────────

export function TopSellingItems(): JSX.Element {
  const { topSellingItems, topItemsRange, setTopItemsRange } = useReportsStore();
  const maxOrders = Math.max(...topSellingItems.map((i) => i.orders));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Top Selling Items</h3>
        <select
          value={topItemsRange}
          onChange={(e) => setTopItemsRange(e.target.value as DateRange)}
          className="text-xs py-1 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-600 dark:text-gray-400"
        >
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="space-y-3">
        {topSellingItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-lg flex-shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">{item.orders}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 dark:bg-orange-500 rounded-full transition-all"
                  style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0 w-20 text-right">{item.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Revenue By Category ───────────────────────────────────────────────────

export function RevenueByCategory(): JSX.Element {
  const { revenueByCategory, stats, revByCatRange, setRevByCatRange } = useReportsStore();

  const r = 52, cx = 70, cy = 70, circumference = 2 * Math.PI * r;
  const segments = revenueByCategory.reduce<Array<typeof revenueByCategory[number] & { dash: number; offset: number }>>(
    (acc, cat) => {
      const prev   = acc[acc.length - 1];
      const offset = prev ? prev.offset + prev.dash : 0;
      const dash   = (cat.pct / 100) * circumference;
      acc.push({ ...cat, dash, offset });
      return acc;
    },
    []
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Revenue by Category</h3>
        <select
          value={revByCatRange}
          onChange={(e) => setRevByCatRange(e.target.value as DateRange)}
          className="text-xs py-1 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-600 dark:text-gray-400"
        >
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
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
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="800" fill="#111827" className="dark:fill-gray-100">{stats.totalRevenue}</text>
            <text x={cx} y={cy + 8} textAnchor="middle" fontSize="8" fill="#9ca3af">Total Revenue</text>
          </svg>
        </div>
        <div className="space-y-2 flex-1">
          {revenueByCategory.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.pct}%</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">{cat.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}