import React from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { useReservationsStore, type Reservation, type ReservationStatus } from '../../store/reservations.store';

const statusStyle: Record<ReservationStatus, string> = {
  Confirmed: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  Pending:   'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  Cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  'Walk-in': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
};

const timeColor: Record<ReservationStatus, string> = {
  Confirmed: 'text-orange-500',
  Pending:   'text-amber-500',
  Cancelled: 'text-red-500',
  'Walk-in': 'text-purple-500',
};

function ReservationRow({ r, onSelect, isSelected }: { r: Reservation; onSelect: () => void; isSelected: boolean }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
        isSelected
          ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <div className={`w-9 h-9 rounded-full ${r.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
        {r.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className={`text-sm font-semibold ${timeColor[r.status]}`}>{r.time}</p>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusStyle[r.status]}`}>
            {r.status}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{r.name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
          <Users className="w-3 h-3" />
          {r.guests} Guests • Table {r.tableId}
        </p>
      </div>
    </button>
  );
}

export function UpcomingReservationsList(): JSX.Element {
  const { upcomingReservations, selectedGuest, setSelectedGuest } = useReservationsStore();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Upcoming Reservations</h3>
        <button className="flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1">
        {upcomingReservations.map((r) => (
          <ReservationRow
            key={r.id}
            r={r}
            isSelected={selectedGuest?.id === r.id}
            onSelect={() => setSelectedGuest(selectedGuest?.id === r.id ? null : r)}
          />
        ))}
      </div>
    </div>
  );
}