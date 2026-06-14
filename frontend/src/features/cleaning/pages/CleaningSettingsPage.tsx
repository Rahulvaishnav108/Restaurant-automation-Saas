import React, { useState } from 'react';
import { useTheme, ThemeMode } from '../../../app/providers/ThemeProvider';

export default function CleaningSettingsPage() {
  const { theme, setTheme } = useTheme();

  // Notification states
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [shiftAlerts, setShiftAlerts] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn cleaning-panel">
      <div className="space-y-6">
        {/* Theme Toggles (Stitch style 3-way) */}
        <div className="bg-white dark:bg-sd-surface-container border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-150 font-sans mb-1">Display Theme</h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 mb-4 leading-relaxed font-sans font-semibold">
            Choose light or dark mode, or match your device&apos;s system appearance.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: 'light_mode' },
              { id: 'dark', label: 'Dark Mode', icon: 'dark_mode' },
              { id: 'system', label: 'System Theme', icon: 'desktop_windows' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setTheme(item.id as ThemeMode)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border font-sans text-xs font-bold transition-all gap-2 hover:shadow-soft cursor-pointer ${
                  theme === item.id
                    ? 'border-cleanserve-primary bg-cleanserve-surface-container-low/30 text-cleanserve-primary dark:bg-slate-850 dark:text-white dark:border-slate-600'
                    : 'border-slate-105 dark:border-slate-700 text-slate-500 hover:text-slate-700 bg-slate-50 dark:bg-slate-800/40 dark:text-slate-405'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-sd-surface-container border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-sm text-slate-850 dark:text-slate-150 font-sans mb-4">Notification Preferences</h2>
          
          <div className="space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Urgent Cleaning Tickets</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Vibrate or play audio alert when high priority requests are raised.</p>
              </div>
              <button
                onClick={() => setUrgentAlerts(!urgentAlerts)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  urgentAlerts ? 'bg-cleanserve-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  urgentAlerts ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Routine Task Reminders</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Alert immediately when routine sanitization checks are near schedule due times.</p>
              </div>
              <button
                onClick={() => setTaskReminders(!taskReminders)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  taskReminders ? 'bg-cleanserve-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  taskReminders ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Shift Assignments & Announcements</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">Receive shift changes, zoning assignment notices or supervisor announcements.</p>
              </div>
              <button
                onClick={() => setShiftAlerts(!shiftAlerts)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  shiftAlerts ? 'bg-cleanserve-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  shiftAlerts ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white dark:bg-sd-surface-container border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-150 font-sans mb-4">Preferred Language</h2>
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            className="w-full md:w-64 text-xs font-sans font-bold p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-250 focus:ring-1 focus:ring-cleanserve-primary outline-none"
          >
            <option value="en">English (US)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="es">Spanish (Español)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
