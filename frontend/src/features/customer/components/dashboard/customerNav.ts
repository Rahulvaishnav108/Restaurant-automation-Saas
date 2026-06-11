import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  Calendar,
  Star,
  User,
} from 'lucide-react';

export type CustomerTab = 'home' | 'menu' | 'checkout' | 'orders' | 'reservations' | 'feedback' | 'profile';

export interface NavItem {
  tab: CustomerTab;
  label: string;
  icon: React.ElementType;
  path: string;
}

export const customerNavItems: NavItem[] = [
  { tab: 'home',         label: 'Home',         icon: Home,            path: '/customer' },
  { tab: 'menu',         label: 'Menu',         icon: UtensilsCrossed,  path: '/customer/menu' },
  { tab: 'checkout',     label: 'Cart',         icon: ShoppingBag,     path: '/customer/checkout' },
  { tab: 'orders',       label: 'Orders',       icon: Clock,           path: '/customer/orders' },
  { tab: 'reservations', label: 'Reservations', icon: Calendar,        path: '/customer/reservations' },
  { tab: 'feedback',     label: 'Feedback',     icon: Star,            path: '/customer/feedback' },
  { tab: 'profile',      label: 'Profile',      icon: User,            path: '/customer/profile' },
];
