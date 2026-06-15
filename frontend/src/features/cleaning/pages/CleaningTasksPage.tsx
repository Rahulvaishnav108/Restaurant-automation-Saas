import React, { useState } from 'react';
import { useCleaningSearch } from '../components/dashboard/CleaningSearchContext';

interface CleanTask {
  id: string;
  name: string;
  location: string;
  type: string;
  icon: string;
  iconColor: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueTime: string;
  overdue: boolean;
  borderClass: string;
}

export default function CleaningTasksPage() {
  const { searchQuery } = useCleaningSearch();
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [areaFilter, setAreaFilter] = useState('All Area');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New task form state
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskLocation, setNewRequestLocation] = useState('Dining Area A');
  const [newTaskType, setNewTaskType] = useState('Table Cleaning');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const [tasks, setTasks] = useState<CleanTask[]>([
    {
      id: 'TSK-2024-001',
      name: 'Clean Dining Table T07',
      location: 'Dining Area A',
      type: 'Table Cleaning',
      icon: 'table_restaurant',
      iconColor: 'text-blue-500',
      priority: 'High',
      status: 'Pending',
      dueTime: 'Today, 10:00 AM',
      overdue: true,
      borderClass: 'border-l-red-500',
    },
    {
      id: 'TSK-2024-002',
      name: 'Restroom Sanitization',
      location: 'Restroom - 2F',
      type: 'Sanitization',
      icon: 'sanitizer',
      iconColor: 'text-purple-500',
      priority: 'Medium',
      status: 'In Progress',
      dueTime: 'Today, 11:00 AM',
      overdue: false,
      borderClass: 'border-l-orange-500',
    },
    {
      id: 'TSK-2024-006',
      name: 'Window Cleaning',
      location: 'Conference Room A',
      type: 'Deep Cleaning',
      icon: 'cleaning_bucket',
      iconColor: 'text-cyan-500',
      priority: 'Low',
      status: 'Completed',
      dueTime: 'Today, 09:30 AM',
      overdue: false,
      borderClass: 'border-l-green-500',
    },
    {
      id: 'TSK-2024-009',
      name: 'Restroom Supplies Check',
      location: 'Restroom - 3F',
      type: 'Inspection',
      icon: 'inventory',
      iconColor: 'text-indigo-500',
      priority: 'Low',
      status: 'Pending',
      dueTime: 'Tomorrow, 09:00 AM',
      overdue: false,
      borderClass: 'border-l-blue-400',
    },
    {
      id: 'TSK-2024-010',
      name: 'Floor Disinfection',
      location: 'Pantry Area',
      type: 'Sanitization',
      icon: 'sanitizer',
      iconColor: 'text-purple-500',
      priority: 'Medium',
      status: 'Pending',
      dueTime: 'Tomorrow, 10:00 AM',
      overdue: false,
      borderClass: 'border-l-orange-400',
    },
  ]);

  // Statistics counters calculation
  const totalCount = tasks.length + 19; // padded to match 24
  const pendingCount = tasks.filter(t => t.status === 'Pending').length + 5;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length + 10;
  const completedCount = tasks.filter(t => t.status === 'Completed').length + 3;
  const overdueCount = tasks.filter(t => t.overdue && t.status !== 'Completed').length + 1;

  // Add a task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName) return;
    const newId = `TSK-2024-0${tasks.length + 12}`;

    const newTask: CleanTask = {
      id: newId,
      name: newTaskName,
      location: newTaskLocation,
      type: newTaskType,
      icon: newTaskType === 'Table Cleaning' ? 'table_restaurant' : newTaskType === 'Sanitization' ? 'sanitizer' : newTaskType === 'Deep Cleaning' ? 'cleaning_bucket' : 'inventory',
      iconColor: newTaskType === 'Table Cleaning' ? 'text-blue-500' : newTaskType === 'Sanitization' ? 'text-purple-500' : newTaskType === 'Deep Cleaning' ? 'text-cyan-500' : 'text-indigo-500',
      priority: newTaskPriority,
      status: 'Pending',
      dueTime: 'Today, 04:00 PM',
      overdue: false,
      borderClass: newTaskPriority === 'High' ? 'border-l-red-500' : newTaskPriority === 'Medium' ? 'border-l-orange-500' : 'border-l-blue-400',
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskName('');
    setShowAddModal(false);
  };

  // Toggle task status
  const handleToggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'Pending' ? 'In Progress' : t.status === 'In Progress' ? 'Completed' : 'Pending';
          return {
            ...t,
            status: nextStatus,
            overdue: nextStatus === 'Completed' ? false : t.overdue,
          };
        }
        return t;
      })
    );
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All Priority' || t.priority === priorityFilter;
    const matchesArea = areaFilter === 'All Area' || t.location.includes(areaFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesArea;
  });

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn cleaning-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Tasks</h1>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">View and manage your assigned cleaning and hygiene tasks.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-cleanserve-primary hover:bg-cleanserve-primary-container text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-cleanserve-primary/10 cursor-pointer text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Task
          </button>
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-xs">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-cleanserve-primary/10 flex items-center justify-center text-cleanserve-primary dark:text-blue-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">assignment</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{totalCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Total Tasks</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">schedule</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{pendingCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Pending</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">sync</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{inProgressCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">In Progress</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{completedCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Completed</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">error</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{overdueCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Overdue</p>
          </div>
        </div>
      </section>

      {/* Toolbar & Filter Bar */}
      <section className="bg-white dark:bg-sd-surface-container p-4 rounded-t-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans py-2 px-3 focus:ring-2 focus:ring-cleanserve-primary font-bold text-slate-700 dark:text-slate-200"
          >
            <option>All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans py-2 px-3 focus:ring-2 focus:ring-cleanserve-primary font-bold text-slate-700 dark:text-slate-200"
          >
            <option>All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={areaFilter}
            onChange={e => setAreaFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans py-2 px-3 focus:ring-2 focus:ring-cleanserve-primary font-bold text-slate-700 dark:text-slate-200"
          >
            <option>All Area</option>
            <option value="Dining Area">Dining Area</option>
            <option value="Restroom">Restroom</option>
            <option value="Pantry">Pantry Area</option>
            <option value="Conference">Conference Room</option>
          </select>
          
          <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 text-xs font-sans font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
            <span className="material-symbols-outlined text-[16px]">filter_alt</span>
            Filter
          </button>
        </div>

        <div className="ml-auto text-[10px] text-slate-450 dark:text-slate-400 font-sans font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">autorenew</span>
          Last updated: Just now
        </div>
      </section>

      {/* Tasks Table */}
      <section className="bg-white dark:bg-sd-surface-container rounded-b-2xl border-x border-b border-slate-150 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-550 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Task ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Task Name</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Table / Location</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Due Time</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No hygiene tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(row => (
                  <tr key={row.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-l-4 ${row.borderClass} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap font-extrabold text-cleanserve-primary">{row.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold">{row.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-355">
                        <span className={`material-symbols-outlined text-[16px] ${row.iconColor}`}>{row.icon}</span>
                        {row.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.priority === 'High'
                          ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                          : row.priority === 'Medium'
                            ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400'
                            : 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                      }`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleTaskStatus(row.id)}
                        className={`px-3 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                          row.status === 'Completed'
                            ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                            : row.status === 'In Progress'
                              ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30'
                              : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                        }`}
                      >
                        {row.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap leading-relaxed">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{row.dueTime}</div>
                      {row.overdue && row.status !== 'Completed' && (
                        <span className="text-[10px] text-error font-extrabold uppercase tracking-tighter">Overdue</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-850/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-450 font-bold">Showing 1 to {filteredTasks.length} of {totalCount} tasks</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-450 font-bold">Rows per page</span>
              <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1 px-2 focus:ring-1 focus:ring-cleanserve-primary outline-none">
                <option>5</option>
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 bg-cleanserve-primary text-white font-bold rounded-lg">1</button>
              <button className="w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 font-bold rounded-lg">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Widget Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-sd-surface-container p-6 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 font-sans">Weekly Cleaning Efficiency</h3>
          <div className="flex items-end gap-3 h-32 pl-4 border-l border-slate-100 dark:border-slate-800">
            {[
              { day: 'MON', height: 'h-[60%]', pct: '60%' },
              { day: 'TUE', height: 'h-[45%]', pct: '45%' },
              { day: 'WED', height: 'h-[85%]', pct: '85%' },
              { day: 'THU', height: 'h-[30%]', pct: '30%' },
              { day: 'FRI', height: 'h-[70%]', pct: '70%' },
            ].map(col => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div className={`w-full bg-cleanserve-primary/20 dark:bg-cleanserve-primary/10 group-hover:bg-cleanserve-primary/40 rounded-t-lg ${col.height} transition-all relative`}>
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {col.pct}
                  </span>
                </div>
                <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold font-sans">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-cleanserve-primary to-blue-800 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 font-sans">
            <h3 className="font-extrabold text-sm mb-2">Efficiency Tip</h3>
            <p className="text-xs opacity-90 leading-relaxed">
              Focus on &quot;High Priority&quot; tasks in Dining Area A first to maintain peak service hygiene during peak dining rush hours.
            </p>
          </div>
          <div className="mt-4 relative z-10">
            <button className="bg-white/25 hover:bg-white/35 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95">
              View Efficiency Report
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/10 rounded-full blur-2xl shrink-0" />
        </div>
      </section>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-sd-surface-container rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-sm">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-1 font-sans">Assign New Cleaning Task</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-450 mb-4 font-sans leading-relaxed">
              Log a manual cleanup, deep scrubbing, or supply replenishment duty.
            </p>
            <form onSubmit={handleAddTask} className="space-y-4 font-sans text-xs">
              <div>
                <label htmlFor="new-task-name" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Task Description</label>
                <input
                  id="new-task-name"
                  type="text"
                  placeholder="e.g. Sanitize table station T08"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-task-location" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Task Area</label>
                  <input
                    id="new-task-location"
                    type="text"
                    placeholder="e.g. Dining Area B"
                    value={newTaskLocation}
                    onChange={(e) => setNewRequestLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-task-type" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Task Type</label>
                  <select
                    id="new-task-type"
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Table Cleaning">Table Cleaning</option>
                    <option value="Sanitization">Sanitization</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="new-task-priority" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Priority Urgency</label>
                <select
                  id="new-task-priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cleanserve-primary text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
