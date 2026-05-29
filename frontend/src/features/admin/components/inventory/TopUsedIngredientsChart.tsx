import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory.store';

export function TopUsedIngredientsChart() {
  const { topUsedIngredients } = useInventoryStore();

  const maxVal = Math.max(...topUsedIngredients.map((d) => d.value));
  const W = 260, H = 80, BAR_W = 32, GAP = 8, PAD_LEFT = 28, PAD_BOTTOM = 20, PAD_TOP = 8;
  const innerH = H - PAD_BOTTOM - PAD_TOP;
  const totalBarsW = topUsedIngredients.length * (BAR_W + GAP) - GAP;
  const startX = (W - PAD_LEFT - totalBarsW) / 2 + PAD_LEFT;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top Used Ingredients</h3>
        <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-colors">
          This Month <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Y ticks */}
        {[0, 50, 100].map((t) => {
          const y = PAD_TOP + innerH - (t / 100) * innerH;
          return (
            <g key={t}>
              <line x1={PAD_LEFT} x2={W} y1={y} y2={y}
                stroke="currentColor" strokeWidth="0.5" className="text-gray-100 dark:text-gray-800" />
              <text x={PAD_LEFT - 3} y={y + 3} textAnchor="end" fontSize="7"
                fill="currentColor" className="text-gray-400 dark:text-gray-500">
                {t}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {topUsedIngredients.map((d, i) => {
          const barH = (d.value / maxVal) * innerH;
          const x    = startX + i * (BAR_W + GAP);
          const y    = PAD_TOP + innerH - barH;
          const shortLabel = d.label.split(' ')[0];
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={BAR_W} height={barH}
                rx="4" fill="#f97316" fillOpacity={0.85 - i * 0.08} />
              <text x={x + BAR_W / 2} y={H - 4} textAnchor="middle" fontSize="7"
                fill="currentColor" className="text-gray-400 dark:text-gray-500">
                {shortLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}