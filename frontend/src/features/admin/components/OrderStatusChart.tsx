import React from 'react';

const statuses = [
  { label: 'Completed', count: 85, pct: 54.5, color: '#10b981' },
  { label: 'Preparing', count: 35, pct: 22.4, color: '#f97316' },
  { label: 'Served', count: 20, pct: 12.8, color: '#3b82f6' },
  { label: 'Pending', count: 10, pct: 6.4, color: '#f59e0b' },
  { label: 'Cancelled', count: 6, pct: 3.8, color: '#ef4444' },
];

const total = 156;
const RADIUS = 56;
const STROKE = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function buildDashArray(pct: number) {
  return `${(pct / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
}

export function OrderStatusChart() {
  let cumulativePct = 0;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Status Overview</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <svg width="148" height="148" viewBox="0 0 148 148">
            <circle cx="74" cy="74" r={RADIUS} fill="none"
              stroke="currentColor" strokeWidth={STROKE}
              className="text-gray-100 dark:text-gray-800" />
            {statuses.map((s) => {
              const offset = -((cumulativePct / 100) * CIRCUMFERENCE) + CIRCUMFERENCE / 4;
              const dash = buildDashArray(s.pct);
              const el = (
                <circle key={s.label} cx="74" cy="74" r={RADIUS} fill="none"
                  stroke={s.color} strokeWidth={STROKE}
                  strokeDasharray={dash}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
              );
              cumulativePct += s.pct;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}</span>
            <span className="text-xs text-gray-400">Total Orders</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {statuses.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{s.count}</span>
                <span className="text-gray-400 w-14 text-right">({s.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}