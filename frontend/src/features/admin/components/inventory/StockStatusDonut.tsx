import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory.store';

export function StockStatusDonut() {
  const { statusDistribution: d } = useInventoryStore();

  const cx = 60, cy = 60, r = 44, strokeW = 16;
  const circ = 2 * Math.PI * r;

  const segments = [
    { label: 'In Stock',      value: d.inStockPct,      count: d.inStock,      color: '#22c55e' },
    { label: 'Low Stock',     value: d.lowStockPct,     count: d.lowStock,     color: '#f59e0b' },
    { label: 'Out of Stock',  value: d.outOfStockPct,   count: d.outOfStock,   color: '#ef4444' },
    { label: 'Expiring Soon', value: d.expiringSoonPct, count: d.expiringSoon, color: '#a855f7' },
  ];

  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash   = (seg.value / 100) * circ;
    const gap    = circ - dash;
    const rotate = (offset / 100) * 360 - 90;
    offset += seg.value;
    return { ...seg, dash, gap, rotate };
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Stock Status Distribution</h3>
        <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-colors">
          All Categories <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {arcs.map((arc) => (
              <circle
                key={arc.label}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={arc.color}
                strokeWidth={strokeW}
                strokeDasharray={`${arc.dash} ${arc.gap}`}
                strokeDashoffset={0}
                transform={`rotate(${arc.rotate} ${cx} ${cy})`}
                strokeLinecap="butt"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-2 flex-1">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{seg.label}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {seg.count} <span className="text-gray-400 dark:text-gray-500">({seg.value}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}