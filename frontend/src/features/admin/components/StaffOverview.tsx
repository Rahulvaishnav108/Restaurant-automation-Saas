import React from 'react';

const staff = [
  { name: 'James Wilson', role: 'Chef', status: 'on', emoji: '👨‍🍳' },
  { name: 'Lisa Martinez', role: 'Server', status: 'on', emoji: '👩‍💼' },
  { name: 'Robert Taylor', role: 'Manager', status: 'on', emoji: '👨‍💼' },
  { name: 'Amanda White', role: 'Host', status: 'off', emoji: '👩‍🍳' },
];

export function StaffOverview() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Staff Overview</h3>
        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">View All</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {staff.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-2xl">
                {s.emoji}
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${s.status === 'on' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">{s.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.role}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.status === 'on' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
              {s.status === 'on' ? '● On Duty' : '○ Off Duty'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}