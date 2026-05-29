import React from 'react';

const tables = [
  { id: 1, seats: 4, status: 'occupied' }, { id: 2, seats: 2, status: 'available' },
  { id: 3, seats: 6, status: 'occupied' }, { id: 4, seats: 4, status: 'reserved' },
  { id: 5, seats: 4, status: 'occupied' }, { id: 6, seats: 8, status: 'available' },
  { id: 7, seats: 2, status: 'occupied' }, { id: 8, seats: 4, status: 'available' },
  { id: 9, seats: 6, status: 'reserved' }, { id: 10, seats: 4, status: 'occupied' },
  { id: 11, seats: 2, status: 'available' }, { id: 12, seats: 4, status: 'occupied' },
];

const statusConfig = {
  occupied:  { label: 'Occupied',  color: 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400' },
  available: { label: 'Available', color: 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' },
  reserved:  { label: 'Reserved',  color: 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' },
};

export function TableOverview(): JSX.Element {
  const occupied  = tables.filter((t) => t.status === 'occupied').length;
  const available = tables.filter((t) => t.status === 'available').length;
  const reserved  = tables.filter((t) => t.status === 'reserved').length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Table Status</h3>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />{occupied} Occupied</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{available} Free</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />{reserved} Reserved</span>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {tables.map((table) => {
          const cfg = statusConfig[table.status as keyof typeof statusConfig];
          return (
            <div
              key={table.id}
              className={`border rounded-xl p-2 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity ${cfg.color}`}
              title={`Table ${table.id} — ${cfg.label}`}
            >
              <span className="text-[11px] font-bold">{table.id}</span>
              <span className="text-[9px] opacity-70">{table.seats}p</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}