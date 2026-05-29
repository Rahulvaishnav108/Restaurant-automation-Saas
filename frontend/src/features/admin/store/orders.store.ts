import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus    = 'Pending' | 'Preparing' | 'Completed' | 'Cancelled' | 'Served';
export type PaymentMethod  = 'Paid' | 'Online' | 'Card' | 'Cash';

export interface Order {
  id: string;
  customer: string;
  customerAvatar: string;
  items: number;
  table: string;
  amount: string;
  amountRaw: number;
  payment: PaymentMethod;
  status: OrderStatus;
  assignedStaff: string;
  staffAvatar: string;
  time: string;
}

export interface OrderStats {
  totalOrders: number;
  totalOrdersChange: string;
  pending: number;
  completed: number;
  totalRevenue: string;
  totalRevenueChange: string;
  avgOrderValue: string;
  avgOrderValueChange: string;
}

interface OrdersStore {
  stats: OrderStats;
  orders: Order[];
  activeTab: OrderStatus | 'All';
  searchQuery: string;
  currentPage: number;
  perPage: number;

  setActiveTab: (tab: OrderStatus | 'All') => void;
  setSearchQuery: (q: string) => void;
  setCurrentPage: (p: number) => void;
  setPerPage: (n: number) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const seedOrders: Order[] = [
  { id: '#ORD-00124', customer: 'Smith Jonith',    customerAvatar: 'SJ', items: 4, table: 'T-05', amount: '₹45.80',  amountRaw: 45.80,  payment: 'Paid',   status: 'Pending',   assignedStaff: 'Jessica', staffAvatar: 'JE', time: '2 mins ago'  },
  { id: '#ORD-00123', customer: 'Sarah Johnson',   customerAvatar: 'SA', items: 3, table: 'T-12', amount: '₹78.40',  amountRaw: 78.40,  payment: 'Paid',   status: 'Preparing', assignedStaff: 'Michael', staffAvatar: 'MI', time: '15 mins ago' },
  { id: '#ORD-00122', customer: 'Michael Brown',   customerAvatar: 'MB', items: 5, table: 'T-03', amount: '₹62.10',  amountRaw: 62.10,  payment: 'Online', status: 'Pending',   assignedStaff: 'David',   staffAvatar: 'DA', time: '25 mins ago' },
  { id: '#ORD-00121', customer: 'Emily Davis',     customerAvatar: 'ED', items: 2, table: 'T-08', amount: '₹25.30',  amountRaw: 25.30,  payment: 'Paid',   status: 'Completed', assignedStaff: 'Jessica', staffAvatar: 'JE', time: '35 mins ago' },
  { id: '#ORD-00120', customer: 'David Wilson',    customerAvatar: 'DW', items: 6, table: 'T-15', amount: '₹90.20',  amountRaw: 90.20,  payment: 'Card',   status: 'Completed', assignedStaff: 'Michael', staffAvatar: 'MI', time: '45 mins ago' },
  { id: '#ORD-00119', customer: 'Sophia Martinez', customerAvatar: 'SM', items: 4, table: 'T-11', amount: '₹34.60',  amountRaw: 34.60,  payment: 'Cash',   status: 'Cancelled', assignedStaff: 'David',   staffAvatar: 'DA', time: '1 hour ago'  },
  { id: '#ORD-00118', customer: 'James Wilson',    customerAvatar: 'JW', items: 3, table: 'T-02', amount: '₹55.00',  amountRaw: 55.00,  payment: 'Paid',   status: 'Preparing', assignedStaff: 'Jessica', staffAvatar: 'JE', time: '1 hour ago'  },
  { id: '#ORD-00117', customer: 'Lisa Martinez',   customerAvatar: 'LM', items: 7, table: 'T-09', amount: '₹112.40', amountRaw: 112.40, payment: 'Card',   status: 'Completed', assignedStaff: 'Michael', staffAvatar: 'MI', time: '2 hours ago' },
  { id: '#ORD-00116', customer: 'Robert Taylor',   customerAvatar: 'RT', items: 2, table: 'T-06', amount: '₹28.90',  amountRaw: 28.90,  payment: 'Cash',   status: 'Served',    assignedStaff: 'David',   staffAvatar: 'DA', time: '2 hours ago' },
  { id: '#ORD-00115', customer: 'Amanda White',    customerAvatar: 'AW', items: 5, table: 'T-14', amount: '₹76.50',  amountRaw: 76.50,  payment: 'Online', status: 'Completed', assignedStaff: 'Jessica', staffAvatar: 'JE', time: '3 hours ago' },
];

// ── Store ─────────────────────────────────────────────────────────────────────

export const useOrdersStore = create<OrdersStore>((set) => ({
  stats: {
    totalOrders: 156,
    totalOrdersChange: '+12.5%',
    pending: 27,
    completed: 102,
    totalRevenue: '₹12,450.80',
    totalRevenueChange: '+15.6%',
    avgOrderValue: '₹79.81',
    avgOrderValueChange: '+6.4%',
  },
  orders: seedOrders,
  activeTab: 'All',
  searchQuery: '',
  currentPage: 1,
  perPage: 10,

  setActiveTab:    (tab) => set({ activeTab: tab, currentPage: 1 }),
  setSearchQuery:  (q)   => set({ searchQuery: q, currentPage: 1 }),
  setCurrentPage:  (p)   => set({ currentPage: p }),
  setPerPage:      (n)   => set({ perPage: n, currentPage: 1 }),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));