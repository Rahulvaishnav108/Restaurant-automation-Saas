import React from 'react';

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/50 border border-orange-100 dark:border-orange-900 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">This page is under construction. Coming soon!</p>
    </div>
  );
}

export const MenuManagementPage  = () => <ComingSoon title="Menu Management" />;
export const TableManagementPage = () => <ComingSoon title="Table Management" />;
export const StaffManagementPage = () => <ComingSoon title="Staff Management" />;
export const MarketingPage       = () => <ComingSoon title="Marketing" />;
export const SettingsPage        = () => <ComingSoon title="Settings" />;