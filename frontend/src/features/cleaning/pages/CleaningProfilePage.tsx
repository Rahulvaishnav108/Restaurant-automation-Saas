import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCleaning } from '../hooks/usecleaning';

interface ActivityItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  timestamp: string;
  subtitle: string;
}

interface PreferenceItem {
  icon: string;
  label: string;
  value: string;
}

interface BadgeItem {
  title: string;
  desc: string;
  earned: string;
  icon: string;
  bgClass: string;
  shadowClass: string;
}

interface TableTask {
  id: string;
  rawId?: string;
  rawStatus?: 'PENDING' | 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  rawPriority?: 'High' | 'Medium' | 'Low';
  progress?: number;
  waiting?: string;
}

export default function CleaningProfilePage() {
  const navigate = useNavigate();

  const { urgentTasks } = useCleaning();
  const safeTasks: TableTask[] = (urgentTasks || []) as TableTask[];

  // ✅ State for Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
  });

  // ✅ State for Recent Activity Toggle
  const [showAllActivity, setShowAllActivity] = useState(false);

  // ✅ Ref for hidden file input (Photo Upload)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState(
    '[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuDa2YAJKAFQ_1YcbCXr9gWlXaoH1A_IQEjTEvJow9XOiXzf7N3kKDctQGwB_KXYqfHi5PGPLS2I4O9fkKOEGiWdsildQg5Vfmz05wcp_WiN4rZKyxzhEspK03vL9BZsmY_SdVZj9jBt5lCmAfSkMUlzuHsIslYMMEX5Q0WjP3tzo_dJkKtNCBmGtgdDixcta81A9KxtOnzWftBuUDgJv8HOjUm_KQMlyHP7JMggbPxQp6Ewa-AVQYMO3uYRKs2vlrtM8QQdTQx4QhY)'
  );

  const liveCleanedCount = safeTasks.filter(t => t.rawStatus === 'COMPLETED' || t.rawStatus === 'VERIFIED').length;
  const liveInProgressCount = safeTasks.filter((t: TableTask) => t.rawStatus === 'IN_PROGRESS').length;

  const activities: ActivityItem[] = [
    { icon: 'check_circle', iconBg: 'bg-green-100 dark:bg-green-950/30', iconColor: 'text-green-600 dark:text-green-400', title: 'Completed table T01', timestamp: 'Jun 16, 2026', subtitle: 'Dining Area A • 10:30 AM' },
    { icon: 'timer', iconBg: 'bg-orange-100 dark:bg-orange-950/30', iconColor: 'text-orange-600 dark:text-orange-400', title: 'Started cleaning table T12', timestamp: 'Jun 16, 2026', subtitle: 'Dining Area A • 10:18 AM' },
    { icon: 'assignment', iconBg: 'bg-orange-100 dark:bg-orange-950/30', iconColor: 'text-orange-500 dark:text-orange-400', title: 'Completed task', timestamp: 'Jun 16, 2026', subtitle: 'Restroom Sanitization • 09:15 AM' },
    { icon: 'verified', iconBg: 'bg-purple-100 dark:bg-purple-950/30', iconColor: 'text-purple-600 dark:text-purple-400', title: 'Hygiene score updated', timestamp: 'Jun 15, 2026', subtitle: 'Score: 98% (Excellent)' },
    { icon: 'check_circle', iconBg: 'bg-green-100 dark:bg-green-950/30', iconColor: 'text-green-600 dark:text-green-400', title: 'Completed table T05', timestamp: 'Jun 15, 2026', subtitle: 'Dining Area B • 03:45 PM' },
    { icon: 'timer', iconBg: 'bg-orange-100 dark:bg-orange-950/30', iconColor: 'text-orange-600 dark:text-orange-400', title: 'Started cleaning table T08', timestamp: 'Jun 15, 2026', subtitle: 'Dining Area A • 02:30 PM' },
  ];

  const preferences: PreferenceItem[] = [
    { icon: 'location_on', label: 'Preferred Area', value: 'Dining Area A' },
    { icon: 'light_mode', label: 'Preferred Shift', value: 'Morning (6 AM - 2 PM)' },
    { icon: 'calendar_month', label: 'Days Available', value: 'Mon, Tue, Wed, Thu, Fri, Sat' },
    { icon: 'coffee', label: 'Break Preference', value: '1:00 PM - 1:30 PM' },
    { icon: 'fact_check', label: 'Preferred Task Types', value: 'Table Cleaning, Restroom Cleaning, Floor Cleaning' },
  ];

  const badges: BadgeItem[] = [
    { title: 'Consistency Star', desc: 'Completed 20 tasks in a row', earned: 'Earned on Jun 10, 2026', icon: 'star', bgClass: 'bg-green-500', shadowClass: 'shadow-green-250 dark:shadow-none' },
    { title: 'Hygiene Hero', desc: 'Maintained 95%+ hygiene score for a week', earned: 'Earned on Jun 5, 2026', icon: 'shield', bgClass: 'bg-blue-500', shadowClass: 'shadow-blue-250 dark:shadow-none' },
    { title: 'Time Keeper', desc: 'Completed tasks on time for 10 days', earned: 'Earned on May 28, 2026', icon: 'schedule', bgClass: 'bg-purple-500', shadowClass: 'shadow-purple-250 dark:shadow-none' },
    { title: 'Clean Sweep', desc: 'No pending tasks for a full day', earned: 'Earned on May 20, 2026', icon: 'cleaning_services', bgClass: 'bg-orange-500', shadowClass: 'shadow-orange-250 dark:shadow-none' },
    { title: 'Rising Star', desc: 'Top performer of the month', earned: 'Earned on May 1, 2026', icon: 'workspace_premium', bgClass: 'bg-teal-500', shadowClass: 'shadow-teal-250 dark:shadow-none' },
  ];

  // ✅ Handler for photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSaveProfile = () => {
    setIsEditModalOpen(false);
  };

  // ✅ Displayed activities based on toggle
  const displayedActivities = showAllActivity ? activities : activities.slice(0, 4);

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn cleaning-panel">
      {/* ✅ Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-sd-surface-container rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-sans">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="full-name" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                <input id="full-name" type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone-number" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Phone</label>
                <input id="phone-number"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-bold text-white hover:bg-orange-600 transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile and Performance grid */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Profile Overview */}
        <section className="col-span-12 lg:col-span-7 bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800 p-6 shadow-sm">
          {/* ✅ Updated header with Edit Profile button */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-sans">Profile Overview</h3>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[10px] font-bold hover:bg-orange-600 transition-all active:scale-95 font-sans cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit Profile
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative shrink-0">
                <img
                  alt={profileData.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
                  src={profileImage}
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-sd-surface-container rounded-full" />
              </div>
              {/* ✅ Hidden file input for photo upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-orange-500 text-orange-500 dark:text-white dark:border-slate-700 rounded-lg text-[10px] font-bold hover:bg-orange-500/10 transition-all active:scale-95 font-sans cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                Change Photo
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-6 lg:gap-x-8 font-sans text-xs">
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{profileData.name}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Staff ID</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">CS-1024</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">priya.sharma@cleanserve.com</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{profileData.phone}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Role</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">Cleaning Staff</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Department</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">Housekeeping</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Joined On</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">Feb 12, 2024</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                <span className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-455 px-2 py-0.5 rounded text-[10px] font-bold inline-block">Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Summary */}
        <section className="col-span-12 lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-sans">Performance Summary</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold font-sans focus:ring-1 focus:ring-orange-500 px-2.5 py-1 text-slate-700 dark:text-slate-350 outline-none accent-orange-500 cursor-pointer">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mb-2 text-green-600">
                <span className="material-symbols-outlined text-[20px]">done_all</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-855 dark:text-slate-100 leading-none">{12 + liveCleanedCount}</h4>
              <p className="text-[10px] text-slate-400 font-bold font-sans mt-0.5">Tables Cleaned</p>
              <div className="flex items-center gap-0.5 text-green-600 text-[9px] font-bold font-sans mt-2">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                12% vs last month
              </div>
            </div>

            <div className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-orange-500/10 dark:bg-orange-950/30 rounded-full flex items-center justify-center mb-2 text-orange-500">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-855 dark:text-slate-100 leading-none">98%</h4>
              <p className="text-[10px] text-slate-400 font-bold font-sans mt-0.5">Hygiene Score</p>
              <div className="flex items-center gap-0.5 text-green-600 text-[9px] font-bold font-sans mt-2">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                5% vs last month
              </div>
            </div>

            <div className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center mb-2 text-orange-600">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <h4 className="text-xl font-extrabold text-slate-855 dark:text-slate-100 leading-none">24h</h4>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">36m</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold font-sans mt-0.5">Total Work Time</p>
              <div className="flex items-center gap-0.5 text-green-600 text-[9px] font-bold font-sans mt-2">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                8% vs last month
              </div>
            </div>

            <div className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-orange-500/10 dark:bg-orange-950/30 rounded-full flex items-center justify-center mb-2 text-orange-500">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-855 dark:text-slate-100 leading-none">{22 + liveCleanedCount + liveInProgressCount}</h4>
              <p className="text-[10px] text-slate-400 font-bold font-sans mt-0.5">Tasks Completed</p>
              <div className="flex items-center gap-0.5 text-green-600 text-[9px] font-bold font-sans mt-2">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                14% vs last month
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Account Settings, Activity, Work Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <section className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mb-4 font-sans">Account Settings</h3>
          <div className="space-y-1.5">
            {[
              { label: 'Personal Information', desc: 'Update your personal details', icon: 'person' },
              { label: 'Change Password', desc: 'Update your account password', icon: 'lock' },
              { label: 'Notification Preferences', desc: 'Manage your notification settings', icon: 'notifications_active' },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate('/cleaning/settings')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group font-sans text-xs text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-500 transition-colors text-[18px]">{item.icon}</span>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{item.desc}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-450 group-hover:translate-x-0.5 transition-transform text-sm">chevron_right</span>
              </button>
            ))}

            <button
              onClick={() => navigate('/cleaning/settings')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group font-sans text-xs text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-500 transition-colors text-[18px]">language</span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Language</p>
                  <p className="text-[9px] text-slate-400 font-semibold">Choose your preferred language</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-orange-500">English</span>
                <span className="material-symbols-outlined text-slate-450 group-hover:translate-x-0.5 transition-transform text-sm">chevron_right</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/cleaning/settings')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group font-sans text-xs text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-orange-500 transition-colors text-[18px]">dark_mode</span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Theme</p>
                  <p className="text-[9px] text-slate-400 font-semibold">Choose your preferred theme</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-orange-500">Active</span>
                <span className="material-symbols-outlined text-slate-450 group-hover:translate-x-0.5 transition-transform text-sm">chevron_right</span>
              </div>
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-sans">Recent Activity</h3>
            {/* ✅ Functional View All / Show Less toggle */}
            <button
              type="button"
              onClick={() => setShowAllActivity(!showAllActivity)}
              className="text-[10px] font-bold text-orange-500 cursor-pointer hover:underline font-sans"
            >
              {showAllActivity ? 'Show Less' : 'View All'}
            </button>
          </div>

          <div className="space-y-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2.5px] before:bg-slate-100 dark:before:bg-slate-800/80">
            {displayedActivities.map((act, idx) => (
              <div key={idx} className="flex gap-3 relative z-10 font-sans text-xs bg-white dark:bg-sd-surface-container">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.iconBg}`}>
                  <span className={`material-symbols-outlined text-[16px] ${act.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{act.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{act.title}</p>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0 ml-2">{act.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-455 dark:text-slate-400 font-semibold">{act.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Preferences */}
        <section className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800 p-5 shadow-sm md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-sans">Work Preferences</h3>
            <button type="button" onClick={() => alert("Edit clicked!")} className="text-[10px] font-bold text-orange-500 cursor-pointer hover:underline font-sans">Edit</button>
          </div>
          <div className="space-y-4 font-sans text-xs">
            {preferences.map((pref, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-orange-500 text-[16px]">{pref.icon}</span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-455 font-bold uppercase tracking-wider leading-none mb-1">{pref.label}</p>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 leading-tight">{pref.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Badges & Achievements */}
      <section className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-sans">Badges & Achievements</h3>
          <span className="text-xs font-bold text-orange-500 cursor-pointer hover:underline font-sans">View All</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-4 rounded-2xl border border-transparent hover:border-slate-150 dark:hover:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all group font-sans"
            >
              <div className={`w-14 h-14 ${badge.bgClass} rounded-2xl flex items-center justify-center mb-3.5 rotate-3 group-hover:rotate-0 transition-transform shadow-lg ${badge.shadowClass} shrink-0`}>
                <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {badge.icon}
                </span>
              </div>
              <p className="font-extrabold text-xs text-slate-850 dark:text-slate-250 mb-1 leading-snug">{badge.title}</p>
              <p className="text-[10px] text-slate-400 font-semibold mb-2 leading-relaxed">{badge.desc}</p>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{badge.earned}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
