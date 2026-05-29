import React from 'react';
import { Download, CalendarDays, ChevronDown } from 'lucide-react';
import { useReportsStore } from '../store/reports.store';
import { ReportStatCards } from '../components/reports/ReportStatCards';
import { RevenueOverview } from '../components/reports/RevenueOverview';
import { OrdersTrend, SalesByChannel } from '../components/reports/ReportCharts';
import { PeakHours, TopSellingItems, RevenueByCategory } from '../components/reports/ReportWidgets';
import { DailySummary, InsightsPanel, ReportShortcuts } from '../components/reports/ReportBottom';

export default function ReportsPage(): JSX.Element {
  const { dateLabel } = useReportsStore();

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track performance, analyze trends, and make data-driven decisions</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Date range picker */}
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
            {dateLabel}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <ReportStatCards />

      {/* Row 1: Revenue + Orders + Channel */}
      <div className="flex flex-wrap gap-4">
        <RevenueOverview />
        <OrdersTrend />
        <SalesByChannel />
      </div>

      {/* Row 2: Peak hours + Top items + Revenue by category */}
      <div className="flex flex-wrap gap-4">
        <PeakHours />
        <TopSellingItems />
        <RevenueByCategory />
      </div>

      {/* Row 3: Daily summary + Insights (sidebar) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <div className="space-y-4">
          <DailySummary />
        </div>
        <div className="space-y-4">
          <ReportShortcuts />
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
}