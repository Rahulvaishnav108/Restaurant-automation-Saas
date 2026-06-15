import React, { useState } from 'react';

const TIME_SLOTS = [
  { time: '6:00 PM', status: 'available' },
  { time: '6:30 PM', status: 'available' },
  { time: '7:00 PM', status: 'selected' },
  { time: '7:30 PM', status: 'available' },
  { time: '8:00 PM', status: 'available' },
  { time: '8:30 PM', status: 'limited' },
  { time: '9:00 PM', status: 'limited' },
  { time: '9:30 PM', status: 'available' },
];

export default function CustomerReservationPage() {
  const [selectedSlot, setSelectedSlot] = useState('7:00 PM');
  const [dateTab, setDateTab] = useState<'today' | 'tomorrow' | 'custom'>('today');

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-full sd-custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-sd-on-surface font-sans">Table Reservation</h2>
        <p className="text-sm text-sd-on-surface-variant font-sans">Reserve your table and enjoy a great dining experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Booking Form */}
          <section className="bg-white rounded-2xl p-6 border border-sd-surface-variant sd-food-card-shadow">
            <h3 className="text-base font-bold text-sd-on-surface mb-5 font-sans">Book Your Table</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guests */}
              <div className="space-y-1.5">
                <label htmlFor="guests-select" className="text-xs font-semibold text-sd-on-surface-variant font-sans">Number of Guests</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sd-outline text-[20px]">group</span>
                  <select id="guests-select" className="w-full h-12 pl-10 pr-4 bg-sd-surface rounded-xl border border-sd-surface-variant focus:border-sd-primary-container focus:ring-1 focus:ring-sd-primary-container appearance-none text-sm font-sans">
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>6 Guests</option>
                    <option>Large Group</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-sd-outline text-[18px]">expand_more</span>
                </div>
              </div>
              {/* Date */}
              <div className="space-y-1.5">
                <label htmlFor="date-input" className="text-xs font-semibold text-sd-on-surface-variant font-sans">Date</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sd-outline text-[20px]">calendar_today</span>
                  <input id="date-input" className="w-full h-12 pl-10 pr-4 bg-sd-surface rounded-xl border border-sd-surface-variant focus:border-sd-primary-container focus:ring-1 focus:ring-sd-primary-container text-sm font-sans" type="text" defaultValue="24 May 2024" />
                </div>
              </div>
              {/* Time */}
              <div className="space-y-1.5">
                <label htmlFor="time-select" className="text-xs font-semibold text-sd-on-surface-variant font-sans">Time</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sd-outline text-[20px]">schedule</span>
                  <select id="time-select" className="w-full h-12 pl-10 pr-4 bg-sd-surface rounded-xl border border-sd-surface-variant focus:border-sd-primary-container focus:ring-1 focus:ring-sd-primary-container appearance-none text-sm font-sans">
                    <option>7:00 PM</option>
                    <option>7:30 PM</option>
                    <option>8:00 PM</option>
                    <option>8:30 PM</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-sd-outline text-[18px]">expand_more</span>
                </div>
              </div>
              {/* Area */}
              <div className="space-y-1.5">
                <label htmlFor="area-select" className="text-xs font-semibold text-sd-on-surface-variant font-sans">Area Preference <span className="text-sd-outline font-normal">(Optional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sd-outline text-[20px]">chair</span>
                  <select id="area-select" className="w-full h-12 pl-10 pr-4 bg-sd-surface rounded-xl border border-sd-surface-variant focus:border-sd-primary-container focus:ring-1 focus:ring-sd-primary-container appearance-none text-sm font-sans">
                    <option>Any Preference</option>
                    <option>Indoor</option>
                    <option>Outdoor / Terrace</option>
                    <option>Private Room</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-sd-outline text-[18px]">expand_more</span>
                </div>
              </div>
              {/* Special Request */}
              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor="special-request-textarea" className="text-xs font-semibold text-sd-on-surface-variant font-sans">Special Request <span className="text-sd-outline font-normal">(Optional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-4 material-symbols-outlined text-sd-outline text-[20px]">edit_note</span>
                  <textarea id="special-request-textarea" className="w-full min-h-[100px] pt-4 pl-10 pr-4 bg-sd-surface rounded-xl border border-sd-surface-variant focus:border-sd-primary-container focus:ring-1 focus:ring-sd-primary-container resize-none text-sm font-sans" placeholder="E.g. Birthday celebration, High chair, Window seat" />
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button className="bg-sd-primary-container text-white px-10 py-3 rounded-xl font-bold text-sm shadow-lg shadow-sd-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all font-sans">
                Check Availability
              </button>
            </div>
          </section>

          {/* Time Slots */}
          <section className="bg-white rounded-2xl p-6 border border-sd-surface-variant sd-food-card-shadow">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h3 className="text-base font-bold text-sd-on-surface font-sans">Available Time Slots</h3>
                <p className="text-xs text-sd-on-surface-variant font-sans mt-0.5">24 May 2024</p>
              </div>
              <div className="flex bg-sd-surface rounded-lg p-1 border border-sd-surface-variant">
                {(['today', 'tomorrow', 'custom'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDateTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize font-sans transition-all ${
                      dateTab === tab ? 'bg-white shadow-sm text-sd-primary' : 'text-sd-on-surface-variant hover:bg-sd-surface-variant'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TIME_SLOTS.map(({ time, status }) => {
                const isSelected = selectedSlot === time;
                const isLimited = status === 'limited';
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedSlot(time)}
                    className={`p-4 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'border-2 border-sd-primary-container bg-sd-primary-container/5 shadow-md'
                        : 'border border-sd-surface-variant hover:border-sd-primary'
                    }`}
                  >
                    <span className={`text-sm font-bold font-sans ${isSelected ? 'text-sd-primary' : ''}`}>{time}</span>
                    <span className={`text-[10px] uppercase font-bold font-sans ${isLimited ? 'text-sd-primary' : 'text-sd-secondary'}`}>
                      {isLimited ? 'Limited' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Benefits */}
          <section className="bg-white rounded-2xl p-5 border border-sd-surface-variant sd-food-card-shadow">
            <h3 className="text-base font-bold text-sd-on-surface mb-4 font-sans">Why Reserve with Us?</h3>
            <div className="space-y-3">
              {[
                { icon: 'verified_user', label: 'Guaranteed Seating', desc: 'Your table will be reserved and ready for you.', color: 'bg-green-100 text-green-600' },
                { icon: 'alarm', label: 'No Waiting', desc: 'Skip the wait and enjoy your time.', color: 'bg-orange-100 text-orange-600' },
                { icon: 'card_giftcard', label: 'Special Occasions', desc: 'Celebrate your special moments with us.', color: 'bg-purple-100 text-purple-600' },
                { icon: 'star', label: 'Best Experience', desc: 'Enjoy personalized service for a memorable dining.', color: 'bg-blue-100 text-blue-600' },
              ].map(({ icon, label, desc, color }) => (
                <div key={label} className="flex items-start gap-3 p-3 hover:bg-sd-surface-container-low rounded-xl transition-colors cursor-pointer group">
                  <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold font-sans">{label}</h4>
                    <p className="text-xs text-sd-on-surface-variant font-sans">{desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-sd-outline text-[18px] self-center group-hover:translate-x-1 transition-transform">chevron_right</span>
                </div>
              ))}
            </div>
          </section>

          {/* Existing Reservation */}
          <section className="bg-white rounded-2xl border border-sd-surface-variant sd-food-card-shadow overflow-hidden">
            <div className="px-5 py-3 flex justify-between items-center">
              <h3 className="text-base font-bold text-sd-on-surface font-sans">Your Reservations</h3>
              <span className="text-xs font-bold text-sd-primary hover:underline cursor-pointer font-sans">View All</span>
            </div>
            <div className="px-5 pb-5">
              <div className="border border-sd-surface-variant rounded-2xl overflow-hidden">
                <div className="h-28 bg-gradient-to-br from-sd-primary-fixed via-sd-primary-fixed-dim to-sd-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-sd-primary/30">restaurant</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm font-sans">24 May 2024, Friday</h4>
                      <div className="flex gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-sd-on-surface-variant text-[11px] font-sans">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> 7:00 PM
                        </div>
                        <div className="flex items-center gap-1 text-sd-on-surface-variant text-[11px] font-sans">
                          <span className="material-symbols-outlined text-[14px]">group</span> 2 Guests
                        </div>
                      </div>
                    </div>
                    <span className="bg-sd-secondary/10 text-sd-secondary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-sans">Confirmed</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 border border-sd-surface-variant rounded-lg text-xs font-bold hover:bg-sd-surface-container transition-colors font-sans">Modify</button>
                    <button className="flex-1 py-2 border border-sd-error/20 text-sd-error rounded-lg text-xs font-bold hover:bg-sd-error/5 transition-colors font-sans">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
