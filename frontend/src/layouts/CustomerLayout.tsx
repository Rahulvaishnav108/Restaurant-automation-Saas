import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  CustomerSidebar,
  CustomerBottomNav,
  CustomerTopbar,
} from '../features/customer/components/dashboard';

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Desktop sidebar — hidden on mobile */}
      <CustomerSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Sticky topbar */}
        <CustomerTopbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile fixed bottom nav — hidden on desktop */}
      <CustomerBottomNav />
    </div>
  );
}
