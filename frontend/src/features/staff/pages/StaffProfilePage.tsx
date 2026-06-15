import React from 'react';

export default function StaffProfilePage() {
  const profile = {
    name: 'Rahul Sharma',
    role: 'Senior Waiter',
    id: 'EMP-9021',
    section: 'Zone A (Tables 1-8)',
    status: 'On Duty',
    email: 'rahul.sharma@dineease.com',
    phone: '+91 99999 88888',
    joined: 'Jan 2025'
  };

  const schedule = [
    { day: 'Monday (Today)', shift: '04:00 PM - 11:00 PM', status: 'Active' },
    { day: 'Tuesday', shift: '04:00 PM - 11:00 PM', status: 'Upcoming' },
    { day: 'Wednesday', shift: '04:00 PM - 11:00 PM', status: 'Upcoming' },
    { day: 'Thursday', shift: 'Weekly Off', status: 'Off' },
    { day: 'Friday', shift: '04:00 PM - 11:00 PM', status: 'Upcoming' },
    { day: 'Saturday', shift: '12:00 PM - 11:00 PM (Double Shift)', status: 'Upcoming' },
    { day: 'Sunday', shift: '12:00 PM - 09:00 PM', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-550 mt-0.5">Manage your shift schedules, profile, and status.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Profile Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-dine-orange/15 hover:scale-105 transition-transform mx-auto flex items-center justify-center text-dine-orange font-black text-3xl shadow-sm border border-dine-orange/10">
              RS
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-850 dark:text-slate-100 font-sans">{profile.name}</h2>
              <p className="text-xs text-slate-450 font-sans mt-0.5">{profile.role} ({profile.id})</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-650 dark:bg-green-950/40 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {profile.status}
            </div>
          </div>

          <div className="mt-8 space-y-3 border-t border-slate-100 pt-4 text-xs font-sans">
            <div className="flex justify-between">
              <span className="text-slate-450">Assigned Section:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{profile.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-455">Email:</span>
              <span className="font-bold text-slate-850 dark:text-slate-200 truncate max-w-[150px]">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-455">Phone:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{profile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-455">Joined DineEase:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{profile.joined}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-4 border-t border-slate-100 space-y-2.5">
            <button
              onClick={() => alert('Break request submitted to manager.')}
              className="w-full border border-slate-200 hover:border-dine-orange hover:text-dine-orange font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
            >
              Request Break
            </button>
            <button
              onClick={() => alert('Clocked out successfully. Enjoy your rest!')}
              className="w-full bg-red-500 hover:bg-red-650 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all"
            >
              Clock Out
            </button>
          </div>
        </div>

        {/* Right Side: Shift Schedule */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="material-symbols-outlined text-dine-orange">calendar_month</span>
            <h2 className="font-bold text-base text-slate-850 dark:text-slate-200 font-sans">Shift Schedule</h2>
          </div>

          <div className="mt-4 space-y-3">
            {schedule.map((sch, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  sch.status === 'Active'
                    ? 'bg-dine-light-orange/30 border-dine-orange/30 dark:bg-orange-950/20'
                    : 'bg-slate-50 border border-slate-100'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200 font-sans">{sch.day}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">{sch.shift}</p>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  sch.status === 'Active' ? 'bg-orange-100 text-dine-orange dark:bg-orange-950/50 dark:text-orange-400 animate-pulse' :
                  sch.status === 'Off' ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                  'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                }`}>
                  {sch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
