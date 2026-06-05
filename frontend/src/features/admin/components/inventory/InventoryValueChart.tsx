import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory.store';

export function InventoryValueChart() {
  const { valueOverTime } = useInventoryStore();

  const W = 320, H = 100, PAD = { top: 12, right: 12, bottom: 24, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const vals = valueOverTime.map((d) => d.value);
  const maxV = Math.max(...vals);
  const minV = Math.min(...vals) - 2000;

  const toX = (i: number) => PAD.left + (i / (vals.length - 1)) * innerW;
  const toY = (v: number) => PAD.top + innerH - ((v - minV) / (maxV - minV)) * innerH;

  const pts = vals.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const areaPath = `M${toX(0)},${toY(vals[0])} ` +
    vals.slice(1).map((v, i) => `L${toX(i + 1)},${toY(v)}`).join(' ') +
    ` L${toX(vals.length - 1)},${H - PAD.bottom} L${toX(0)},${H - PAD.bottom} Z`;

  const yTicks = [0, 10000, 20000];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Inventory Value Over Time</h3>
        <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          This Month <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        {/* Y grid lines */}
        {yTicks.map((t) => {
          const y = toY(t);
          if (y < PAD.top || y > H - PAD.bottom) return null;
          return (
            <line key={t} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y}
              stroke="currentColor" strokeWidth="0.5" className="text-gray-100 dark:text-gray-800" />
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="#f97316" fillOpacity="0.12" />

        {/* Line */}
        <polyline points={pts} fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots */}
        {vals.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#f97316" stroke="white" strokeWidth="1.5" />
        ))}

        {/* X labels */}
        {valueOverTime.map((d, i) => (
          <text key={i} x={toX(i)} y={H - 4} textAnchor="middle"
            fontSize="8" fill="currentColor" className="text-gray-400 dark:text-gray-500">
            {d.label}
          </text>
        ))}

        {/* Y labels */}
        {yTicks.map((t) => {
          const y = toY(t);
          if (y < PAD.top || y > H - PAD.bottom) return null;
          return (
            <text key={t} x={PAD.left - 4} y={y + 3} textAnchor="end"
              fontSize="7" fill="currentColor" className="text-gray-400 dark:text-gray-500">
              ₹{t / 1000}K
            </text>
          );
        })}
      </svg>
    </div>
  );
}