// import React from 'react'; // Not needed with modern JSX transform
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../features/admin/components/AdminSidebar';
import { AdminTopbar } from '../features/admin/components/AdminTopbar';
import { AdminSearchProvider } from '../features/admin/context/Adminsearchcontext';
import { AdminNotificationsProvider } from '../features/admin/context/Adminnotificationscontext';

export default function AdminLayout(): JSX.Element {
  return (
    <AdminNotificationsProvider>
      <AdminSearchProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-200">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminSearchProvider>
    </AdminNotificationsProvider>
  );
}