import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../features/admin/components/Sidebar';
import { Navbar } from '../features/admin/components/Navbar';
import { useUIStore } from '../store/ui.store';

export default function AdminLayout(): JSX.Element {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}