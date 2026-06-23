import React, { useState, useRef, useEffect } from 'react';
import { useCleaning } from '../hooks/usecleaning';
import { useCleaningSearch } from '../components/dashboard/CleaningSearchContext';

interface TableRow {
  id: string;
  area: string;
  seats: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  lastCleaned: string;
  assignedTo: { name: string; avatar: string } | null;
  rawId: string;
}

interface TableTask {
  id: string;
  rawId: string;
  rawStatus?: 'PENDING' | 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  rawPriority?: 'High' | 'Medium' | 'Low';
  progress?: number;
  waiting?: string;
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleViewTableDetails = (row: TableRow) => {
    setSelectedTable(row); // Ye table ka data modal mein bhej dega
  };
  // 1. Modal ke liye state
  const [selectedTable, setSelectedTable] = useState<TableRow | null>(null);

  const handleActionClick = (row: TableRow, action: 'start' | 'complete' | 'verify') => {
    if (action === 'start') startTask(row.rawId);
    if (action === 'complete') completeTask(row.rawId);
    if (action === 'verify') verifyTask(row.rawId);
    setOpenMenuId(null);
  };

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isRowsOpen, setIsRowsOpen] = useState(false); //
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  const { urgentTasks, startTask, completeTask, verifyTask } = useCleaning();
  const safeTasks: TableTask[] = (urgentTasks || []) as unknown as TableTask[];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node))
        setIsStatusOpen(false);
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node))
        setIsPriorityOpen(false);
      if (rowsRef.current && !rowsRef.current.contains(event.target as Node)) setIsRowsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tables: TableRow[] = safeTasks.map((t: TableTask) => {
    let displayStatus: 'Pending' | 'In Progress' | 'Completed' = 'Pending';
    if (t.rawStatus === 'IN_PROGRESS') displayStatus = 'In Progress';
    if (t.rawStatus === 'COMPLETED' || t.rawStatus === 'VERIFIED') displayStatus = 'Completed';

    let assignedStaff = null;
    if (t.id === 'T12' || t.id === 'T05') {
      assignedStaff = {
        name: 'Ramesh K.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1EeclPIzb65zLML4Z-Ep8QnCj_Ey68uOYKOfFtZuK_k5ILmHPwi-DSDwYreE9ju4D4Z79Hp6UeAKZXSwBOURkmGSQ7hNQ8-lDeQGBfmjcHltnwofvxh67WrZSDukcUkwZiuZjqYa74AhkTFTcLWqysc21n_T9l3J9vkmkj_lFhXuaPU189ige8Tlb5foWMvGnW27LhowBJk4dHeUfzWcmeRluinE4acRYrVtfGNEr0sYCTnJ1sdGsg1NYN3HFCrqzkH0-TJrClE',
      };
    } else if (t.id === 'T01' || t.id === 'T02') {
      assignedStaff = {
        name: 'Anita S.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuANsaeL1qIrdjS8VjlskxOHt17ofWL0mQA8HTEyUyGUmb0WZEoFeVIhAYDxByw8LuxWxFKIdV270hwAPBmZFNJdIOoLB7X4CRStTLzQ66uJ709k9Kvpbt3yDChYZmi0IOgzaKGIARmUFWTp8fiuOG-poilaUus94iK5MEMaPofwxQGipJFvuis9fWEp53IS84fln5N1GSiP7xWII9WnJi1qTw5gFY4eKQQgrXVlslMwV6TbZi4nnm2vGRG3hjoOoFQyNc23SGR4j9U',
      };
    } else if (t.id === 'T15') {
      assignedStaff = {
        name: 'Vikram P.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA--L3CSbZtR0isayAQeKWVqEYUnJm50z5jjO9pkKQN7ksNy8Vgt62aZwgUrLRnYBtnpNDDk4IRK7ognEaSVtSVSsdI0zIDiq4N90jHPW5P1ONLpdO51I3sP-vvCRQnQTsfxs1Via1HEmQcJeHVGQ6-nNWKCActOegeFVwkpjBzRiXJlzDX15TkbA-90HDUzdz54FoQmsFcObFCGuXAmvK2KTyMt9nyMhl5nHPEV0d4sIjpe9An60OytiSZxSfYVdBG1nSHlTyW1aA',
      };
    }

    return {
      id: t.id,
      area: t.id === 'T15' ? 'Terrace Area' : t.id === 'T05' ? 'Floor 1' : 'Dining Area A',
      seats:
        t.id === 'T03' || t.id === 'T05'
          ? 6
          : t.id === 'T15'
            ? 3
            : t.id === 'T12' || t.id === 'T02'
              ? 2
              : 4,
      status: displayStatus,
      priority: (t.rawPriority === 'High' || t.rawStatus === 'REQUESTED'
        ? 'High'
        : t.rawPriority === 'Low'
          ? 'Low'
          : 'Medium') as 'High' | 'Medium' | 'Low',
      lastCleaned:
        t.rawStatus === 'VERIFIED'
          ? '10:30 AM'
          : t.rawStatus === 'COMPLETED'
            ? 'Just Now'
            : t.waiting || '',
      assignedTo: assignedStaff,
      rawId: t.id,
    };
  });

  const totalTables = tables.length + 42;
  const totalInProgress = tables.filter((t) => t.status === 'In Progress').length + 12;
  const totalCleanedToday = tables.filter((t) => t.status === 'Completed').length + 26;
  const totalHighPriority = tables.filter((t) => t.priority === 'High').length + 4;

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber) return;
    setNewTableNumber('');
    setShowAddModal(false);
  };

  // Change table status triggered directly from state store pipeline handlers
  const handleToggleStatus = (rawId: string, currentStatus: string) => {
    if (currentStatus === 'Pending') {
      startTask(rawId);
    } else if (currentStatus === 'In Progress') {
      completeTask(rawId);
    } else if (currentStatus === 'Completed') {
      verifyTask(rawId);
    }
  };

  const handleOpenActionMenu = (row: TableRow) => {
    const action = prompt(
      `Actions for ${row.id}: Type 'clean' to start, 'assign' to update staff.`
    );
    if (action === 'clean') {
      startTask(row.rawId);
    } else if (action === 'assign') {
      console.log('Assigning staff...');
    }
  };

  const handleExportData = () => {
    const csvRows = [
      [
        'Table ID',
        'Area / Zone',
        'Seats Configuration',
        'Operational Status',
        'Priority Vector',
        'Last Cleaned Time',
      ],
      ...filteredTables.map((t) => [t.id, t.area, t.seats, t.status, t.priority, t.lastCleaned]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute(
      'download',
      `CleanServe_Tables_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Filter conditions
  const filteredTables = tables.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All Priority' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate dynamic paginated slices matching user action indexes safely
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentPaginatedRows = filteredTables.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="space-y-6 animate-fadeIn cleaning-panel">
      {/* Summary Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 shrink-0">
            <span className="material-symbols-outlined">table_restaurant</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
              {totalTables}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">
              Total Tables
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 shrink-0">
            <span className="material-symbols-outlined">cleaning_bucket</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
              {totalInProgress}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">In Progress</p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
              {totalCleanedToday}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">
              Cleaned Today
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-sd-surface-container p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
              {totalHighPriority}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-sans">
              High Priority
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar & Data Table Section */}
      <section className="bg-white dark:bg-sd-surface-container rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-sd-surface-container relative z-40">
          <div className="flex flex-wrap items-center gap-3 flex-grow max-w-3xl">
            <div className="relative md:hidden flex-grow max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs font-sans text-slate-800 dark:text-slate-200"
                placeholder="Search tables..."
                type="text"
                value={searchQuery}
                readOnly
              />
            </div>

            {/* Custom Status Dropdown Menu (No System Blue Highlighting) */}
            <div className="relative" ref={statusRef}>
              <button
                type="button"
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsPriorityOpen(false);
                  setIsRowsOpen(false);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans py-2 px-3 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 outline-none hover:border-orange-500 transition-colors cursor-pointer"
              >
                <span>{statusFilter}</span>
                <span className="material-symbols-outlined text-sm text-slate-400">
                  keyboard_arrow_down
                </span>
              </button>
              {isStatusOpen && (
                <div className="absolute left-0 mt-1.5 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden flex flex-col font-sans text-xs">
                  {['All Status', 'Pending', 'In Progress', 'Completed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setStatusFilter(st);
                        setIsStatusOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 font-bold transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-orange-500 text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-500'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Priority Dropdown Menu (No System Blue Highlighting) */}
            <div className="relative" ref={priorityRef}>
              <button
                type="button"
                onClick={() => {
                  setIsPriorityOpen(!isPriorityOpen);
                  setIsStatusOpen(false);
                  setIsRowsOpen(false);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans py-2 px-3 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 outline-none hover:border-orange-500 transition-colors cursor-pointer"
              >
                <span>{priorityFilter}</span>
                <span className="material-symbols-outlined text-sm text-slate-400">
                  keyboard_arrow_down
                </span>
              </button>
              {isPriorityOpen && (
                <div className="absolute left-0 mt-1.5 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden flex flex-col font-sans text-xs">
                  {['All Priority', 'High', 'Medium', 'Low'].map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => {
                        setPriorityFilter(pr);
                        setIsPriorityOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 font-bold transition-colors cursor-pointer ${
                        priorityFilter === pr
                          ? 'bg-orange-500 text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-500'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportData}
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-sans font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Table
            </button>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto relative z-10">
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
              {currentPaginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No tables found matching selection parameters.
                  </td>
                </tr>
              ) : (
                currentPaginatedRows.map((row) => (
                  <tr
                    key={row.rawId}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined ${
                            row.status === 'Completed'
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-orange-500'
                          }`}
                        >
                          table_bar
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">
                          {row.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-semibold">
                      {row.area}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-850 dark:text-slate-300">
                      {row.seats}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(row.rawId, row.status)}
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border cursor-pointer transition-colors duration-150 ${
                          row.status === 'Completed'
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30'
                            : row.status === 'In Progress'
                              ? 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30'
                              : 'bg-orange-500/10 text-orange-500 border-orange-200 dark:bg-slate-800 dark:text-orange-400'
                        }`}
                      >
                        {row.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.priority === 'High'
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                            : row.priority === 'Medium'
                              ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400'
                              : 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                        }`}
                      >
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-455 font-semibold">
                      {row.lastCleaned}
                    </td>
                    <td className="px-6 py-4">
                      {row.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <img
                            alt={row.assignedTo.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            src={row.assignedTo.avatar}
                          />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {row.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewTableDetails(row)}
                          className="p-1 text-slate-450 hover:text-orange-500 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>

                        <button
                          onClick={() => setOpenMenuId(openMenuId === row.rawId ? null : row.rawId)}
                          className="p-1 text-slate-400 hover:text-orange-500 rounded transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {openMenuId === row.rawId && (
                        <div className="absolute right-0 top-12 w-40 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl z-[999] p-1">
                          <button
                            onClick={() => handleActionClick(row, 'start')}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg"
                          >
                            Start Cleaning
                          </button>
                          <button
                            onClick={() => handleActionClick(row, 'complete')}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleActionClick(row, 'verify')}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            Verify Audit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination Panels */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-sd-surface-container border-t border-slate-100 dark:border-slate-800 relative z-30">
          <p className="text-slate-400 dark:text-slate-455 font-bold">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredTables.length)} of{' '}
            {totalTables} tables
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {/* 💥 Custom HTML Pagination Active Layout Links Control Block */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 font-bold rounded-lg transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
                disabled={currentPage === 3}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>

            {/* 💥 FIXED: Custom dropup layout list component for rows menu logic (Orange theme highlight applied!) */}
            <div className="flex items-center gap-2" ref={rowsRef}>
              <span className="text-slate-400 dark:text-slate-455 font-bold">Rows per page:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsRowsOpen(!isRowsOpen);
                    setIsStatusOpen(false);
                    setIsPriorityOpen(false);
                  }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-2.5 font-bold text-slate-700 dark:text-slate-355 flex items-center gap-1 outline-none hover:border-orange-500 cursor-pointer"
                >
                  <span>{rowsPerPage}</span>
                  <span className="material-symbols-outlined text-xs text-slate-400">
                    keyboard_arrow_down
                  </span>
                </button>
                {isRowsOpen && (
                  <div className="absolute right-0 bottom-full mb-1.5 w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden flex flex-col font-sans text-xs">
                    {[10, 25, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setRowsPerPage(size);
                          setCurrentPage(1);
                          setIsRowsOpen(false);
                        }}
                        className={`w-full text-center px-3 py-1.5 font-bold transition-colors cursor-pointer ${
                          rowsPerPage === size
                            ? 'bg-orange-500 text-white'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-orange-500/10 hover:text-orange-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-sd-surface-container rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-sm">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-1 font-sans">
              Add New Dining Table
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-455 mb-4 font-sans leading-relaxed">
              Create a new table record in the database floor outline.
            </p>
            <form onSubmit={handleAddTable} className="space-y-4 font-sans text-xs">
              <div>
                <label
                  htmlFor="new-table-id"
                  className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  Table ID
                </label>
                <input
                  id="new-table-id"
                  type="text"
                  placeholder="e.g. T25, T32"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-table-area"
                  className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  Dining Area / Zone
                </label>
                <select
                  id="new-table-area"
                  value={newTableArea}
                  onChange={(e) => setNewTableArea(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="Dining Area A">Dining Area A</option>
                  <option value="Dining Area B">Dining Area B</option>
                  <option value="Terrace Area">Terrace Area</option>
                  <option value="Floor 1">Floor 1</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="new-table-seats"
                    className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Seats Count
                  </label>
                  <input
                    id="new-table-seats"
                    type="number"
                    min="1"
                    max="12"
                    value={newTableSeats}
                    onChange={(e) => setNewTableSeats(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-table-priority"
                    className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5"
                  >
                    Initial Priority
                  </label>
                  <select
                    id="new-table-priority"
                    value={newTablePriority}
                    onChange={(e) =>
                      setNewTablePriority(e.target.value as 'High' | 'Medium' | 'Low')
                    }
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
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
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal View */}
      {selectedTable && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white mb-4">
              Table {selectedTable.id} Info
            </h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>
                <strong>Zone:</strong> {selectedTable.area}
              </p>
              <p>
                <strong>Seats:</strong> {selectedTable.seats}
              </p>
              <p>
                <strong>Current Status:</strong>{' '}
                <span className="font-bold text-orange-500">{selectedTable.status}</span>
              </p>
              <p>
                <strong>Priority:</strong> {selectedTable.priority}
              </p>
              <p>
                <strong>Last Cleaned:</strong> {selectedTable.lastCleaned || 'N/A'}
              </p>
              <p>
                <strong>Assigned To:</strong> {selectedTable.assignedTo?.name || 'No one'}
              </p>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="mt-6 w-full py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
