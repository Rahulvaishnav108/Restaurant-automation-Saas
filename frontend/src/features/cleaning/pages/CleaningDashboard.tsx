import React, { useState } from 'react';
import { useCleaningSearch } from '../components/dashboard/CleaningSearchContext';

interface TableItem {
  id: string;
  seats: number;
  timeAgo: string;
  priority: 'High' | 'Medium' | 'Low';
  priorityClass: string;
  priorityTextClass: string;
  iconColor: string;
}

interface InProgressItem {
  id: string;
  progress: number;
  timeAgo: string;
}

interface CompletedItem {
  id: string;
  time: string;
  seats: number;
}

interface HygieneTask {
  id: string;
  name: string;
  lastDone: string;
  icon: string;
  colorClass: string;
  textColor: string;
  completed: boolean;
}

export default function CleaningDashboard() {
  const { searchQuery } = useCleaningSearch();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequestTable, setNewRequestTable] = useState('');
  const [newRequestPriority, setNewRequestPriority] = useState('Medium');
  
  // State for Tables to Clean
  const [tablesToClean, setTablesToClean] = useState<TableItem[]>([
    { id: 'T07', seats: 4, timeAgo: 'Just Now', priority: 'High', priorityClass: 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400', priorityTextClass: 'text-red-600 dark:text-red-400', iconColor: 'text-red-500 dark:text-red-400' },
    { id: 'T12', seats: 2, timeAgo: '2 min ago', priority: 'Medium', priorityClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400', priorityTextClass: 'text-orange-600 dark:text-orange-400', iconColor: 'text-orange-500 dark:text-orange-400' },
    { id: 'T03', seats: 6, timeAgo: '4 min ago', priority: 'Medium', priorityClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400', priorityTextClass: 'text-orange-600 dark:text-orange-400', iconColor: 'text-orange-500 dark:text-orange-400' },
    { id: 'T15', seats: 3, timeAgo: '5 min ago', priority: 'Low', priorityClass: 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400', priorityTextClass: 'text-green-650 dark:text-green-400', iconColor: 'text-green-500 dark:text-green-400' },
    { id: 'T09', seats: 2, timeAgo: '6 min ago', priority: 'Low', priorityClass: 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400', priorityTextClass: 'text-green-650 dark:text-green-400', iconColor: 'text-green-500 dark:text-green-400' },
    { id: 'T21', seats: 4, timeAgo: '7 min ago', priority: 'Low', priorityClass: 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400', priorityTextClass: 'text-green-650 dark:text-green-400', iconColor: 'text-green-500 dark:text-green-400' },
  ]);

  // State for In Progress
  const [inProgress, setInProgress] = useState<InProgressItem[]>([
    { id: 'T05', progress: 45, timeAgo: 'Started 3 min ago' },
    { id: 'T11', progress: 60, timeAgo: 'Started 5 min ago' },
  ]);

  // State for Completed Today
  const [completedToday, setCompletedToday] = useState<CompletedItem[]>([
    { id: 'T01', time: '10:30 AM', seats: 4 },
    { id: 'T02', time: '10:18 AM', seats: 2 },
    { id: 'T04', time: '10:05 AM', seats: 6 },
  ]);

  // State for Hygiene Tasks
  const [hygieneTasks, setHygieneTasks] = useState<HygieneTask[]>([
    { id: '1', name: 'Restroom Sanitization', lastDone: '09:15 AM', icon: 'sanitizer', colorClass: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400', textColor: 'text-purple-600', completed: false },
    { id: '2', name: 'Waste Bin Check', lastDone: '09:20 AM', icon: 'delete', colorClass: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400', textColor: 'text-blue-600', completed: false },
    { id: '3', name: 'Floor Sanitization', lastDone: '09:25 AM', icon: 'mop', colorClass: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400', textColor: 'text-orange-600', completed: false },
  ]);

  // Stats Counters
  const totalTablesToClean = tablesToClean.length;
  const totalInProgress = inProgress.length;
  const totalCleanedToday = completedToday.length;
  const hygieneScore = '98%';

  // Action: Start Cleaning (Move from Pending to In Progress)
  const handleStartCleaning = (table: TableItem) => {
    setTablesToClean(prev => prev.filter(t => t.id !== table.id));
    setInProgress(prev => [
      ...prev,
      { id: table.id, progress: 10, timeAgo: 'Started Just Now' }
    ]);
  };

  // Action: Increment progress or complete cleaning
  const handleContinue = (item: InProgressItem) => {
    if (item.progress >= 90) {
      // Complete item
      setInProgress(prev => prev.filter(i => i.id !== item.id));
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setCompletedToday(prev => [
        { id: item.id, time: timeStr, seats: 4 },
        ...prev
      ]);
    } else {
      // Increment progress
      setInProgress(prev => prev.map(i => i.id === item.id ? { ...i, progress: i.progress + 20, timeAgo: 'Updated Just Now' } : i));
    }
  };

  // Action: Complete Hygiene Task
  const handleToggleHygieneTask = (id: string) => {
    setHygieneTasks(prev => prev.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return {
          ...t,
          completed,
          lastDone: completed ? `Completed at ${timeStr}` : '09:15 AM'
        };
      }
      return t;
    }));
  };

  // Action: Raise New Request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestTable.trim()) return;
    const tableId = newRequestTable.toUpperCase().startsWith('T') ? newRequestTable.toUpperCase() : `T${newRequestTable}`;
    
    // Add to Tables to Clean
    setTablesToClean(prev => [
      {
        id: tableId,
        seats: 4,
        timeAgo: 'Just Now',
        priority: newRequestPriority as 'High' | 'Medium' | 'Low',
        priorityClass: newRequestPriority === 'High' 
          ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' 
          : newRequestPriority === 'Medium' 
            ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400' 
            : 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400',
        priorityTextClass: newRequestPriority === 'High' ? 'text-red-650 dark:text-red-400' : newRequestPriority === 'Medium' ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400',
        iconColor: newRequestPriority === 'High' ? 'text-red-500 dark:text-red-400' : newRequestPriority === 'Medium' ? 'text-orange-500 dark:text-orange-400' : 'text-green-500 dark:text-green-400'
      },
      ...prev
    ]);
    
    setNewRequestTable('');
    setShowRequestModal(false);
  };

  // Filter lists based on Search Query
  const filteredTablesToClean = tablesToClean.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.priority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInProgress = inProgress.filter(i => 
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompleted = completedToday.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHygiene = hygieneTasks.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn cleaning-panel">
      {/* Top Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-sd-surface-container p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full bg-cleanserve-primary/10 flex items-center justify-center text-cleanserve-primary shrink-0">
            <span className="material-symbols-outlined text-[24px]">table_restaurant</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{totalTablesToClean}</h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 font-sans">Tables to Clean</p>
            <span className="text-[10px] font-bold text-cleanserve-primary uppercase tracking-wider mt-0.5 inline-block">Pending</span>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full bg-cleanserve-tertiary-container/10 flex items-center justify-center text-cleanserve-tertiary shrink-0">
            <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{totalInProgress}</h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 font-sans">In Progress</p>
            <span className="text-[10px] font-bold text-cleanserve-tertiary uppercase tracking-wider mt-0.5 inline-block">Cleaning</span>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-455 shrink-0">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{totalCleanedToday}</h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 font-sans">Cleaned Today</p>
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mt-0.5 inline-block font-sans">Completed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{hygieneScore}</h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 font-sans">Hygiene Score</p>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-455 uppercase tracking-wider mt-0.5 inline-block font-sans">Excellent</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Tables to Clean */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-150 font-sans tracking-tight">Tables to Clean</h2>
                <span className="bg-cleanserve-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{tablesToClean.length}</span>
              </div>
            </div>

            {filteredTablesToClean.length === 0 ? (
              <div className="bg-white dark:bg-sd-surface-container border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-700">playlist_add_check</span>
                <p className="text-xs font-semibold">No pending tables to clean matching search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTablesToClean.map(table => (
                  <div
                    key={table.id}
                    className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-cleanserve-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined ${table.iconColor}`}>table_restaurant</span>
                          <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">{table.id}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${table.priorityClass}`}>
                          {table.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-450 dark:text-slate-400 text-[10px] mb-4 font-sans font-semibold">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">groups</span>
                          {table.seats} Seats
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {table.timeAgo}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartCleaning(table)}
                      className="w-full py-2 bg-white dark:bg-slate-800 border border-cleanserve-primary text-cleanserve-primary dark:text-white dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-cleanserve-primary hover:text-white dark:hover:bg-cleanserve-primary transition-all active:scale-95"
                    >
                      Start Cleaning
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Today List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-150 font-sans tracking-tight">Completed Today</h2>
                <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{completedToday.length}</span>
              </div>
            </div>

            {filteredCompleted.length === 0 ? (
              <div className="bg-white dark:bg-sd-surface-container border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-400">
                <p className="text-xs">No completed tables to show.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCompleted.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 font-sans text-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.id}</span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold">{item.seats} Seats</span>
                    <span className="text-slate-450 dark:text-slate-400 font-bold">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In Progress & Features */}
        <div className="col-span-12 lg:col-span-5 space-y-6 md:space-y-8">
          {/* In Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-150 font-sans tracking-tight">In Progress</h2>
                <span className="bg-cleanserve-tertiary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{inProgress.length}</span>
              </div>
            </div>

            {filteredInProgress.length === 0 ? (
              <div className="bg-white dark:bg-sd-surface-container border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-400">
                <p className="text-xs">No active cleaning tasks in progress.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredInProgress.map(item => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center"
                  >
                    {/* circular progress svg */}
                    <div className="relative w-16 h-16 mb-3">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          className="text-slate-100 dark:text-slate-800"
                          cx="32"
                          cy="32"
                          fill="transparent"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <circle
                          className="text-cleanserve-primary"
                          cx="32"
                          cy="32"
                          fill="transparent"
                          r="26"
                          stroke="currentColor"
                          strokeDasharray="163.3"
                          strokeDashoffset={163.3 - (163.3 * item.progress) / 100}
                          strokeWidth="3.5"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-xs font-sans text-slate-850 dark:text-slate-200">
                        {item.progress}%
                      </div>
                    </div>

                    <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-0.5">{item.id}</div>
                    <p className="text-[10px] text-slate-400 mb-3 font-sans font-semibold">{item.timeAgo}</p>
                    <button
                      onClick={() => handleContinue(item)}
                      className="w-full py-1.5 border border-cleanserve-primary text-cleanserve-primary dark:text-white dark:border-slate-700 rounded-xl text-[11px] font-bold hover:bg-cleanserve-primary hover:text-white transition-all active:scale-95"
                    >
                      {item.progress >= 90 ? 'Complete' : 'Continue'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-150 font-sans tracking-tight">Cleaning Request Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowRequestModal(true)}
                className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:scale-[1.02] transition-transform flex flex-col items-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-cleanserve-primary mb-3 group-hover:bg-cleanserve-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">add_task</span>
                </div>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">New Request</span>
                <span className="text-[9px] text-slate-400 leading-tight">Request cleaning for any table.</span>
              </button>

              <button
                className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:scale-[1.02] transition-transform flex flex-col items-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">history</span>
                </div>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">Request History</span>
                <span className="text-[9px] text-slate-400 leading-tight">View all your past requests.</span>
              </button>

              <button
                className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center hover:scale-[1.02] transition-transform flex flex-col items-center group cursor-pointer col-span-2"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">stars</span>
                </div>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">Special Request</span>
                <span className="text-[9px] text-slate-400 leading-tight">Add notes for special cleaning.</span>
              </button>
            </div>
          </div>

          {/* Branding Card */}
          <div className="bg-gradient-to-br from-cleanserve-primary to-blue-700 p-6 rounded-2xl relative overflow-hidden text-white shadow-md">
            <div className="absolute -right-4 -bottom-4 opacity-15 transform rotate-12 shrink-0">
              <span className="material-symbols-outlined text-[100px]">cleaning_services</span>
            </div>
            <h3 className="text-sm font-extrabold mb-1 font-sans">Keep It Clean, Keep It Safe</h3>
            <p className="text-[11px] opacity-90 mb-4 relative z-10 font-sans leading-relaxed">
              Your efforts make our space better for everyone. Thank you for your dedication!
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-white">verified</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Daily Hygiene Champion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hygiene Tasks Footer */}
      <section className="space-y-4 pb-8">
        <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-150 font-sans tracking-tight">Hygiene Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {filteredHygiene.map(task => (
            <div
              key={task.id}
              className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 font-sans">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${task.colorClass}`}>
                  <span className="material-symbols-outlined text-[20px]">{task.icon}</span>
                </div>
                <div>
                  <p className={`font-bold text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {task.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">{task.lastDone}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleHygieneTask(task.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border font-sans transition-all active:scale-95 shrink-0 ${
                  task.completed
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                    : 'bg-cleanserve-primary-container text-white border-transparent hover:opacity-90'
                }`}
              >
                {task.completed ? 'Completed' : 'Mark Done'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* New Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-sd-surface-container rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-sm">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-1 font-sans">Create Cleaning Request</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 mb-4 font-sans leading-relaxed">
              Raise a manual cleaning request for any table station.
            </p>
            <form onSubmit={handleCreateRequest} className="space-y-4 font-sans text-xs">
              <div>
                <label htmlFor="new-request-table" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Table Number</label>
                <input
                  id="new-request-table"
                  type="text"
                  placeholder="e.g. T08, T14"
                  value={newRequestTable}
                  onChange={(e) => setNewRequestTable(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Priority</span>
                <div className="grid grid-cols-3 gap-2">
                  {['High', 'Medium', 'Low'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewRequestPriority(p)}
                      className={`py-2 rounded-lg font-bold border transition-all ${
                        newRequestPriority === p
                          ? 'border-cleanserve-primary bg-cleanserve-surface-container-low text-cleanserve-primary dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cleanserve-primary text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
                >
                  Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
