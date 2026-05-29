import React from 'react';
import { useStaffStore } from '../../store/staff.store';
function AvatarStack({ avatars, extra }: { avatars: string[]; extra: number }) {
  return (
    <div className="flex items-center">
      {avatars.map((av, i) => (
        <div
          key={i}
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: avatars.length - i }}
          className="relative w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-[9px] font-bold"
        >
          {av}
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{ marginLeft: -8, zIndex: 0 }}
          className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[9px] font-bold text-gray-500 dark:text-gray-400"
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

const SHIFT_COLORS = ['#f97316', '#3b82f6', '#a855f7'];

export function TodaysSchedule(): JSX.Element {
  const { shifts } = useStaffStore();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Today's Schedule</h3>
        <button className="text-xs font-semibold text-orange-500 hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {shifts.map((sh, i) => (
          <div key={sh.id} className="flex items-center gap-3">
            <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: SHIFT_COLORS[i] }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{sh.time}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{sh.label} • {sh.staffCount} Staff</p>
            </div>
            <AvatarStack avatars={sh.staffAvatars} extra={sh.extra} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UpcomingBirthdays(): JSX.Element {
  const { birthdays } = useStaffStore();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Upcoming Birthdays</h3>
        <button className="text-xs font-semibold text-orange-500 hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {birthdays.map((b) => (
          <div key={b.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {b.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{b.name}</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{b.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}