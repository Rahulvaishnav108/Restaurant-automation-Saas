import React, { useState } from 'react';
import { STAFF, type KitchenStaff } from '../store/kitchenData';
import { useKitchenSearch } from '../components/dashboard/KitchenSearchContext';

export default function KitchenStaffPage() {
  const { query } = useKitchenSearch();
  const [staff, setStaff] = useState<KitchenStaff[]>(STAFF);
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-duty' | 'on-break' | 'off-duty'>('all');

  const filteredStaff = staff.filter(member => {
    if (statusFilter !== 'all' && member.status !== statusFilter) return false;

    if (query) {
      const q = query.toLowerCase();
      return (
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.station.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusCycle = (id: string) => {
    setStaff(prev =>
      prev.map(member => {
        if (member.id === id) {
          let nextStatus: 'on-duty' | 'on-break' | 'off-duty' = 'on-duty';
          if (member.status === 'on-duty') nextStatus = 'on-break';
          else if (member.status === 'on-break') nextStatus = 'off-duty';
          else nextStatus = 'on-duty';

          return {
            ...member,
            status: nextStatus,
            station: nextStatus === 'off-duty' ? '-' : member.station === '-' ? 'Prep Station' : member.station,
          };
        }
        return member;
      })
    );
  };

  const handleAssignStation = (id: string) => {
    const stations = ['Grill Station', 'Curry Station', 'Fry Station', 'Biryani Station', 'Beverage Station', 'Prep Station'];
    setStaff(prev =>
      prev.map(member => {
        if (member.id === id) {
          const currentIdx = stations.indexOf(member.station);
          const nextIdx = (currentIdx + 1) % (stations.length + 1); // include "-"
          const nextStation = nextIdx === stations.length ? '-' : stations[nextIdx];
          return {
            ...member,
            station: nextStation,
            status: nextStation === '-' ? 'on-break' : 'on-duty',
          };
        }
        return member;
      })
    );
  };

  // Stats
  const totalChefs = staff.length;
  const onDutyCount = staff.filter(s => s.status === 'on-duty').length;
  const onBreakCount = staff.filter(s => s.status === 'on-break').length;

  const statusBg = {
    'on-duty': 'bg-green-50 text-green-700 border-green-200',
    'on-break': 'bg-amber-50 text-amber-700 border-amber-200',
    'off-duty': 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const statusDot = {
    'on-duty': 'bg-green-500',
    'on-break': 'bg-amber-500',
    'off-duty': 'bg-slate-400',
  };

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Staff Management</h2>
          <p className="text-sm text-slate-500 font-medium">Manage chef duties, shift hours, station allocations, and performance</p>
        </div>
        <button className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 shadow-lg shadow-orange-100 flex items-center gap-2 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Staff Member
        </button>
      </div>

      {/* Roster Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Staff Rostered</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{totalChefs}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-xl">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Currently On Duty</p>
            <h3 className="text-2xl font-bold text-green-600 mt-0.5">{onDutyCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <span className="material-symbols-outlined text-[24px]">pause_circle</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">On Break</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-0.5">{onBreakCount}</h3>
          </div>
        </div>
      </div>

      {/* Shift/Duty Status Filters */}
      <div className="flex gap-1.5 mb-6">
        {(['all', 'on-duty', 'on-break', 'off-duty'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
              statusFilter === filter
                ? 'bg-orange-50 text-orange-600 border-orange-200'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter === 'all' ? 'All Staff' : filter.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Staff List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.map(member => {
          // Initials for avatar fallback
          const initials = member.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

          return (
            <div
              key={member.id}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Profile Card Header */}
                <div className="flex items-center gap-4 mb-4">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-full object-cover border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 font-bold text-base border border-orange-200">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-slate-800 truncate leading-snug">{member.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{member.role}</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5">{member.id}</p>
                  </div>
                  <div className={`px-2.5 py-0.5 border rounded-full text-[9px] font-bold uppercase shrink-0 flex items-center gap-1.5 ${statusBg[member.status]}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot[member.status]}`} />
                    <span>{member.status.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Assignment & Shift details */}
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100/50 space-y-2 text-xs font-medium mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Station Allocation</span>
                    <span className="font-bold text-orange-600">{member.station}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shift Timing</span>
                    <span className="font-bold text-slate-700">{member.shift}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 text-sm">★</span>
                      <span className="font-bold text-slate-700">{member.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Performance numbers */}
                <div className="grid grid-cols-2 gap-4 text-center border-t border-slate-50 pt-4 mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prep Speed</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{member.avgPrepTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{member.ordersCompleted} orders</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-slate-50 pt-4">
                <button
                  onClick={() => handleStatusCycle(member.id)}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                >
                  Shift Status
                </button>
                <button
                  onClick={() => handleAssignStation(member.id)}
                  className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-colors"
                >
                  Assign Station
                </button>
              </div>
            </div>
          );
        })}
        {filteredStaff.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 font-medium">
            No rostered staff match your search.
          </div>
        )}
      </div>
    </div>
  );
}
