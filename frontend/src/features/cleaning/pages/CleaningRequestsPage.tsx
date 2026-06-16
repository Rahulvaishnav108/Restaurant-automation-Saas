import React, { useState } from 'react';
import { useCleaningSearch } from '../components/dashboard/CleaningSearchContext';

interface CleaningRequest {
  id: string;
  type: string;
  icon: string;
  iconColor: string;
  location: string;
  requestedBy: { name: string; avatar: string };
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Scheduled' | 'Completed' | 'Cancelled';
  requestedOn: string;
  requestedTime: string;
  assignedTo: { name: string; avatar: string } | null;
}

export default function CleaningRequestsPage() {
  const { searchQuery } = useCleaningSearch();
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [typeFilter, setTypeFilter] = useState('All Type');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New request form state
  const [newRequestType, setNewRequestType] = useState('Spill Cleanup');
  const [newRequestLocation, setNewRequestLocation] = useState('Dining Area A');
  const [newRequestPriority, setNewRequestPriority] = useState('Medium');

  const [requests, setRequests] = useState<CleaningRequest[]>([
    {
      id: 'CR-2024-036',
      type: 'Spill Cleanup',
      icon: 'water_drop',
      iconColor: 'text-blue-500',
      location: 'Dining Area A',
      requestedBy: {
        name: 'Ramesh K.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1EeclPIzb65zLML4Z-Ep8QnCj_Ey68uOYKOfFtZuK_k5ILmHPwi-DSDwYreE9ju4D4Z79Hp6UeAKZXSwBOURkmGSQ7hNQ8-lDeQGBfmjcHltnwofvxh67WrZSDukcUkwZiuZjqYa74AhkTFTcLWqysc21n_T9l3J9vkmkj_lFhXuaPU189ige8Tlb5foWMvGnW27LhowBJk4dHeUfzWcmeRluinE4acRYrVtfGNEr0sYCTnJ1sdGsg1NYN3HFCrqzkH0-TJrClE',
      },
      priority: 'High',
      status: 'In Progress',
      requestedOn: 'May 15, 2024',
      requestedTime: '10:32 AM',
      assignedTo: {
        name: 'Anita S.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANsaeL1qIrdjS8VjlskxOHt17ofWL0mQA8HTEyUyGUmb0WZEoFeVIhAYDxByw8LuxWxFKIdV270hwAPBmZFNJdIOoLB7X4CRStTLzQ66uJ709k9Kvpbt3yDChYZmi0IOgzaKGIARmUFWTp8fiuOG-poilaUus94iK5MEMaPofwxQGipJFvuis9fWEp53IS84fln5N1GSiP7xWII9WnJi1qTw5gFY4eKQQgrXVlslMwV6TbZi4nnm2vGRG3hjoOoFQyNc23SGR4j9U',
      },
    },
    {
      id: 'CR-2024-035',
      type: 'Restroom Cleaning',
      icon: 'wc',
      iconColor: 'text-orange-500',
      location: 'Restroom - 2F',
      requestedBy: {
        name: 'Neha P.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCqr4e8byTqYVEco_pDW4qhZEqlgAUl1EJtja5E7M0DsWBRQksSrV2cNSmUST_fov_CV2hnYcM50GF3AkdkQA9DyJZde8ZspYRdgShSSD26dFTuWIwAbzdIvstrRk30fD9pPGgoU4JRWaj2g0d1aG1CmfFRSuMEMHwaoYzmGlVXVxFevi1v5yCQ_IVcPyjTPBGHOwAap0atLBs5Dqs-X7eruzqijqYj8_pwZ-YMwRFz1A3UCbOAr_6HFTQ-k2FKDAEh88YYdGpaFU',
      },
      priority: 'Medium',
      status: 'In Progress',
      requestedOn: 'May 15, 2024',
      requestedTime: '09:15 AM',
      assignedTo: {
        name: 'Vikram P.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA--L3CSbZtR0isayAQeKWVqEYUnJm50z5jjO9pkKQN7ksNy8Vgt62aZwgUrLRnYBtnpNDDk4IRK7ognEaSVtSVSsdI0zIDiq4N90jHPW5P1ONLpdO51I3sP-vvCRQnQTsfxs1Via1HEmQcJeHVGQ6-nNWKCActOegeFVwkpjBzRiXJlzDX15TkbA-90HDUzdz54FoQmsFcObFCGuXAmvK2KTyMt9nyMhl5nHPEV0d4sIjpe9An60OytiSZxSfYVdBG1nSHlTyW1aA',
      },
    },
    {
      id: 'CR-2024-034',
      type: 'Waste Overflow',
      icon: 'delete_sweep',
      iconColor: 'text-green-500',
      location: 'Floor 1 - Bin Area',
      requestedBy: {
        name: 'Arjun M.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMuJxZQR_YtZH7wBUBKMUok7Wqz36--2sIHsFaSXIr96537_DvQx3o7K7noxmPz5xGq5BKdGskM1xMAEMA5fAFZvo7YQerQKZl1ptgjWLXygk3u1kckS0uZqVG2oSizoXvAP2XTG2syLKMghp7Cwa8MxWxmGXEbwA1Nv90r7JibUa7elmbR2v2G-hLyb7YDTt_fgweiz47UTQa305KOfr0LyTFYJR53gHjbuq3fNefA03IZ3zlj8Ock9tFEPdU2gumaXaciMmA9-g',
      },
      priority: 'High',
      status: 'Scheduled',
      requestedOn: 'May 14, 2024',
      requestedTime: '04:45 PM',
      assignedTo: null,
    },
    {
      id: 'CR-2024-033',
      type: 'Dusting',
      icon: 'air',
      iconColor: 'text-blue-400',
      location: 'Conference Room A',
      requestedBy: {
        name: 'Sneha R.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP6Q2ZvHO-8-Qu3fQhaQ9IZAD5384hixJrDFP4t0KFhm8LSfGDsLVrNyiSW5AXV-FK6dQH0_lDIupeCHDOyg-ngHB_dMbHbo_SdTmelG7A_qCY6RMGlLPb0L5O-pWYsNvhkRjTlLKS28nfM7PE-YX8CC1F5syeyibFT2uAhfYy72JkBYJEE4PcdEVYBqpaD6Z-Qk8SpFCOGN1GCjt28SguaD2fynbRfXTEZAw87Ag3zEcBYnPcf5HXcys5hf_MfyQb2IA-lIvhL3E',
      },
      priority: 'Low',
      status: 'Completed',
      requestedOn: 'May 14, 2024',
      requestedTime: '02:30 PM',
      assignedTo: {
        name: 'Priya L.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdT1n0R45uOQ3hXhiXrM9w8xL_f1QV7Lsltp_ein_3-YqL7Udyk_usGM5O_ToyTRYoDlmAqo3Q3L4-nBTZppG9l-vTkcD8tZRIt-TkCMnosTBpob-6YIBYgAW6Ug8RdR_xCWZtR9i1zTOKBX4Feyq0Q2hqD6GQCpKJapZCial9y6oQTDVBGg9GewddRvhUtxGlPdBgsQeGjGCoZyPUTneDRFo6uVUSVvujkBNn_RRcnSc61V_M-JjOMp_7gHanKkAMYJOnlZX_CSI',
      },
    },
  ]);

  // Dynamic Bento stats calculation
  const totalCount = requests.length + 32; // padded to match mockup stats 36
  const inProgressCount = requests.filter(r => r.status === 'In Progress').length + 10;
  const completedCount = requests.filter(r => r.status === 'Completed').length + 17;
  const scheduledCount = requests.filter(r => r.status === 'Scheduled').length + 5;
  const cancelledCount = requests.filter(r => r.status === 'Cancelled').length + 2;

  // Add request
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CR-2024-0${requests.length + 37}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newRequest: CleaningRequest = {
      id: newId,
      type: newRequestType,
      icon: newRequestType === 'Spill Cleanup' ? 'water_drop' : newRequestType === 'Restroom Cleaning' ? 'wc' : newRequestType === 'Waste Overflow' ? 'delete_sweep' : 'air',
      iconColor: newRequestType === 'Spill Cleanup' ? 'text-blue-500' : newRequestType === 'Restroom Cleaning' ? 'text-orange-500' : newRequestType === 'Waste Overflow' ? 'text-green-500' : 'text-blue-400',
      location: newRequestLocation,
      requestedBy: {
        name: 'Rahul S.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa2YAJKAFQ_1YcbCXr9gWlXaoH1A_IQEjTEvJow9XOiXzf7N3kKDctQGwB_KXYqfHi5PGPLS2I4O9fkKOEGiWdsildQg5Vfmz05wcp_WiN4rZKyxzhEspK03vL9BZsmY_SdVZj9jBt5lCmAfSkMUlzuHsIslYMMEX5Q0WjP3tzo_dJkKtNCBmGtgdDixcta81A9KxtOnzWftBuUDgJv8HOjUm_KQMlyHP7JMggbPxQp6Ewa-AVQYMO3uYRKs2vlrtM8QQdTQx4QhY',
      },
      priority: newRequestPriority as 'High' | 'Medium' | 'Low',
      status: 'Scheduled',
      requestedOn: dateStr,
      requestedTime: timeStr,
      assignedTo: null,
    };

    setRequests(prev => [newRequest, ...prev]);
    setShowAddModal(false);
  };

  // Toggle status
  const handleToggleRequestStatus = (id: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextStatus = r.status === 'Scheduled' ? 'In Progress' : r.status === 'In Progress' ? 'Completed' : 'Scheduled';
          return {
            ...r,
            status: nextStatus,
            assignedTo: nextStatus === 'In Progress' 
              ? { name: 'Priya Sharma', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa2YAJKAFQ_1YcbCXr9gWlXaoH1A_IQEjTEvJow9XOiXzf7N3kKDctQGwB_KXYqfHi5PGPLS2I4O9fkKOEGiWdsildQg5Vfmz05wcp_WiN4rZKyxzhEspK03vL9BZsmY_SdVZj9jBt5lCmAfSkMUlzuHsIslYMMEX5Q0WjP3tzo_dJkKtNCBmGtgdDixcta81A9KxtOnzWftBuUDgJv8HOjUm_KQMlyHP7JMggbPxQp6Ewa-AVQYMO3uYRKs2vlrtM8QQdTQx4QhY' }
              : r.assignedTo
          };
        }
        return r;
      })
    );
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'All Priority' || r.priority === priorityFilter;
    const matchesType = typeFilter === 'All Type' || r.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  return (
    <div className="space-y-6 lg:space-y-8 animate-fadeIn cleaning-panel">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-sans tracking-tight">
            Cleaning Requests
            <span className="bg-cleanserve-primary-container text-cleanserve-on-primary-container dark:bg-cleanserve-primary dark:text-white text-[10px] px-2 py-0.5 rounded-full font-bold">New</span>
          </h1>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">Manage and track all cleaning requests raised by users.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-cleanserve-primary hover:bg-cleanserve-primary-container text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-cleanserve-primary/10 cursor-pointer text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Request
          </button>
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-xs">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards Bento Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">assignment</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{totalCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Total Requests</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">schedule</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{inProgressCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">In Progress</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{completedCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Completed</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">event_note</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{scheduledCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Scheduled</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-950/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <span className="material-symbols-outlined text-[20px]">cancel</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 leading-none">{cancelledCount}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-sans font-semibold">Cancelled</p>
          </div>
        </div>
      </section>

      {/* Toolbar / Filters */}
      <section className="bg-white dark:bg-sd-surface-container p-4 rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-grow max-w-3xl">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans py-2 px-3 focus:ring-2 focus:ring-cleanserve-primary font-bold text-slate-700 dark:text-slate-200"
          >
            <option>All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
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
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans py-2 px-3 focus:ring-2 focus:ring-cleanserve-primary font-bold text-slate-700 dark:text-slate-200"
          >
            <option>All Type</option>
            <option value="Spill Cleanup">Spill Cleanup</option>
            <option value="Restroom Cleaning">Restroom Cleaning</option>
            <option value="Waste Overflow">Waste Overflow</option>
            <option value="Dusting">Dusting</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-slate-450 dark:text-slate-400 text-[10px] font-sans font-bold">
          <button className="flex items-center gap-1.5 hover:text-cleanserve-primary transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
          <div className="h-4 w-px bg-slate-250 dark:bg-slate-700" />
          <p className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">history</span>
            Last updated: Just now
          </p>
        </div>
      </section>

      {/* Data Table */}
      <section className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-550 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Location / Area</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Requested On</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                    No cleaning requests matched search criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap font-extrabold text-cleanserve-primary">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <span className={`material-symbols-outlined text-[18px] ${row.iconColor}`}>{row.icon}</span>
                        {row.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold">{row.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img alt={row.requestedBy.name} className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={row.requestedBy.avatar} />
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{row.requestedBy.name}</span>
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
                        onClick={() => handleToggleRequestStatus(row.id)}
                        className={`px-3 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                          row.status === 'Completed'
                            ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                            : row.status === 'In Progress'
                              ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30'
                              : row.status === 'Scheduled'
                                ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30'
                                : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {row.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold leading-relaxed">
                      {row.requestedOn}
                      <br />
                      <span className="text-[10px] text-slate-400 font-bold">{row.requestedTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      {row.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <img alt={row.assignedTo.name} className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={row.assignedTo.avatar} />
                          <span className="font-semibold text-slate-700 dark:text-slate-350">{row.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-slate-450 hover:text-cleanserve-primary rounded transition-colors">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors">
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
          <p className="text-slate-400 dark:text-slate-450 font-bold">Showing 1 to {filteredRequests.length} of {totalCount} requests</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-450 font-bold">Rows per page</span>
              <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1 px-2 focus:ring-1 focus:ring-cleanserve-primary outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
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

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-sd-surface-container rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-sm">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-1 font-sans">Submit Manual Cleaning Request</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-450 mb-4 font-sans leading-relaxed">
              Log a user request or housekeeping ticket in the queue.
            </p>
            <form onSubmit={handleAddRequest} className="space-y-4 font-sans text-xs">
              <div>
                <label htmlFor="new-request-type" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Request Type</label>
                <select
                  id="new-request-type"
                  value={newRequestType}
                  onChange={(e) => setNewRequestType(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Spill Cleanup">Spill Cleanup 💧</option>
                  <option value="Restroom Cleaning">Restroom Cleaning 🚾</option>
                  <option value="Waste Overflow">Waste Overflow 🗑️</option>
                  <option value="Dusting">Dusting 💨</option>
                </select>
              </div>

              <div>
                <label htmlFor="new-request-location" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Location / Table ID</label>
                <input
                  id="new-request-location"
                  type="text"
                  placeholder="e.g. Dining Area B, Table T09, Lobby"
                  value={newRequestLocation}
                  onChange={(e) => setNewRequestLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="new-request-priority" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Urgency Level</label>
                <select
                  id="new-request-priority"
                  value={newRequestPriority}
                  onChange={(e) => setNewRequestPriority(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="High">High Urgency (Red Alert)</option>
                  <option value="Medium">Medium Urgency (Normal Flow)</option>
                  <option value="Low">Low Urgency (Routine Check)</option>
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
                  Raise Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
