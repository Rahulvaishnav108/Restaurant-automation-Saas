import React from 'react';
import { useSettingsStore } from '../store/settings.store';
import {
  SettingsSidebar,
  ProfileCard,
  RestaurantInfoCard,
  BillingCard,
  TeamCard,
  NotificationsCard,
  IntegrationsCard,
} from '../components/settings/Index';

function ComingSoonSection({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/50 border border-orange-100 dark:border-orange-900 flex items-center justify-center mb-3">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Coming soon!</p>
    </div>
  );
}

function SettingsContent(): JSX.Element {
  const { activeSection } = useSettingsStore();

  switch (activeSection) {
    case 'profile':
      return (
        <div className="grid grid-cols-2 gap-5">
          <ProfileCard />
          <RestaurantInfoCard />
          <BillingCard />
          <TeamCard />
          <NotificationsCard />
          <IntegrationsCard />
        </div>
      );
    case 'restaurant':
      return (
        <div className="max-w-2xl">
          <RestaurantInfoCard />
        </div>
      );
    case 'billing':
      return (
        <div className="max-w-2xl">
          <BillingCard />
        </div>
      );
    case 'team':
      return (
        <div className="max-w-2xl">
          <TeamCard />
        </div>
      );
    case 'notifications':
      return (
        <div className="max-w-2xl">
          <NotificationsCard />
        </div>
      );
    case 'integrations':
      return (
        <div className="max-w-2xl">
          <IntegrationsCard />
        </div>
      );
    case 'security':
      return <ComingSoonSection title="Security Settings" />;
    case 'backup':
      return <ComingSoonSection title="Backup & Export" />;
    case 'system':
      return <ComingSoonSection title="System Preferences" />;
    default:
      return <div />;
  }
}

export default function SettingsPage(): JSX.Element {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your restaurant settings and preferences
        </p>
      </div>

      {/* Layout */}
      <div className="flex gap-6 items-start">
        <SettingsSidebar />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <SettingsContent />
        </div>
      </div>
    </div>
  );
}