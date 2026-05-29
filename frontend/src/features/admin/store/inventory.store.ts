import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────

export type ItemCategory  = 'Ingredients' | 'Beverages' | 'Packaging' | 'Cleaning Supplies' | 'Other';
export type ItemStatus    = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon';
export type ItemTab       = 'All Items' | ItemCategory;

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  unit: string;
  currentStock: number;
  parLevel: number;
  status: ItemStatus;
  lastUpdated: string;
  imageEmoji: string;
}

export interface InventoryStats {
  totalItems: number;
  totalItemsChange: string;
  totalValue: string;
  totalValueChange: string;
  lowStockItems: number;
  lowStockChange: string;
  outOfStockItems: number;
  outOfStockChange: string;
  expiringSoon: number;
}

export interface StockAlert {
  id: string;
  name: string;
  detail: string;
  status: 'Low Stock' | 'Out of Stock';
  imageEmoji: string;
}

export interface Supplier {
  id: string;
  name: string;
  spent: string;
  color: string;
  initials: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface StatusDistribution {
  inStock: number;
  inStockPct: number;
  lowStock: number;
  lowStockPct: number;
  outOfStock: number;
  outOfStockPct: number;
  expiringSoon: number;
  expiringSoonPct: number;
}

interface InventoryStore {
  stats: InventoryStats;
  items: InventoryItem[];
  stockAlerts: StockAlert[];
  topSuppliers: Supplier[];
  valueOverTime: ChartDataPoint[];
  topUsedIngredients: ChartDataPoint[];
  statusDistribution: StatusDistribution;

  activeTab: ItemTab;
  activeCategory: ItemCategory | 'All Categories';
  searchQuery: string;
  currentPage: number;
  perPage: number;

  setActiveTab:      (t: ItemTab) => void;
  setActiveCategory: (c: ItemCategory | 'All Categories') => void;
  setSearchQuery:    (q: string) => void;
  setCurrentPage:    (p: number) => void;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const seedItems: InventoryItem[] = [
  { id: 'I001', name: 'Tomatoes',           category: 'Ingredients',       unit: 'kg',  currentStock: 24.50, parLevel: 20.00, status: 'In Stock',      lastUpdated: 'May 20, 2025', imageEmoji: '🍅' },
  { id: 'I002', name: 'Chicken Breast',     category: 'Ingredients',       unit: 'kg',  currentStock: 15.20, parLevel: 15.00, status: 'Low Stock',     lastUpdated: 'May 20, 2025', imageEmoji: '🍗' },
  { id: 'I003', name: 'Olive Oil',          category: 'Ingredients',       unit: 'L',   currentStock:  3.00, parLevel:  5.00, status: 'Low Stock',     lastUpdated: 'May 19, 2025', imageEmoji: '🫒' },
  { id: 'I004', name: 'Mozzarella Cheese',  category: 'Ingredients',       unit: 'kg',  currentStock:  0.00, parLevel: 10.00, status: 'Out of Stock',  lastUpdated: 'May 19, 2025', imageEmoji: '🧀' },
  { id: 'I005', name: 'Lettuce',            category: 'Ingredients',       unit: 'kg',  currentStock:  8.50, parLevel: 10.00, status: 'Low Stock',     lastUpdated: 'May 18, 2025', imageEmoji: '🥬' },
  { id: 'I006', name: 'Coca Cola',          category: 'Beverages',         unit: 'pcs', currentStock: 48,    parLevel: 30,    status: 'In Stock',      lastUpdated: 'May 18, 2025', imageEmoji: '🥤' },
  { id: 'I007', name: 'Paper Cups (12oz)',  category: 'Packaging',         unit: 'pcs', currentStock: 120,   parLevel: 100,   status: 'In Stock',      lastUpdated: 'May 18, 2025', imageEmoji: '🧃' },
  { id: 'I008', name: 'Disinfectant Spray', category: 'Cleaning Supplies', unit: 'pcs', currentStock:  2,    parLevel:  5,    status: 'Low Stock',     lastUpdated: 'May 17, 2025', imageEmoji: '🧴' },
  { id: 'I009', name: 'Garlic',             category: 'Ingredients',       unit: 'kg',  currentStock: 12.00, parLevel:  8.00, status: 'In Stock',      lastUpdated: 'May 16, 2025', imageEmoji: '🧄' },
  { id: 'I010', name: 'Onions',             category: 'Ingredients',       unit: 'kg',  currentStock:  9.50, parLevel: 10.00, status: 'Low Stock',     lastUpdated: 'May 16, 2025', imageEmoji: '🧅' },
  { id: 'I011', name: 'Sparkling Water',    category: 'Beverages',         unit: 'pcs', currentStock: 60,    parLevel: 40,    status: 'In Stock',      lastUpdated: 'May 15, 2025', imageEmoji: '💧' },
  { id: 'I012', name: 'Take-out Boxes',     category: 'Packaging',         unit: 'pcs', currentStock: 200,   parLevel: 150,   status: 'In Stock',      lastUpdated: 'May 15, 2025', imageEmoji: '📦' },
  { id: 'I013', name: 'Floor Cleaner',      category: 'Cleaning Supplies', unit: 'L',   currentStock:  4.00, parLevel:  5.00, status: 'Low Stock',     lastUpdated: 'May 14, 2025', imageEmoji: '🧹' },
  { id: 'I014', name: 'Bell Peppers',       category: 'Ingredients',       unit: 'kg',  currentStock:  6.00, parLevel:  6.00, status: 'Expiring Soon', lastUpdated: 'May 14, 2025', imageEmoji: '🫑' },
  { id: 'I015', name: 'Orange Juice',       category: 'Beverages',         unit: 'L',   currentStock: 18,    parLevel: 12,    status: 'In Stock',      lastUpdated: 'May 13, 2025', imageEmoji: '🍊' },
];

// ── Store ─────────────────────────────────────────────────────────────────────

export const useInventoryStore = create<InventoryStore>((set) => ({
  stats: {
    totalItems: 248,
    totalItemsChange: '+12.5%',
    totalValue: '₹24,680.50',
    totalValueChange: '+8.3%',
    lowStockItems: 18,
    lowStockChange: '-3',
    outOfStockItems: 6,
    outOfStockChange: '-2',
    expiringSoon: 11,
  },

  items: seedItems,

  stockAlerts: [
    { id: 'A001', name: 'Chicken Breast',    detail: '15.20 kg left',  status: 'Low Stock',    imageEmoji: '🍗' },
    { id: 'A002', name: 'Olive Oil',         detail: '3.00 L left',    status: 'Low Stock',    imageEmoji: '🫒' },
    { id: 'A003', name: 'Mozzarella Cheese', detail: 'Out of stock',   status: 'Out of Stock', imageEmoji: '🧀' },
    { id: 'A004', name: 'Disinfectant Spray',detail: '2 pcs left',     status: 'Low Stock',    imageEmoji: '🧴' },
  ],

  topSuppliers: [
    { id: 'S001', name: 'Fresh Farm Foods',     spent: '₹12,450.00', color: 'bg-green-500',  initials: 'FF' },
    { id: 'S002', name: 'Global Beverages',     spent: '₹6,780.50',  color: 'bg-blue-500',   initials: 'GB' },
    { id: 'S003', name: 'Pack & More Supplies', spent: '₹3,240.00',  color: 'bg-orange-500', initials: 'PM' },
  ],

  valueOverTime: [
    { label: 'Apr 20', value: 18000 },
    { label: 'Apr 27', value: 19500 },
    { label: 'May 4',  value: 17800 },
    { label: 'May 11', value: 21000 },
    { label: 'May 18', value: 24680 },
  ],

  topUsedIngredients: [
    { label: 'Chicken Breast', value: 90 },
    { label: 'Tomatoes',       value: 75 },
    { label: 'Lettuce',        value: 55 },
    { label: 'Cheese',         value: 40 },
    { label: 'Olive Oil',      value: 30 },
  ],

  statusDistribution: {
    inStock: 156, inStockPct: 62.9,
    lowStock: 18, lowStockPct: 7.3,
    outOfStock: 6, outOfStockPct: 2.4,
    expiringSoon: 11, expiringSoonPct: 4.4,
  },

  activeTab:      'All Items',
  activeCategory: 'All Categories',
  searchQuery:    '',
  currentPage:    1,
  perPage:        8,

  setActiveTab:      (t) => set({ activeTab: t,      currentPage: 1 }),
  setActiveCategory: (c) => set({ activeCategory: c, currentPage: 1 }),
  setSearchQuery:    (q) => set({ searchQuery: q,    currentPage: 1 }),
  setCurrentPage:    (p) => set({ currentPage: p }),
}));