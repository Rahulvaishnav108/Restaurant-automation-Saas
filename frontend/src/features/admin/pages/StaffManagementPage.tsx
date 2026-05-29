import React from 'react';
import { Download, Plus } from 'lucide-react';
import { StaffStatCards } from '../components/staff/StaffStatCards';
import { StaffTable } from '../components/staff/StaffTable';
import { TodaysSchedule, UpcomingBirthdays } from '../components/staff/StaffSchedule';
import {
  AttendanceOverview,
  PayrollSummary,
  PerformanceOverview,
  RolesDistribution,
} from '../components/staff/StaffAnalytics';

export default function StaffManagementPage(): JSX.Element {
  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Staff Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your team, schedules, roles and performance</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <StaffStatCards />

      {/* Main content: table + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        {/* Left: table */}
        <StaffTable />

        {/* Right: schedule + birthdays */}
        <div className="space-y-4">
          <TodaysSchedule />
          <UpcomingBirthdays />
        </div>
      </div>

      {/* Bottom analytics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AttendanceOverview />
        <PayrollSummary />
        <PerformanceOverview />
        <RolesDistribution />
      </div>
    </div>
  );
}