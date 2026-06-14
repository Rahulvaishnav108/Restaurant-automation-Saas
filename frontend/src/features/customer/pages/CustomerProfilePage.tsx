import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../app/providers/ThemeProvider';

const STATS = [
  { icon: 'event_available', value: '12', label: 'Reservations', color: 'bg-orange-100 text-orange-600' },
  { icon: 'shopping_bag', value: '18', label: 'Orders', color: 'bg-green-100 text-green-600' },
  { icon: 'stars', value: '450', label: 'Reward Points', color: 'bg-purple-100 text-purple-600' },
  { icon: 'sell', value: '5', label: 'Offers', color: 'bg-blue-100 text-blue-600' },
];

const MENU_ITEMS = [
  { icon: 'person_outline', label: 'Personal Information', desc: 'Update your name, email and phone', color: 'bg-orange-50 text-orange-500' },
  { icon: 'location_on', label: 'Addresses', desc: 'Manage your saved delivery addresses', color: 'bg-green-50 text-green-500' },
  { icon: 'credit_card', label: 'Payment Methods', desc: 'Add or manage your payment cards', color: 'bg-blue-50 text-blue-500' },
  { icon: 'star_outline', label: 'Reward Points', desc: 'View your reward points and history', color: 'bg-purple-50 text-purple-500', badge: '450 Pts' },
  { icon: 'confirmation_number', label: 'Offers & Coupons', desc: 'View available restaurant offers', color: 'bg-red-50 text-red-500', badge: '5 Available' },
  { icon: 'notifications_active', label: 'Notifications', desc: 'Manage your alert preferences', color: 'bg-yellow-50 text-yellow-600' },
];

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [themeExpanded, setThemeExpanded] = useState(false);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-full sd-custom-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-sd-on-surface font-sans">Profile</h2>
        <p className="text-sm text-sd-on-surface-variant font-sans">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-5 border border-sd-surface-variant sd-food-card-shadow flex flex-col sm:flex-row gap-5 items-start">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sd-primary-container/30 to-sd-primary-fixed-dim overflow-hidden flex items-center justify-center ring-4 ring-sd-primary-fixed shadow-md">
                <span className="material-symbols-outlined text-4xl text-sd-primary/60" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center border border-sd-surface-variant text-sd-on-surface-variant hover:text-sd-primary transition-colors">
                <span className="material-symbols-outlined text-[14px]">edit</span>
              </button>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h3 className="text-xl font-bold text-sd-on-surface font-sans">Rahul Sharma</h3>
                  <div className="flex items-center gap-2 mt-1 text-sd-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span className="text-sm font-semibold font-sans">+91 98765 43210</span>
                  </div>
                </div>
                <div className="bg-sd-primary-fixed/30 text-sd-primary px-3 py-1 rounded-full flex items-center gap-1 self-start">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  <span className="text-xs font-bold font-sans">Smart Member</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-sd-surface-container-low rounded-xl flex items-center justify-between group cursor-pointer border border-transparent hover:border-sd-primary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-sd-primary-container/10 rounded-full flex items-center justify-center text-sd-primary-container">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold font-sans">You&apos;re a Smart Member!</p>
                    <p className="text-[11px] text-sd-on-surface-variant font-sans">Enjoy exclusive benefits and priority service.</p>
                  </div>
                </div>
                <span className="text-sd-primary font-bold text-xs group-hover:translate-x-1 transition-transform font-sans">View →</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(({ icon, value, label, color }) => (
              <div key={label} className="bg-white p-3.5 rounded-xl border border-sd-surface-variant text-center hover:shadow-md transition-all sd-food-card-shadow">
                <div className={`w-9 h-9 mx-auto rounded-full ${color} flex items-center justify-center mb-2`}>
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </div>
                <p className="text-base font-bold font-sans">{value}</p>
                <p className="text-[11px] text-sd-on-surface-variant font-sans">{label}</p>
              </div>
            ))}
          </div>

          {/* Menu Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MENU_ITEMS.map(({ icon, label, desc, color, badge }) => (
              <button key={label} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-sd-surface-variant hover:bg-sd-surface-container-low transition-colors group text-left">
                <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold font-sans truncate">{label}</p>
                    {badge && (
                      <span className="bg-sd-secondary/10 text-sd-secondary px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 font-sans">{badge}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-sd-on-surface-variant font-sans truncate">{desc}</p>
                </div>
                <span className="material-symbols-outlined text-sd-surface-variant group-hover:text-sd-primary transition-colors text-[18px] shrink-0">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Preferences */}
          <div className="bg-white rounded-xl border border-sd-surface-variant sd-food-card-shadow overflow-hidden">
            <div className="px-4 py-3 bg-sd-surface-container-low border-b border-sd-surface-variant">
              <p className="text-sm font-bold font-sans">Preferences</p>
            </div>
            <div className="divide-y divide-sd-surface-variant">
              {/* Theme Preferences Accordion/Toggle */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setThemeExpanded(!themeExpanded)}
                  className="w-full flex items-center justify-between p-4 hover:bg-sd-surface-container-low transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-purple-600 text-[20px]">palette</span>
                    <span className="text-sm font-bold font-sans">Theme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-sd-primary font-bold font-sans capitalize">{theme}</span>
                    <span className={`material-symbols-outlined text-sd-surface-variant group-hover:text-sd-primary transition-all text-[18px] ${themeExpanded ? 'rotate-90' : ''}`}>
                      chevron_right
                    </span>
                  </div>
                </button>
                {themeExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-sd-surface-container-low/50 flex flex-col gap-2 border-t border-sd-surface-variant/40">
                    <p className="text-[11px] text-sd-on-surface-variant font-bold mb-1">Select Appearance</p>
                    <div className="flex gap-2">
                      {(['light', 'dark', 'system'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setTheme(mode)}
                          className={`flex-1 py-2 border rounded-xl text-center capitalize text-xs font-bold font-sans transition-all ${
                            theme === mode
                              ? 'bg-sd-primary-container/10 border-sd-primary-container text-sd-primary'
                              : 'bg-white border-sd-outline-variant text-sd-on-surface-variant hover:bg-sd-surface-container-low'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Other Preferences */}
              <button className="w-full flex items-center justify-between p-4 hover:bg-sd-surface-container-low transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">support_agent</span>
                  <span className="text-sm font-bold font-sans">Help & Support</span>
                </div>
                <span className="material-symbols-outlined text-sd-surface-variant group-hover:text-sd-primary transition-all text-[18px] group-hover:translate-x-1">chevron_right</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-sd-surface-container-low transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600 text-[20px]">verified_user</span>
                  <span className="text-sm font-bold font-sans">Privacy Policy</span>
                </div>
                <span className="material-symbols-outlined text-sd-surface-variant group-hover:text-sd-primary transition-all text-[18px] group-hover:translate-x-1">chevron_right</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-sd-surface-container-low transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-orange-600 text-[20px]">description</span>
                  <span className="text-sm font-bold font-sans">Terms & Conditions</span>
                </div>
                <span className="material-symbols-outlined text-sd-surface-variant group-hover:text-sd-primary transition-all text-[18px] group-hover:translate-x-1">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <div className="bg-sd-primary-container/5 rounded-xl p-4 border border-sd-primary-container/10 flex items-center gap-3">
              <div className="w-9 h-9 bg-sd-primary-container text-white rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </div>
              <div>
                <p className="text-xs font-bold font-sans">Need Help?</p>
                <p className="text-[11px] text-sd-on-surface-variant font-sans">Call us at +91 98765 43210</p>
              </div>
            </div>
            <div className="bg-sd-tertiary-container/5 rounded-xl p-4 border border-sd-tertiary-container/10 flex items-center gap-3">
              <div className="w-9 h-9 bg-sd-tertiary-container text-white rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </div>
              <div>
                <p className="text-xs font-bold font-sans">Live Chat</p>
                <p className="text-[11px] text-sd-on-surface-variant font-sans">Chat with our support team</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 text-[20px]">logout</span>
              <span className="text-sm font-bold text-red-600 font-sans">Logout</span>
            </div>
            <span className="material-symbols-outlined text-red-300 group-hover:text-red-600 transition-all text-[18px] group-hover:translate-x-1">chevron_right</span>
          </button>
          <p className="text-center text-[11px] text-sd-on-surface-variant font-sans">Smart Dining App v2.4.1</p>
        </div>
      </div>
    </div>
  );
}
