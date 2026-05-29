import React from 'react';
import { MenuHeader } from '../components/menu/MenuHeader';
import { MenuCategoryPanel } from '../components/menu/MenuCategoryPanel';
import { MenuFilterBar } from '../components/menu/MenuFilterBar';
import { MenuGrid } from '../components/menu/MenuGrid';

export function MenuManagementPage(): JSX.Element {
  return (
    <div className="flex flex-col h-full p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <MenuHeader />
      <div className="flex gap-5 flex-1">
        <MenuCategoryPanel />
        <div className="w-px bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
        <div className="flex-1 flex flex-col min-w-0">
          <MenuFilterBar />
          <MenuGrid />
        </div>
      </div>
    </div>
  );
}