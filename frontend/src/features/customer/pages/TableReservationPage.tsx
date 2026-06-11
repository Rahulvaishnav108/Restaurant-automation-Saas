import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Clock, 
  Compass, 
  FileText, 
  ShieldCheck, 
  Clock3, 
  Gift, 
  Sparkles, 
  PhoneCall, 
  MessagesSquare, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useCustomerStore } from '../store/customer.store';

export default function TableReservationPage() {
  const navigate = useNavigate();
  const { tableCode } = useCustomerStore();

  const [guests, setGuests] = useState('2 Guests');
  const [date, setDate] = useState('24 May 2026');
  const [time, setTime] = useState('7:00 PM');
  const [area, setArea] = useState('Any Preference');
  const [specialRequest, setSpecialRequest] = useState('');

  const [selectedSlot, setSelectedSlot] = useState('7:00 PM');
  const [reservations, setReservations] = useState([
    { id: 1, date: '24 May 2026, Friday', time: '7:00 PM', guests: '2 Guests', status: 'Confirmed' }
  ]);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const timeSlots = [
    { time: '6:00 PM', status: 'Available' },
    { time: '6:30 PM', status: 'Available' },
    { time: '7:00 PM', status: 'Available' },
    { time: '7:30 PM', status: 'Available' },
    { time: '8:00 PM', status: 'Available' },
    { time: '8:30 PM', status: 'Limited' },
    { time: '9:00 PM', status: 'Limited' },
    { time: '9:30 PM', status: 'Available' },
  ];

  function handleBookTable() {
    const newReservation = {
      id: Date.now(),
      date: `${date}, Sunday`, // Mock day
      time: selectedSlot,
      guests,
      status: 'Confirmed'
    };
    setReservations([newReservation, ...reservations]);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
  }

  function handleCancel(id: number) {
    setReservations(reservations.filter(r => r.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-6 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Table Reservation</h2>
            <p className="text-xs text-slate-500 mt-1">Reserve your table and skip the long waiting queue.</p>
          </div>
          <button 
            onClick={() => navigate('/customer')}
            className="text-xs text-orange-500 font-bold hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 w-full">
        
        {/* Left Column: Form & Slot Selection (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Booking Form Card */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Book Your Table</h3>
              <p className="text-xs text-slate-400 mt-0.5">Please provide reservation details below.</p>
            </div>

            {bookingSuccess && (
              <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl text-xs font-bold border border-green-500/20">
                🎉 Table reserved successfully! Your booking is confirmed.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Guests Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Number of Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={guests} 
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>6 Guests</option>
                    <option>Large Group (8+)</option>
                  </select>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {timeSlots.map(s => (
                      <option key={s.time}>{s.time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area Preference */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Area Preference (Optional)</label>
                <div className="relative">
                  <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option>Any Preference</option>
                    <option>Indoor</option>
                    <option>Outdoor / Terrace</option>
                    <option>Private Room</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400">Special Request (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea 
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="E.g., birthday celebration, wheelchair accessibility, window seat..."
                    className="w-full min-h-[90px] pt-3 pl-10 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleBookTable}
                className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/15 transition-all"
              >
                Confirm Reservation
              </button>
            </div>
          </section>

          {/* Time Slots Grid */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Available Time Slots</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Select a convenient slot on {date}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {timeSlots.map((slot) => {
                const active = selectedSlot === slot.time;
                return (
                  <div
                    key={slot.time}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3.5 border rounded-2xl flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      active
                        ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-950/20 text-orange-500 ring-2 ring-orange-500/10'
                        : 'border-slate-100 dark:border-slate-800 hover:border-orange-500/30 text-slate-700 dark:text-slate-350'
                    }`}
                  >
                    <span className="text-xs font-bold">{slot.time}</span>
                    <span className={`text-[8px] uppercase font-bold tracking-wider ${
                      slot.status === 'Limited' ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Column: Benefits & Existing Bookings (col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Reservation Benefits */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">Why Reserve with Us?</h3>
            
            <div className="space-y-4">
              {[
                { label: 'Guaranteed Seating', desc: 'Your table will be reserved and ready.', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20', icon: ShieldCheck },
                { label: 'No Waiting Queue', desc: 'Skip the line and get seated immediately.', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', icon: Clock3 },
                { label: 'Special Occasions', desc: 'Let us prepare customized arrangements.', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20', icon: Gift },
                { label: 'Best Experience', desc: 'Priority table assignment & top service.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', icon: Sparkles },
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3.5 group cursor-pointer p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                  <div className={`w-9 h-9 rounded-full ${benefit.bg} ${benefit.color} flex items-center justify-center shrink-0`}>
                    <benefit.icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{benefit.label}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Current Bookings */}
          {reservations.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">Your Bookings</h3>
              
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div 
                    key={res.id} 
                    className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-orange-500/20 transition-all"
                  >
                    <div className="relative h-24 overflow-hidden bg-slate-100 dark:bg-slate-850">
                      <img 
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80"
                        alt="Restaurant Area" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{res.date}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-bold">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {res.time}</span>
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {res.guests}</span>
                          </div>
                        </div>
                        <span className="bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {res.status}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-800/80">
                        <button 
                          onClick={() => handleCancel(res.id)}
                          className="flex-1 py-1.5 border border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Help Contacts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white">Call Support</p>
                <p className="text-[8px] text-slate-400 mt-0.5">+91 98765 43210</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center gap-1.5">
              <MessagesSquare className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white">Live Chat</p>
                <p className="text-[8px] text-slate-400 mt-0.5">Active Table agent</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
