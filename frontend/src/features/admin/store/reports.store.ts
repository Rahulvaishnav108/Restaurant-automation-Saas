import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────────────────────────

export type DateRange = 'Daily' | 'Weekly' | 'Monthly' | 'This Week' | 'This Month';
export type SalesChannel = 'Dine-in' | 'Takeaway' | 'Delivery' | 'Online';

export interface ReportStats {
  totalRevenue: string;
  totalRevenueChange: string;
  totalOrders: number;
  totalOrdersChange: string;
  avgOrderValue: string;
  avgOrderValueChange: string;
  totalCustomers: number;
  totalCustomersChange: string;
  repeatCustomers: number;
  repeatCustomersChange: string;
  netProfit: string;
  netProfitChange: string;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface OrdersTrendPoint {
  date: string;
  orders: number;
}

export interface SalesByChannel {
  channel: SalesChannel;
  pct: number;
  amount: string;
  color: string;
}

export interface TopSellingItem {
  id: string;
  name: string;
  emoji: string;
  orders: number;
  revenue: string;
}

export interface RevenueByCategory {
  name: string;
  pct: number;
  amount: string;
  color: string;
}

export interface PeakHourCell {
  day: string;
  hour: string;
  intensity: number; // 0-1
}

export interface DailySummaryRow {
  date: string;
  revenue: string;
  orders: number;
  customers: number;
  avgOrderValue: string;
  repeatCustomers: number;
  netProfit: string;
}

export interface Insight {
  id: string;
  emoji: string;
  color: string;
  title: string;
  body: string;
}

export interface ReportShortcut {
  id: string;
  label: string;
}

interface ReportsState {
  stats: ReportStats;
  dateLabel: string;
  revenueTrend: RevenuePoint[];
  ordersTrend: OrdersTrendPoint[];
  salesByChannel: SalesByChannel[];
  topSellingItems: TopSellingItem[];
  revenueByCategory: RevenueByCategory[];
  peakHourCells: PeakHourCell[];
  dailySummary: DailySummaryRow[];
  insights: Insight[];
  shortcuts: ReportShortcut[];
  revenueRange: DateRange;
  ordersRange: DateRange;
  topItemsRange: DateRange;
  revByCatRange: DateRange;

  setRevenueRange: (r: DateRange) => void;
  setOrdersRange: (r: DateRange) => void;
  setTopItemsRange: (r: DateRange) => void;
  setRevByCatRange: (r: DateRange) => void;
}

// ── Seed Data ──────────────────────────────────────────────────────────────

const DATES = ['May 12', 'May 13', 'May 14', 'May 15', 'May 16', 'May 17', 'May 18'];

export const useReportsStore = create<ReportsState>((set) => ({
  stats: {
    totalRevenue: '₹24,680.50',
    totalRevenueChange: '↑ 12.5% vs last week',
    totalOrders: 1248,
    totalOrdersChange: '↑ 8.3% vs last week',
    avgOrderValue: '₹19.78',
    avgOrderValueChange: '↑ 5.6% vs last week',
    totalCustomers: 842,
    totalCustomersChange: '↑ 10.2% vs last week',
    repeatCustomers: 312,
    repeatCustomersChange: '↑ 7.8% vs last week',
    netProfit: '₹8,245.30',
    netProfitChange: '↑ 14.3% vs last week',
  },

  dateLabel: 'May 12 – May 18, 2025',

  revenueTrend: [
    { date: 'May 12', revenue: 15000 },
    { date: 'May 13', revenue: 17500 },
    { date: 'May 14', revenue: 16200 },
    { date: 'May 15', revenue: 19800 },
    { date: 'May 16', revenue: 21000 },
    { date: 'May 17', revenue: 22400 },
    { date: 'May 18', revenue: 24680 },
  ],

  ordersTrend: [
    { date: 'May 12', orders: 300 },
    { date: 'May 13', orders: 340 },
    { date: 'May 14', orders: 310 },
    { date: 'May 15', orders: 380 },
    { date: 'May 16', orders: 395 },
    { date: 'May 17', orders: 410 },
    { date: 'May 18', orders: 430 },
  ],

  salesByChannel: [
    { channel: 'Dine-in',  pct: 45, amount: '₹11,106.23', color: '#f97316' },
    { channel: 'Takeaway', pct: 30, amount: '₹7,404.15',  color: '#3b82f6' },
    { channel: 'Delivery', pct: 20, amount: '₹4,936.10',  color: '#22c55e' },
    { channel: 'Online',   pct: 5,  amount: '₹1,234.03',  color: '#a855f7' },
  ],

  topSellingItems: [
    { id: 't1', name: 'Margherita Pizza', emoji: '🍕', orders: 425, revenue: '₹2,125.00' },
    { id: 't2', name: 'Chicken Burger',   emoji: '🍔', orders: 380, revenue: '₹1,710.00' },
    { id: 't3', name: 'Caesar Salad',     emoji: '🥗', orders: 310, revenue: '₹1,395.00' },
    { id: 't4', name: 'Pasta Alfredo',    emoji: '🍝', orders: 275, revenue: '₹1,237.50' },
    { id: 't5', name: 'BBQ Chicken Pizza',emoji: '🍕', orders: 250, revenue: '₹1,125.00' },
  ],

  revenueByCategory: [
    { name: 'Food',      pct: 70, amount: '₹17,276.35', color: '#f97316' },
    { name: 'Beverages', pct: 20, amount: '₹4,936.10',  color: '#3b82f6' },
    { name: 'Desserts',  pct: 10, amount: '₹2,468.05',  color: '#22c55e' },
  ],

  peakHourCells: (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'];
    const pattern: Record<string, number> = {
      '12 PM': 0.85, '3 PM': 0.6, '6 PM': 0.95, '9 PM': 0.8,
      '9 AM': 0.4, '6 AM': 0.1, '12 AM': 0.2,
    };
    const cells: PeakHourCell[] = [];
    days.forEach((day) => {
      hours.forEach((hour) => {
        const base = pattern[hour] ?? 0.3;
        const jitter = (Math.random() - 0.5) * 0.2;
        cells.push({ day, hour, intensity: Math.max(0.05, Math.min(1, base + jitter)) });
      });
    });
    return cells;
  })(),

  dailySummary: [
    { date: 'May 18, 2025', revenue: '₹24,680.50', orders: 1248, customers: 842, avgOrderValue: '₹19.78', repeatCustomers: 312, netProfit: '₹8,245.30' },
    { date: 'May 17, 2025', revenue: '₹21,540.30', orders: 1150, customers: 782, avgOrderValue: '₹18.73', repeatCustomers: 258, netProfit: '₹7,245.20' },
    { date: 'May 16, 2025', revenue: '₹22,130.40', orders: 1180, customers: 810, avgOrderValue: '₹18.76', repeatCustomers: 310, netProfit: '₹7,960.10' },
  ],

  insights: [
    { id: 'i1', emoji: '📈', color: 'bg-green-50 dark:bg-green-950/40 border-green-100 dark:border-green-900/40', title: 'Revenue is up 12.5% compared to last week.', body: 'Great job! Your business is growing.' },
    { id: 'i2', emoji: '🕕', color: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40',  title: 'Friday and Saturday are your busiest days.', body: 'Consider more staff during peak hours.' },
    { id: 'i3', emoji: '⭐', color: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40', title: 'Margherita Pizza is your top selling item.', body: 'It contributed 17% of total sales.' },
  ],

  shortcuts: [
    { id: 'sc1', label: 'Sales Summary' },
    { id: 'sc2', label: 'Orders Report' },
    { id: 'sc3', label: 'Menu Performance' },
    { id: 'sc4', label: 'Inventory Report' },
    { id: 'sc5', label: 'Staff Performance' },
  ],

  revenueRange: 'Daily',
  ordersRange: 'Daily',
  topItemsRange: 'This Week',
  revByCatRange: 'This Week',

  setRevenueRange: (r) => set({ revenueRange: r }),
  setOrdersRange:  (r) => set({ ordersRange: r }),
  setTopItemsRange:(r) => set({ topItemsRange: r }),
  setRevByCatRange:(r) => set({ revByCatRange: r }),
}));