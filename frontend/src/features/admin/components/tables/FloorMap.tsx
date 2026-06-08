import React from 'react';
import { useTablesStore } from '../../store/tables.store';
import type { Table, TableStatus } from '../../store/tables.store';

// ── Helpers ────────────────────────────────────────────────────────────────

const statusColors: Record<TableStatus, { fill: string; stroke: string; text: string }> = {
  Available: { fill: '#dcfce7', stroke: '#22c55e', text: '#15803d' },
  Occupied:  { fill: '#ffedd5', stroke: '#f97316', text: '#c2410c' },
  Reserved:  { fill: '#dbeafe', stroke: '#3b82f6', text: '#1d4ed8' },
  Cleaning:  { fill: '#fef9c3', stroke: '#eab308', text: '#a16207' },
  Blocked:   { fill: '#f3f4f6', stroke: '#9ca3af', text: '#6b7280' },
};

const darkStatusColors: Record<TableStatus, { fill: string; stroke: string; text: string }> = {
  Available: { fill: 'rgba(34,197,94,0.15)',  stroke: '#22c55e', text: '#4ade80' },
  Occupied:  { fill: 'rgba(249,115,22,0.15)', stroke: '#f97316', text: '#fb923c' },
  Reserved:  { fill: 'rgba(59,130,246,0.15)', stroke: '#3b82f6', text: '#60a5fa' },
  Cleaning:  { fill: 'rgba(234,179,8,0.15)',  stroke: '#eab308', text: '#facc15' },
  Blocked:   { fill: 'rgba(107,114,128,0.12)',stroke: '#6b7280', text: '#9ca3af' },
};

function TableShape({ table, isSelected, isDark }: { table: Table; isSelected: boolean; isDark: boolean }) {
  const colors = isDark ? darkStatusColors[table.status] : statusColors[table.status];
  const w = table.shape === 'Rectangle' ? 88 : table.shape === 'Square' ? 64 : 56;
  const h = table.shape === 'Rectangle' ? 52 : table.shape === 'Square' ? 64 : 56;
  const rx = table.shape === 'Round' ? 28 : 8;

  return (
    <g>
      <rect
        x={0} y={0} width={w} height={h} rx={rx}
        fill={colors.fill}
        stroke={isSelected ? '#f97316' : colors.stroke}
        strokeWidth={isSelected ? 2.5 : 1.5}
        style={{ filter: isSelected ? 'drop-shadow(0 0 6px rgba(249,115,22,0.4))' : undefined }}
      />
      <text x={w / 2} y={h / 2 - 6} textAnchor="middle" fill={colors.text} fontSize={10} fontWeight="700">
        {table.label}
      </text>
      <text x={w / 2} y={h / 2 + 7} textAnchor="middle" fill={colors.text} fontSize={9} opacity={0.8}>
        {table.seats} seats
      </text>
    </g>
  );
}

// ── Legend ─────────────────────────────────────────────────────────────────

const legend: { status: TableStatus; dot: string }[] = [
  { status: 'Available', dot: 'bg-green-500' },
  { status: 'Occupied',  dot: 'bg-orange-500' },
  { status: 'Reserved',  dot: 'bg-blue-500' },
  { status: 'Cleaning',  dot: 'bg-yellow-500' },
  { status: 'Blocked',   dot: 'bg-gray-400' },
];

// ── Main Component ─────────────────────────────────────────────────────────

export function FloorMap(): JSX.Element {
  const { tables, selectedTableId, selectedFloor, selectTable } = useTablesStore();
  
  // Lazy initialize to avoid synchronous setState in effect
  const [isDark, setIsDark] = React.useState(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const floorTables = tables.filter(t => t.floor === selectedFloor);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex-wrap">
        {legend.map(({ status, dot }) => (
          <span key={status} className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            {status}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-gray-400 italic">Click a table to manage</span>
      </div>

      <div className="relative w-full" style={{ paddingBottom: '56%', minHeight: 340 }}>
        <div className="absolute inset-0 p-4">
          <div className="absolute top-3 left-6 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            {selectedFloor === 1 ? 'Floor 1' : 'Floor 2 – Private'}
          </div>

          <div className="relative w-full h-full">
            {floorTables.map(table => {
              const w = table.shape === 'Rectangle' ? 88 : table.shape === 'Square' ? 64 : 56;
              const h = table.shape === 'Rectangle' ? 52 : table.shape === 'Square' ? 64 : 56;
              const isSelected = table.id === selectedTableId;

              return (
                <button
                  type="button"
                  key={table.id}
                  onClick={() => selectTable(isSelected ? null : table.id)}
                  title={`${table.label} • ${table.status} • ${table.seats} seats`}
                  className="absolute transition-transform hover:scale-105 focus:outline-none"
                  style={{ left: `${table.x}%`, top: `${table.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
                    <TableShape table={table} isSelected={isSelected} isDark={isDark} />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}