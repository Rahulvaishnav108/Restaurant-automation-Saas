import React from 'react';
import { useReportsStore } from '../../store/reports.store';

// ── Daily Summary Table ───────────────────────────────────────────────────

export function DailySummary(): JSX.Element {
  const { dailySummary } = useReportsStore();

  const cols = ['Date', 'Revenue', 'Orders', 'Customers', 'Avg. Order Value', 'Repeat Customers', 'Net Profit'];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Daily Summary</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {cols.map((c) => (
                <th key={c} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2.5 whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dailySummary.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">{row.date}</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900 dark:text-gray-100">{row.revenue}</td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{row.orders.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{row.customers}</td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{row.avgOrderValue}</td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{row.repeatCustomers}</td>
                <td className="px-4 py-3 text-xs font-semibold text-green-600 dark:text-green-400">{row.netProfit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Insights Panel ────────────────────────────────────────────────────────

export function InsightsPanel(): JSX.Element {
  const { insights } = useReportsStore();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">✨</span>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Insights</h3>
      </div>
      <div className="space-y-2.5">
        {insights.map((ins) => (
          <div key={ins.id} className={`flex items-start gap-3 p-3 rounded-xl border ${ins.color}`}>
            <span className="text-xl flex-shrink-0 mt-0.5">{ins.emoji}</span>
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-snug">{ins.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ins.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Report Shortcuts (sidebar) ────────────────────────────────────────────

export function ReportShortcuts(): JSX.Element {
  const { shortcuts } = useReportsStore();

  return (
    <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">📋</span>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Report Shortcuts</h3>
      </div>
      <div className="space-y-1">
        {shortcuts.map((s) => (
          <button
            key={s.id}
            className="w-full text-left text-xs text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 py-1.5 px-2 rounded-lg hover:bg-orange-100/60 dark:hover:bg-orange-900/30 transition-colors font-medium"
          >
            {s.label}
          </button>
        ))}
        <button className="w-full flex items-center gap-1 text-xs text-orange-500 font-semibold mt-2 px-2 py-1.5 hover:underline">
          View All Reports →
        </button>
      </div>
    </div>
  );
}