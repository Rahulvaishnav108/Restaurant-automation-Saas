import React from 'react';
import { Search, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useStaffStore } from '../../store/staff.store';
import type { StaffRole, StaffDepartment, StaffStatus } from '../../store/staff.store';

const ROLES: Array<StaffRole | 'All Roles'>       = ['All Roles', 'Manager', 'Chef', 'Server', 'Bartender', 'Host', 'Cleaner'];
const DEPTS: Array<StaffDepartment | 'All Departments'> = ['All Departments', 'Management', 'Kitchen', 'Service', 'Bar', 'Front Desk', 'Cleaning'];
const STATUSES: Array<StaffStatus | 'All'>         = ['All', 'Active', 'On Leave', 'Inactive'];

const ROLE_COLORS: Record<StaffRole, string> = {
  Manager:   'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  Chef:      'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  Server:    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Bartender: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  Host:      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Cleaner:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const STATUS_COLORS: Record<StaffStatus, string> = {
  Active:    'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  'On Leave':'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Inactive:  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
};

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

export function StaffTable(): JSX.Element {
  const {
    members, searchQuery, roleFilter, departmentFilter, statusFilter, currentPage, perPage,
    setSearchQuery, setRoleFilter, setDepartmentFilter, setStatusFilter, setCurrentPage,
  } = useStaffStore();

  // Filter
  const filtered = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    const matchR = roleFilter === 'All Roles' || m.role === roleFilter;
    const matchD = departmentFilter === 'All Departments' || m.department === departmentFilter;
    const matchS = statusFilter === 'All' || m.status === statusFilter;
    return matchQ && matchR && matchD && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mr-2">Staff Members</h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 w-36 text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as StaffRole | 'All Roles')}
          className="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-300"
        >
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>

        {/* Dept filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value as StaffDepartment | 'All Departments')}
          className="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-300"
        >
          {DEPTS.map((d) => <option key={d}>{d}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StaffStatus | 'All')}
          className="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-700 dark:text-gray-300"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        <button className="ml-auto text-xs font-semibold text-orange-500 hover:underline">View All</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {['Staff Member', 'Role', 'Department', 'Phone', 'Status', 'Hire Date', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((m) => (
              <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={m.avatar} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{m.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[m.role]}`}>{m.role}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{m.department}</td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{m.phone}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[m.status]}`}>{m.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{m.hireDate}</td>
                <td className="px-4 py-3">
                  <button className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {paged.length > 0 ? (page - 1) * perPage + 1 : 0} to {Math.min(page * perPage, filtered.length)} of {filtered.length} staff
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(page - 1)}
            disabled={page <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                p === page
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(page + 1)}
            disabled={page >= totalPages}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}