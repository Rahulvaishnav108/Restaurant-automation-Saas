import React from 'react';
import { useStaffStore } from '../../store/staff.store';
// ── Attendance Overview ───────────────────────────────────────────────────

export function AttendanceOverview(): JSX.Element {
  const { stats, attendanceBreakdown } = useStaffStore();

  const total = attendanceBreakdown.reduce((s, a) => s + a.count, 0);
  let offset = 0;
  const r = 45, cx = 60, cy = 60, circumference = 2 * Math.PI * r;

  const segments = attendanceBreakdown.map((ab) => {
    const pct = ab.count / total;
    const dash = pct * circumference;
    const seg = { ...ab, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Attendance Overview</h3>
          <p className="text-[11px] text-gray-400">This Month</p>
        </div>
        <button className="text-xs font-semibold text-orange-500 hover:underline">View Report</button>
      </div>
      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={-seg.offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827" className="dark:fill-gray-100">{stats.attendancePct}%</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#9ca3af">Overall</text>
            <text x={cx} y={cy + 21} textAnchor="middle" fontSize="9" fill="#9ca3af">Attendance</text>
          </svg>
        </div>
        <div className="space-y-1.5 flex-1">
          {attendanceBreakdown.map((ab) => (
            <div key={ab.label} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: ab.color }} />
              <span className="text-gray-600 dark:text-gray-400 flex-1">{ab.label}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{ab.count}</span>
              <span className="text-gray-400">({Math.round(ab.count / total * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Payroll Summary ───────────────────────────────────────────────────────

export function PayrollSummary(): JSX.Element {
  const { stats, payrollLines } = useStaffStore();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Payroll Summary</h3>
          <p className="text-[11px] text-gray-400">This Month</p>
        </div>
        <button className="text-xs font-semibold text-orange-500 hover:underline">View Report</button>
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">Total Payroll</p>
        <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{stats.totalPayroll}</p>
        <p className="text-xs text-red-500 mt-0.5">{stats.totalPayrollChange}</p>
      </div>
      {/* Payroll icon placeholder */}
      <div className="w-full h-16 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl flex items-center justify-center mb-3">
        <div className="flex gap-1 items-end">
          {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
            <div key={i} style={{ height: h * 0.5 }} className="w-2.5 bg-orange-400 dark:bg-orange-500 rounded-sm opacity-80" />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {payrollLines.map((pl) => (
          <div key={pl.label} className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">{pl.label}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{pl.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Performance Overview ──────────────────────────────────────────────────

const PERF_DATA = [
  { rating: 1, pct: 2  },
  { rating: 2, pct: 6  },
  { rating: 3, pct: 18 },
  { rating: 4, pct: 32 },
  { rating: 5, pct: 42 },
];

export function PerformanceOverview(): JSX.Element {
  const { stats } = useStaffStore();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Performance Overview</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Average Rating</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900 dark:text-gray-100">{stats.avgPerformance}</span>
          </div>
          <p className="text-xs text-green-500">{stats.avgPerformanceChange}</p>
        </div>
        <button className="text-xs font-semibold text-orange-500 hover:underline self-start">View Report</button>
      </div>
      <div className="flex items-end gap-2 h-24 mt-2">
        {PERF_DATA.map((d) => (
          <div key={d.rating} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-500">{d.pct}%</span>
            <div
              className="w-full rounded-t-md bg-orange-400 dark:bg-orange-500 transition-all"
              style={{ height: `${d.pct * 2}px` }}
            />
            <span className="text-[10px] text-gray-500">{d.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Roles Distribution ────────────────────────────────────────────────────

export function RolesDistribution(): JSX.Element {
  const { roleDistribution, stats } = useStaffStore();

  const total = stats.totalStaff;
  let offset = 0;
  const r = 45, cx = 60, cy = 60, circumference = 2 * Math.PI * r;

  const segments = roleDistribution
    .filter((rd) => rd.count > 0)
    .map((rd) => {
      const pct = rd.count / total;
      const dash = pct * circumference;
      const seg = { ...rd, dash, offset };
      offset += dash;
      return seg;
    });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Roles Distribution</h3>
        <button className="text-xs font-semibold text-orange-500 hover:underline">View All</button>
      </div>
      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={-seg.offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill="#111827" className="dark:fill-gray-100">{total}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#9ca3af">Total</text>
          </svg>
        </div>
        <div className="space-y-1 flex-1">
          {roleDistribution.filter((rd) => rd.count > 0).map((rd) => (
            <div key={rd.role} className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: rd.color }} />
              <span className="text-gray-600 dark:text-gray-400 flex-1 truncate">{rd.role}s</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{rd.count}</span>
              <span className="text-gray-400">({rd.pct})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}