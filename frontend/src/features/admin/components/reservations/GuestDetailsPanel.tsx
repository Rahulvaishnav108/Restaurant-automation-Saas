import React from 'react';
import { Phone, Mail, Calendar, Clock, Users, Utensils, ChevronRight, Edit3 } from 'lucide-react';
import { useReservationsStore, type ReservationStatus } from '../../store/reservations.store';

const statusStyle: Record<ReservationStatus, string> = {
  Confirmed: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  Pending:   'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  Cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  'Walk-in': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900 flex items-center justify-center mb-4">
        <Users className="w-6 h-6 text-orange-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No guest selected</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click a reservation to view details</p>
    </div>
  );
}

export function GuestDetailsPanel(): JSX.Element {
  const { selectedGuest } = useReservationsStore();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Guest Details</h3>

      {!selectedGuest ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${selectedGuest.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {selectedGuest.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedGuest.name}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[selectedGuest.status]}`}>
                {selectedGuest.status}
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{selectedGuest.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{selectedGuest.email}</span>
            </div>
          </div>

          {/* Special request */}
          {selectedGuest.specialRequest && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Special Request</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedGuest.specialRequest}</p>
            </div>
          )}

          {/* Reservation details */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Reservation Details</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 text-gray-400" />
                {selectedGuest.date}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 text-gray-400" />
                {selectedGuest.time}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Users className="w-4 h-4 text-gray-400" />
                {selectedGuest.guests} Guests
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Utensils className="w-4 h-4 text-gray-400" />
                Table {selectedGuest.tableId}
              </div>
              {selectedGuest.occasion && (
                <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-base">🎉</span>
                  {selectedGuest.occasion}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors">
              View History
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}