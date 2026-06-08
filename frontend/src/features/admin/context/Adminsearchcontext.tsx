import React, { createContext, useContext, useState, type PropsWithChildren } from 'react';

interface AdminSearchContextValue {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AdminSearchContext = createContext<AdminSearchContextValue | null>(null);

export function AdminSearchProvider({ children }: PropsWithChildren) {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <AdminSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch(): AdminSearchContextValue {
  const ctx = useContext(AdminSearchContext);
  if (!ctx) throw new Error('useAdminSearch must be used within AdminSearchProvider');
  return ctx;
}