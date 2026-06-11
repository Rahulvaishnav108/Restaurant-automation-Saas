import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Crown, 
  MapPin, 
  CreditCard, 
  Award, 
  Ticket, 
  Bell, 
  Moon, 
  Sun, 
  ChevronRight, 
  LogOut, 
  CalendarDays, 
  ShoppingBag, 
  Percent, 
  PhoneCall, 
  MessagesSquare 
} from 'lucide-react';
import { useAuth } from '../../../auth/AuthProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-6 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile</h2>
            <p className="text-xs text-slate-500 mt-1">Manage your account settings and dining preferences.</p>
          </div>
          <button 
            onClick={() => navigate('/customer')}
            className="text-xs text-orange-500 font-bold hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 w-full">
        
        {/* Left Column: User details, Stats, Settings (col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Details Main Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-orange-500/10 text-orange-500 ring-4 ring-orange-500/15 flex items-center justify-center font-bold text-3xl uppercase">
                {user?.name?.charAt(0) || 'G'}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{user?.name || 'Guest User'}</h3>
                  <div className="space-y-1.5 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> {user?.email || 'guest@example.com'}
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> +91 98765 43210
                    </span>
                  </div>
                </div>

                <span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 self-start sm:self-center">
                  <Crown className="w-3 h-3 fill-current" /> Smart Member
                </span>
              </div>

              {/* Promo link banner */}
              <div className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/10 flex items-center justify-between hover:border-orange-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/15 text-orange-500 flex items-center justify-center">
                    <Crown className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">You are a Smart Member!</h4>
                    <p className="text-[10px] text-slate-400">Enjoy priority service & custom dining discounts.</p>
                  </div>
                </div>
                <span className="text-[10px] text-orange-500 font-bold hover:translate-x-1 transition-transform">
                  Benefits →
                </span>
              </div>
            </div>
          </div>

          {/* Stats count grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { count: 12, label: 'Reservations', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', icon: CalendarDays },
              { count: 18, label: 'Orders', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20', icon: ShoppingBag },
              { count: 450, label: 'Reward Points', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20', icon: Award },
              { count: 5, label: 'Offers Available', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', icon: Percent },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                <div className={`w-9 h-9 ${stat.bg} ${stat.color} mx-auto rounded-full flex items-center justify-center mb-2`}>
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">{stat.count}</p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Settings / Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Personal Information', desc: 'Update name, email and phone', color: 'text-orange-500', bg: 'bg-orange-50/50 dark:bg-orange-950/10', icon: User, path: '#' },
              { label: 'Saved Addresses', desc: 'Manage delivery table codes', color: 'text-green-500', bg: 'bg-green-50/50 dark:bg-green-950/10', icon: MapPin, path: '#' },
              { label: 'Payment Cards', desc: 'Manage your saved credit/debit options', color: 'text-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-950/10', icon: CreditCard, path: '/customer/checkout' },
              { label: 'Reward Points', desc: 'View rewards ledger and history', color: 'text-purple-500', bg: 'bg-purple-50/50 dark:bg-purple-950/10', icon: Award, path: '#' },
              { label: 'Active Promotions', desc: 'Explore special coupon discounts', color: 'text-yellow-600', bg: 'bg-yellow-50/50 dark:bg-yellow-950/10', icon: Ticket, path: '#' },
              { label: 'Alert Preferences', desc: 'Configure order status alerts', color: 'text-pink-500', bg: 'bg-pink-50/50 dark:bg-pink-950/10', icon: Bell, path: '#' },
            ].map((option, i) => (
              <button 
                key={i} 
                onClick={() => { if(option.path !== '#') navigate(option.path); }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors group w-full text-left"
              >
                <div className={`w-10 h-10 ${option.bg} ${option.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white truncate">{option.label}</h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{option.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Preferences, Help & Logout (col-span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Preferences list */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">System Preferences</h4>
            </div>
            
            <div className="divide-y divide-slate-50 dark:divide-slate-850">
              {/* Theme toggle */}
              <button 
                onClick={handleToggleTheme}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-4.5 h-4.5 text-purple-500" /> : <Sun className="w-4.5 h-4.5 text-yellow-600" />}
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</span>
                </div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">
                  {theme === 'dark' ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Support */}
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Help & Support</span>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

              {/* Privacy */}
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Privacy Policy</span>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Help Contacts */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 p-1">
              <PhoneCall className="w-5 h-5 text-orange-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Quick Support</h4>
                <p className="text-[10px] text-slate-400">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-1">
              <MessagesSquare className="w-5 h-5 text-orange-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Live Assist</h4>
                <p className="text-[10px] text-slate-400">Direct waiter chat helper</p>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="w-full h-12 bg-red-50 hover:bg-red-100 dark:bg-red-950/15 dark:hover:bg-red-950/20 text-red-500 font-bold text-xs rounded-xl flex items-center justify-between px-5 transition-all border border-red-100/30 dark:border-red-900/10 group"
          >
            <span className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" /> Logout
            </span>
            <ChevronRight className="w-4 h-4 text-red-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>

      </div>
    </div>
  );
}
