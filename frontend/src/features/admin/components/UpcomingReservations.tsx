import React from 'react';

const reservations = [
  { name: 'John Smith', time: '7:00 PM', guests: 4, status: 'confirmed', emoji: '👨' },
  { name: 'Sarah Johnson', time: '7:30 PM', guests: 2, status: 'confirmed', emoji: '👩' },
  { name: 'Michael Brown', time: '8:00 PM', guests: 6, status: 'pending', emoji: '👨‍💼' },
  { name: 'Emily Davis', time: '8:30 PM', guests: 3, status: 'confirmed', emoji: '👩‍💼' },
];

const statusStyle: Record<string, string> = {
  confirmed: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  pending: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
};

export function UpcomingReservations() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Reservations</h3>
        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">View All</button>
      </div>
      <div className="space-y-3">
        {reservations.map((r) => (
          <div key={r.name} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
              {r.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{r.name}</p>
              <p className="text-xs text-gray-400">🕐 {r.time} · {r.guests} Guests</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[r.status]}`}>
              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}