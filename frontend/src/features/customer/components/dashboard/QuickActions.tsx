import React, { useState } from 'react';

interface QuickAction {
  icon: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const ACTIONS: QuickAction[] = [
  { icon: 'receipt_long', label: 'Request Bill', description: 'Get your bill at the table', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-950/40' },
  { icon: 'restaurant', label: 'Extra Cutlery', description: 'Request additional cutlery', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-950/40' },
  { icon: 'water_drop', label: 'Call for Water', description: 'Request water service', color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-950/40' },
  { icon: 'cleaning_services', label: 'Cleaning Staff', description: 'Request table cleaning', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-950/40' },
  { icon: 'support_agent', label: 'Call Waiter', description: 'Request waiter assistance', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-950/40' },
];

export default function QuickActions() {
  const [sentActions, setSentActions] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState('');

  function handleAction(action: QuickAction) {
    setSentActions((prev) => new Set(prev).add(action.label));
    setToastMsg(`✅ ${action.label} — Request sent to staff!`);
    setTimeout(() => setToastMsg(''), 3000);
    // Auto-reset after 30s so user can re-request
    setTimeout(() => {
      setSentActions((prev) => {
        const next = new Set(prev);
        next.delete(action.label);
        return next;
      });
    }, 30000);
  }

  return (
    <>
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-base font-bold text-sd-on-surface font-sans">Quick Actions</h3>
            <p className="text-xs text-sd-on-surface-variant font-sans">Tap to request service at your table</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ACTIONS.map((action) => {
            const isSent = sentActions.has(action.label);
            return (
              <button
                key={action.label}
                onClick={() => !isSent && handleAction(action)}
                disabled={isSent}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all group ${
                  isSent
                    ? 'border-sd-secondary/30 dark:border-green-800/30 bg-sd-secondary-container/10 dark:bg-green-950/20 cursor-default'
                    : 'border-sd-outline-variant dark:border-sd-outline-variant/40 bg-white dark:bg-sd-surface-container hover:shadow-md hover:border-sd-primary/30 active:scale-95'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
                    isSent ? 'bg-sd-secondary-container/20 dark:bg-green-950/40' : action.bgColor
                  } ${!isSent ? 'group-hover:scale-110' : ''}`}
                >
                  <span
                    className={`material-symbols-outlined text-[24px] ${isSent ? 'text-sd-secondary dark:text-green-400' : action.color}`}
                    style={{ fontVariationSettings: isSent ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {isSent ? 'check_circle' : action.icon}
                  </span>
                </div>
                <span className={`text-xs font-bold font-sans ${isSent ? 'text-sd-secondary dark:text-green-400' : 'text-sd-on-surface'}`}>
                  {isSent ? 'Sent!' : action.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-sd-inverse-surface text-white px-6 py-3 rounded-2xl shadow-xl z-[100] animate-fadeIn font-sans text-sm font-semibold">
          {toastMsg}
        </div>
      )}
    </>
  );
}
