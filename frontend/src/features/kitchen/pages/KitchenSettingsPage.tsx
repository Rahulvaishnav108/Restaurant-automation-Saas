import React, { useState } from 'react';
import { SETTINGS_SECTIONS } from '../store/kitchenData';

export default function KitchenSettingsPage() {
  const [activeSection, setActiveSection] = useState<string>('general');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    kitchenName: 'Flavoroast Main Kitchen',
    timezone: 'IST (UTC+5:30)',
    language: 'en',
  });

  // Notifications Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    audioAlerts: true,
    visualBanners: true,
    desktopPopups: false,
    toastAlerts: true,
  });

  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    cardSize: 'medium',
    columns: '4',
    theme: 'light',
  });

  // Auto rules
  const [autoRules, setAutoRules] = useState({
    dineIn: true,
    takeAway: false,
    delivery: false,
  });

  // Prep times
  const [prepTimes, setPrepTimes] = useState({
    biryani: 25,
    curry: 18,
    grill: 12,
    fry: 8,
    dessert: 10,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Settings</h2>
          <p className="text-sm text-slate-500 font-medium">Configure KDS screen displays, notification rules, and chef allocations</p>
        </div>
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1.5">
          {SETTINGS_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setSaveSuccess(false);
              }}
              className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                activeSection === section.id
                  ? 'bg-orange-50/70 border-orange-200 text-orange-600 shadow-sm'
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <span className="text-xl mt-0.5">{section.icon}</span>
              <div>
                <h4 className={`font-bold text-sm leading-snug ${activeSection === section.id ? 'text-orange-600' : 'text-slate-800'}`}>
                  {section.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5 leading-snug">{section.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Box Form */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <form onSubmit={handleSave} className="p-6 space-y-6">
            {/* General */}
            {activeSection === 'general' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 border-b border-slate-50 pb-2">General Kitchen Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                  <div className="space-y-1.5">
                    <label htmlFor="kitchen-name-input" className="block text-slate-500">Kitchen Name</label>
                    <input
                      id="kitchen-name-input"
                      type="text"
                      value={generalSettings.kitchenName}
                      onChange={e => setGeneralSettings({ ...generalSettings, kitchenName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-orange-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="timezone-input" className="block text-slate-500">Time Zone</label>
                    <input
                      id="timezone-input"
                      type="text"
                      value={generalSettings.timezone}
                      onChange={e => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-orange-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="language-select" className="block text-slate-500">System Language</label>
                    <select
                      id="language-select"
                      value={generalSettings.language}
                      onChange={e => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-orange-500"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="hi">हिन्दी</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Stations config */}
            {activeSection === 'stations' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 border-b border-slate-50 pb-2">Station Configurations</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Toggle station availability status within the KDS. Disabled stations will not receive new kitchen orders.
                </p>
                <div className="space-y-3 font-semibold text-sm text-slate-700">
                  {['Grill Station', 'Curry Station', 'Fry Station', 'Biryani Station', 'Dessert Counter', 'Beverage Station'].map(stn => (
                    <div key={stn} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span>{stn}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        <span className="sr-only">Toggle {stn}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 border-b border-slate-50 pb-2">Sound & Alert Preferences</h3>
                <div className="space-y-3 font-semibold text-sm text-slate-700">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Audio Alerts</p>
                      <p className="text-[10px] text-slate-400 font-medium">Chime when new orders arrive</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.audioAlerts}
                        onChange={e => setNotificationSettings({ ...notificationSettings, audioAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      <span className="sr-only">Toggle Audio Alerts</span>
                    </label>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Visual Banner Popups</p>
                      <p className="text-[10px] text-slate-400 font-medium">Show popup alert cards for VIP orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.visualBanners}
                        onChange={e => setNotificationSettings({ ...notificationSettings, visualBanners: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      <span className="sr-only">Toggle Visual Banner Popups</span>
                    </label>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Toast Dismissal Alert</p>
                      <p className="text-[10px] text-slate-400 font-medium">Auto dismiss alerts after 10 seconds</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.toastAlerts}
                        onChange={e => setNotificationSettings({ ...notificationSettings, toastAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      <span className="sr-only">Toggle Toast Dismissal Alert</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Display & KDS */}
            {activeSection === 'display' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 border-b border-slate-50 pb-2">KDS View Customization</h3>
                <div className="space-y-4 text-xs font-bold text-slate-600">
                  <div className="space-y-1.5">
                    <span className="block text-slate-500">Order Card Layout Size</span>
                    <div className="flex gap-3">
                      {['small', 'medium', 'large'].map(sz => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setDisplaySettings({ ...displaySettings, cardSize: sz })}
                          className={`flex-1 py-2 border rounded-xl text-center capitalize transition-all ${
                            displaySettings.cardSize === sz
                              ? 'bg-orange-50 text-orange-600 border-orange-200 font-bold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="block text-slate-500">Overview Board Columns</span>
                    <div className="flex gap-3">
                      {['3', '4'].map(cols => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => setDisplaySettings({ ...displaySettings, columns: cols })}
                          className={`flex-1 py-2 border rounded-xl text-center transition-all ${
                            displaySettings.columns === cols
                              ? 'bg-orange-50 text-orange-600 border-orange-200 font-bold'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cols} Columns
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Auto Rules */}
            {activeSection === 'auto-rules' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 border-b border-slate-50 pb-2">Auto-Accept Rules</h3>
                <div className="space-y-3 font-semibold text-sm text-slate-700">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Auto-Accept Dine-in Orders</p>
                      <p className="text-[10px] text-slate-400 font-medium">Bypass Chef confirmation for table orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRules.dineIn}
                        onChange={e => setAutoRules({ ...autoRules, dineIn: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      <span className="sr-only">Toggle Auto-Accept Dine-in Orders</span>
                    </label>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Auto-Accept Delivery Partners</p>
                      <p className="text-[10px] text-slate-400 font-medium">Automatically dispatch orders to Stations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRules.delivery}
                        onChange={e => setAutoRules({ ...autoRules, delivery: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      <span className="sr-only">Toggle Auto-Accept Delivery Partners</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Prep Times */}
            {activeSection === 'prep-times' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 border-b border-slate-50 pb-2">Default Preparation Target Times</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
                  Set target cooking limits per item category. Orders exceeding these limits will trigger &apos;delayed&apos; alarms.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                  <div className="space-y-1.5">
                    <label htmlFor="prep-biryani" className="block text-slate-500">Biryani & Rice (mins)</label>
                    <input
                      id="prep-biryani"
                      type="number"
                      value={prepTimes.biryani}
                      onChange={e => setPrepTimes({ ...prepTimes, biryani: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-orange-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prep-curry" className="block text-slate-500">Curries & Mains (mins)</label>
                    <input
                      id="prep-curry"
                      type="number"
                      value={prepTimes.curry}
                      onChange={e => setPrepTimes({ ...prepTimes, curry: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-orange-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prep-grill" className="block text-slate-500">Grills & Tandoors (mins)</label>
                    <input
                      id="prep-grill"
                      type="number"
                      value={prepTimes.grill}
                      onChange={e => setPrepTimes({ ...prepTimes, grill: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-orange-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="prep-fry" className="block text-slate-500">Appetizers & Fry (mins)</label>
                    <input
                      id="prep-fry"
                      type="number"
                      value={prepTimes.fry}
                      onChange={e => setPrepTimes({ ...prepTimes, fry: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Integrations & Team (Placeholder Forms) */}
            {(activeSection === 'integrations' || activeSection === 'team') && (
              <div className="space-y-4 py-8 text-center text-slate-400 font-semibold text-xs">
                <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-2">lock</span>
                This panel is restricted to System Administrators.
              </div>
            )}
          </form>

          {/* Action Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSaveSuccess(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
