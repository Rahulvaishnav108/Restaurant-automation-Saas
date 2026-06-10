import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  ConciergeBell,
  User,
} from 'lucide-react';

export type CustomerTab = 'home' | 'menu' | 'orders' | 'services' | 'profile';

export interface NavItem {
  tab: CustomerTab;
  label: string;
  icon: React.ElementType;
  path: string;
}

export const customerNavItems: NavItem[] = [
  { tab: 'home',     label: 'Home',     icon: Home,           path: '/customer' },
  { tab: 'menu',     label: 'Menu',     icon: UtensilsCrossed, path: '/customer/menu' },
  { tab: 'orders',   label: 'Orders',   icon: ShoppingBag,    path: '/customer/orders' },
  { tab: 'services', label: 'Services', icon: ConciergeBell,  path: '/customer/services' },
  { tab: 'profile',  label: 'Profile',  icon: User,           path: '/customer/profile' },
];
