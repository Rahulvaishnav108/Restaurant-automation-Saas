import React, { useState } from 'react';
import { useCleaningSearch } from '../components/dashboard/CleaningSearchContext';

interface TableRow {
  id: string;
  area: string;
  seats: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  lastCleaned: string;
  assignedTo: { name: string; avatar: string } | null;
}

export default function CleaningTablesPage() {
  const { searchQuery } = useCleaningSearch();
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newTableArea, setNewTableArea] = useState('Dining Area A');
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [newTablePriority, setNewTablePriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const [tables, setTables] = useState<TableRow[]>([
    {
      id: 'T07',
      area: 'Dining Area A',
      seats: 4,
      status: 'Pending',
      priority: 'High',
      lastCleaned: 'Just Now',
      assignedTo: null,
    },
    {
      id: 'T12',
      area: 'Dining Area A',
      seats: 2,
      status: 'In Progress',
      priority: 'Medium',
      lastCleaned: '2 min ago',
      assignedTo: {
        name: 'Ramesh K.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1EeclPIzb65zLML4Z-Ep8QnCj_Ey68uOYKOfFtZuK_k5ILmHPwi-DSDwYreE9ju4D4Z79Hp6UeAKZXSwBOURkmGSQ7hNQ8-lDeQGBfmjcHltnwofvxh67WrZSDukcUkwZiuZjqYa74AhkTFTcLWqysc21n_T9l3J9vkmkj_lFhXuaPU189ige8Tlb5foWMvGnW27LhowBJk4dHeUfzWcmeRluinE4acRYrVtfGNEr0sYCTnJ1sdGsg1NYN3HFCrqzkH0-TJrClE',
      },
    },
    {
      id: 'T01',
      area: 'Dining Area A',
      seats: 4,
      status: 'Completed',
      priority: 'Medium',
      lastCleaned: '10:30 AM',
      assignedTo: {
        name: 'Anita S.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANsaeL1qIrdjS8VjlskxOHt17ofWL0mQA8HTEyUyGUmb0WZEoFeVIhAYDxByw8LuxWxFKIdV270hwAPBmZFNJdIOoLB7X4CRStTLzQ66uJ709k9Kvpbt3yDChYZmi0IOgzaKGIARmUFWTp8fiuOG-poilaUus94iK5MEMaPofwxQGipJFvuis9fWEp53IS84fln5N1GSiP7xWII9WnJi1qTw5gFY4eKQQgrXVlslMwV6TbZi4nnm2vGRG3hjoOoFQyNc23SGR4j9U',
      },
    },
    {
      id: 'T15',
      area: 'Terrace Area',
      seats: 3,
      status: 'Pending',
      priority: 'Low',
      lastCleaned: '5 min ago',
      assignedTo: {
        name: 'Vikram P.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA--L3CSbZtR0isayAQeKWVqEYUnJm50z5jjO9pkKQN7ksNy8Vgt62aZwgUrLRnYBtnpNDDk4IRK7ognEaSVtSVSsdI0zIDiq4N90jHPW5P1ONLpdO51I3sP-vvCRQnQTsfxs1Via1HEmQcJeHVGQ6-nNWKCActOegeFVwkpjBzRiXJlzDX15TkbA-90HDUzdz54FoQmsFcObFCGuXAmvK2KTyMt9nyMhl5nHPEV0d4sIjpe9An60OytiSZxSfYVdBG1nSHlTyW1aA',
      },
    },
    {
      id: 'T02',
      area: 'Dining Area A',
      seats: 2,
      status: 'Completed',
      priority: 'Medium',
      lastCleaned: '10:18 AM',
      assignedTo: {
        name: 'Anita S.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANsaeL1qIrdjS8VjlskxOHt17ofWL0mQA8HTEyUyGUmb0WZEoFeVIhAYDxByw8LuxWxFKIdV270hwAPBmZFNJdIOoLB7X4CRStTLzQ66uJ709k9Kvpbt3yDChYZmi0IOgzaKGIARmUFWTp8fiuOG-poilaUus94iK5MEMaPofwxQGipJFvuis9fWEp53IS84fln5N1GSiP7xWII9WnJi1qTw5gFY4eKQQgrXVlslMwV6TbZi4nnm2vGRG3hjoOoFQyNc23SGR4j9U',
      },
    },
    {
      id: 'T05',
      area: 'Floor 1',
      seats: 6,
      status: 'In Progress',
      priority: 'High',
      lastCleaned: 'Started 3 min ago',
      assignedTo: {
        name: 'Ramesh K.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1EeclPIzb65zLML4Z-Ep8QnCj_Ey68uOYKOfFtZuK_k5ILmHPwi-DSDwYreE9ju4D4Z79Hp6UeAKZXSwBOURkmGSQ7hNQ8-lDeQGBfmjcHltnwofvxh67WrZSDukcUkwZiuZjqYa74AhkTFTcLWqysc21n_T9l3J9vkmkj_lFhXuaPU189ige8Tlb5foWMvGnW27LhowBJk4dHeUfzWcmeRluinE4acRYrVtfGNEr0sYCTnJ1sdGsg1NYN3HFCrqzkH0-TJrClE',
      },
    },
  ]);

  // Stat calculations
  const totalTables = tables.length + 42; // pad to make it match mock statistics 48
  const totalInProgress = tables.filter(t => t.status === 'In Progress').length + 12;
  const totalCleanedToday = tables.filter(t => t.status === 'Completed').length + 26;
  const totalHighPriority = tables.filter(t => t.priority === 'High').length + 4;

  // Add a new table
  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber) return;
    const tableId = newTableNumber.toUpperCase().startsWith('T') ? newTableNumber.toUpperCase() : `T${newTableNumber}`;

    const newRow: TableRow = {
      id: tableId,
      area: newTableArea,
      seats: newTableSeats,
      status: 'Pending',
      priority: newTablePriority,
      lastCleaned: 'Never',
      assignedTo: null,
    };

    setTables(prev => [newRow, ...prev]);
    setNewTableNumber('');
    setShowAddModal(false);
  };

  // Change table status
  const handleToggleStatus = (id: string) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'Pending' ? 'In Progress' : t.status === 'In Progress' ? 'Completed' : 'Pending';
          return {
            ...t,
            status: nextStatus,
            lastCleaned: nextStatus === 'Completed' ? 'Just Now' : t.lastCleaned,
          };
        }
        return t;
      })
    );
  };

  // Filter tables
  const filteredTables = tables.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All Priority' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-fadeIn cleaning-panel">
      {/* Summary Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-cleanserve-primary/10 rounded-full flex items-center justify-center text-cleanserve-primary dark:text-blue-400 shrink-0">
            <span className="material-symbols-outlined">table_restaurant</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{totalTables}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">Total Tables</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-cleanserve-tertiary-container/10 rounded-full flex items-center justify-center text-cleanserve-tertiary dark:text-orange-400 shrink-0">
            <span className="material-symbols-outlined">cleaning_bucket</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{totalInProgress}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">In Progress</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{totalCleanedToday}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">Cleaned Today</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">{totalHighPriority}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">High Priority</p>
          </div>
        </div>
      </section>

      {/* Toolbar & Data Table Section */}
      <section className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-850/20">
          <div className="flex flex-wrap items-center gap-3 flex-grow max-w-3xl">
            {/* Search Input handled by layout TopBar. Local backup if layout search doesn't show */}
            <div className="relative md:hidden flex-grow max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs font-sans text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-cleanserve-primary focus:border-cleanserve-primary"
                placeholder="Search tables..."
                type="text"
                value={searchQuery}
                onChange={() => {}} // Controlled globally
                disabled
              />
            </div>
            
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
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cleanserve-primary text-white rounded-xl text-xs font-sans font-bold hover:opacity-90 transition-all shadow-md shadow-cleanserve-primary/10 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Table
            </button>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold">
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Table ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Area</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Seats</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Last Cleaned</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No tables found matching selection parameters.
                  </td>
                </tr>
              ) : (
                filteredTables.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${
                          row.status === 'Completed' ? 'text-green-500 dark:text-green-400' : row.status === 'In Progress' ? 'text-orange-500 dark:text-orange-400' : 'text-red-500 dark:text-red-400'
                        }`}>table_bar</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">{row.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold">{row.area}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-850 dark:text-slate-300">{row.seats}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(row.id)}
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border cursor-pointer ${
                          row.status === 'Completed'
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                            : row.status === 'In Progress'
                              ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30'
                              : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                        }`}
                      >
                        {row.status}
                      </button>
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
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold">{row.lastCleaned}</td>
                    <td className="px-6 py-4">
                      {row.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <img alt={row.assignedTo.name} className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={row.assignedTo.avatar} />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{row.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-slate-450 hover:text-cleanserve-primary rounded transition-colors" title="View Details">
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

        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-850/10 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-450 font-bold">Showing 1 to {filteredTables.length} of {tables.length + 42} tables</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 bg-cleanserve-primary text-white font-bold rounded-lg">1</button>
              <button className="w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg">2</button>
              <button className="w-8 h-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-450 font-bold">Rows per page:</span>
              <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-2 focus:ring-1 focus:ring-cleanserve-primary outline-none text-slate-700 dark:text-slate-350">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-sd-surface-container rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-sm">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-1 font-sans">Add New Dining Table</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-450 mb-4 font-sans leading-relaxed">
              Create a new table record in the database floor outline.
            </p>
            <form onSubmit={handleAddTable} className="space-y-4 font-sans text-xs">
              <div>
                <label htmlFor="new-table-id" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Table ID</label>
                <input
                  id="new-table-id"
                  type="text"
                  placeholder="e.g. T25, T32"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="new-table-area" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Dining Area / Zone</label>
                <select
                  id="new-table-area"
                  value={newTableArea}
                  onChange={(e) => setNewTableArea(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Dining Area A">Dining Area A</option>
                  <option value="Dining Area B">Dining Area B</option>
                  <option value="Terrace Area">Terrace Area</option>
                  <option value="Floor 1">Floor 1</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-table-seats" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Seats Count</label>
                  <input
                    id="new-table-seats"
                    type="number"
                    min="1"
                    max="12"
                    value={newTableSeats}
                    onChange={(e) => setNewTableSeats(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-table-priority" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Initial Priority</label>
                  <select
                    id="new-table-priority"
                    value={newTablePriority}
                    onChange={(e) => setNewTablePriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
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
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
