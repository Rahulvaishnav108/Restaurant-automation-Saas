import React, { useState } from 'react';
import { CalendarDays, Filter, Plus, ChevronDown } from 'lucide-react';
import { ReservationStatCards } from '../components/reservations/ReservationStatCards';
import { ReservationCalendar } from '../components/reservations/ReservationCalendar';
import { UpcomingReservationsList } from '../components/reservations/UpcomingReservationsList';
import { TableAvailabilityGrid } from '../components/reservations/TableAvailabilityGrid';
import { GuestDetailsPanel } from '../components/reservations/GuestDetailsPanel';
import { TimeSlotsOverview } from '../components/reservations/TimeSlotsOverview';
import { ReservationAnalyticsBar } from '../components/reservations/ReservationAnalyticsBar';
import { useReservationsStore } from '../store/reservations.store';

export default function ReservationsPage(): JSX.Element {
  const { selectedDate } = useReservationsStore();
  const [showNewModal, setShowNewModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reservations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage all restaurant reservations and table bookings
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Date picker */}
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            {selectedDate}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {/* Filter */}
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
            Filter
          </button>
          {/* New Reservation */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Reservation
          </button>
        </div>
      </div>

      {/* Stat cards row */}
      <ReservationStatCards />

      {/* Main grid: Calendar + Upcoming + Table + Guest Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Calendar — 4 cols */}
        <div className="lg:col-span-4">
          <ReservationCalendar />
        </div>

        {/* Upcoming reservations — 3 cols */}
        <div className="lg:col-span-3">
          <UpcomingReservationsList />
        </div>

        {/* Table availability — 3 cols */}
        <div className="lg:col-span-3">
          <TableAvailabilityGrid />
        </div>

        {/* Guest details — 2 cols */}
        <div className="lg:col-span-2">
          <GuestDetailsPanel />
        </div>
      </div>

      {/* Time slots + Analytics */}
      <TimeSlotsOverview />
      <ReservationAnalyticsBar />

      {/* Simple New Reservation Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="button"
          tabIndex={0}
          onClick={() => setShowNewModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowNewModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-6 w-full max-w-md mx-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">New Reservation</h2>
            <div className="space-y-3">
              {[
                { label: 'Guest Name', placeholder: 'Enter full name', type: 'text' },
                { label: 'Phone', placeholder: '+91 XXXXX XXXXX', type: 'tel' },
                { label: 'Email', placeholder: 'guest@email.com', type: 'email' },
                { label: 'Date', placeholder: '', type: 'date' },
                { label: 'Time', placeholder: '', type: 'time' },
              ].map(({ label, placeholder, type }) => {
                const fieldId = `new-res-${label.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <div key={label}>
                    <label htmlFor={fieldId} className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                    <input
                      id={fieldId}
                      type={type}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 dark:focus:border-orange-600 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 transition-all"
                    />
                  </div>
                );
              })}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-res-guests" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Guests</label>
                  <input id="new-res-guests" type="number" min="1" max="20" defaultValue={2} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 text-gray-800 dark:text-gray-100 transition-all" />
                </div>
                <div>
                  <label htmlFor="new-res-table" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Table</label>
                  <select id="new-res-table" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 text-gray-800 dark:text-gray-100 transition-all">
                    {[2, 6, 8, 11, 12].map((t) => (
                      <option key={t} value={t}>Table {t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Special Request</label>
                <textarea
                  rows={2}
                  placeholder="Any dietary requirements or special notes..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
              >
                Create Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}