import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────

export type TableStatus   = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Blocked';
export type TableShape    = 'Round' | 'Square' | 'Rectangle';
export type TableSection  = 'Indoor' | 'Outdoor' | 'Bar' | 'Private';

export interface TableOrder {
  id: string;
  items: number;
  amount: number;
  time: string;
}

export interface Table {
  id: number;
  label: string;
  status: TableStatus;
  shape: TableShape;
  section: TableSection;
  seats: number;
  floor: number;
  x: number; // floor-map position (%)
  y: number;
  currentOrder?: TableOrder;
  reservedFor?: string;
  reservedAt?: string;
  mergedWith?: number[];
  notes?: string;
}

export interface TableStats {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning: number;
  blocked: number;
  occupancyRate: string;
  avgTurnover: string;
  revenueToday: string;
  coversTodday: number;
}

export interface TableFilter {
  section: TableSection | 'All';
  status: TableStatus | 'All';
  floor: number | 'All';
  search: string;
}

// ── Seed Data ──────────────────────────────────────────────────────────────

const seedTables: Table[] = [
  // Floor 1 – Indoor
  { id: 1,  label: 'T-01', status: 'Occupied',  shape: 'Round',     section: 'Indoor',  seats: 2,  floor: 1, x: 12, y: 15, currentOrder: { id: '#ORD-0041', items: 3, amount: 1240, time: '18 min' } },
  { id: 2,  label: 'T-02', status: 'Available', shape: 'Round',     section: 'Indoor',  seats: 2,  floor: 1, x: 28, y: 15 },
  { id: 3,  label: 'T-03', status: 'Reserved',  shape: 'Square',    section: 'Indoor',  seats: 4,  floor: 1, x: 44, y: 15, reservedFor: 'Rahul Sharma', reservedAt: '7:30 PM' },
  { id: 4,  label: 'T-04', status: 'Occupied',  shape: 'Square',    section: 'Indoor',  seats: 4,  floor: 1, x: 60, y: 15, currentOrder: { id: '#ORD-0039', items: 5, amount: 3480, time: '32 min' } },
  { id: 5,  label: 'T-05', status: 'Available', shape: 'Rectangle', section: 'Indoor',  seats: 6,  floor: 1, x: 76, y: 15 },
  { id: 6,  label: 'T-06', status: 'Cleaning',  shape: 'Round',     section: 'Indoor',  seats: 2,  floor: 1, x: 12, y: 42 },
  { id: 7,  label: 'T-07', status: 'Occupied',  shape: 'Square',    section: 'Indoor',  seats: 4,  floor: 1, x: 28, y: 42, currentOrder: { id: '#ORD-0038', items: 4, amount: 2150, time: '8 min' } },
  { id: 8,  label: 'T-08', status: 'Reserved',  shape: 'Square',    section: 'Indoor',  seats: 4,  floor: 1, x: 44, y: 42, reservedFor: 'Priya Mehta', reservedAt: '8:00 PM' },
  { id: 9,  label: 'T-09', status: 'Available', shape: 'Rectangle', section: 'Indoor',  seats: 8,  floor: 1, x: 62, y: 42, notes: 'VIP table' },
  { id: 10, label: 'T-10', status: 'Blocked',   shape: 'Square',    section: 'Indoor',  seats: 4,  floor: 1, x: 80, y: 42, notes: 'Under maintenance' },
  // Floor 1 – Outdoor
  { id: 11, label: 'T-11', status: 'Available', shape: 'Round',     section: 'Outdoor', seats: 2,  floor: 1, x: 12, y: 70 },
  { id: 12, label: 'T-12', status: 'Occupied',  shape: 'Round',     section: 'Outdoor', seats: 2,  floor: 1, x: 28, y: 70, currentOrder: { id: '#ORD-0037', items: 2, amount: 880, time: '45 min' } },
  { id: 13, label: 'T-13', status: 'Available', shape: 'Square',    section: 'Outdoor', seats: 4,  floor: 1, x: 44, y: 70 },
  { id: 14, label: 'T-14', status: 'Reserved',  shape: 'Square',    section: 'Outdoor', seats: 4,  floor: 1, x: 60, y: 70, reservedFor: 'Anita Roy', reservedAt: '8:30 PM' },
  // Bar
  { id: 15, label: 'B-01', status: 'Occupied',  shape: 'Round',     section: 'Bar',     seats: 2,  floor: 1, x: 15, y: 88, currentOrder: { id: '#ORD-0036', items: 4, amount: 1560, time: '12 min' } },
  { id: 16, label: 'B-02', status: 'Available', shape: 'Round',     section: 'Bar',     seats: 2,  floor: 1, x: 30, y: 88 },
  { id: 17, label: 'B-03', status: 'Available', shape: 'Round',     section: 'Bar',     seats: 2,  floor: 1, x: 45, y: 88 },
  { id: 18, label: 'B-04', status: 'Occupied',  shape: 'Round',     section: 'Bar',     seats: 2,  floor: 1, x: 60, y: 88, currentOrder: { id: '#ORD-0035', items: 3, amount: 1320, time: '25 min' } },
  // Floor 2 – Private
  { id: 19, label: 'P-01', status: 'Available', shape: 'Rectangle', section: 'Private', seats: 10, floor: 2, x: 20, y: 20 },
  { id: 20, label: 'P-02', status: 'Reserved',  shape: 'Rectangle', section: 'Private', seats: 12, floor: 2, x: 60, y: 20, reservedFor: 'Corporate Event', reservedAt: '7:00 PM' },
  { id: 21, label: 'P-03', status: 'Available', shape: 'Rectangle', section: 'Private', seats: 8,  floor: 2, x: 20, y: 55 },
  { id: 22, label: 'P-04', status: 'Occupied',  shape: 'Rectangle', section: 'Private', seats: 10, floor: 2, x: 60, y: 55, currentOrder: { id: '#ORD-0034', items: 12, amount: 8750, time: '55 min' } },
];

// ── Store ──────────────────────────────────────────────────────────────────

export interface TablesState {
  tables: Table[];
  stats: TableStats;
  filter: TableFilter;
  selectedTableId: number | null;
  selectedFloor: number;
  viewMode: 'floor-map' | 'grid' | 'list';
  showAddModal: boolean;
  showEditModal: boolean;
}

interface TablesStore extends TablesState {
  selectTable:          (id: number | null) => void;
  setFloor:             (floor: number) => void;
  setViewMode:          (mode: 'floor-map' | 'grid' | 'list') => void;
  setFilter:            (patch: Partial<TableFilter>) => void;
  updateTableStatus:    (id: number, status: TableStatus) => void;
  addTable:             (t: Omit<Table, 'id'>) => void;
  updateTable:          (id: number, patch: Partial<Table>) => void;
  deleteTable:          (id: number) => void;
  setShowAddModal:      (v: boolean) => void;
  setShowEditModal:     (v: boolean) => void;
}

// ── Layout helpers ─────────────────────────────────────────────────────────

const SHAPE_SIZE: Record<TableShape, { w: number; h: number }> = {
  Rectangle: { w: 14, h: 10 },
  Square:    { w: 10, h: 10 },
  Round:     { w: 9,  h: 9  },
};

function overlaps(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
  pad = 3,
): boolean {
  return (
    ax - aw / 2 - pad < bx + bw / 2 + pad &&
    ax + aw / 2 + pad > bx - bw / 2 - pad &&
    ay - ah / 2 - pad < by + bh / 2 + pad &&
    ay + ah / 2 + pad > by - bh / 2 - pad
  );
}

function findFreePosition(
  floor: number,
  shape: TableShape,
  existingTables: Table[],
): { x: number; y: number } {
  const { w, h } = SHAPE_SIZE[shape];
  const floorTables = existingTables.filter(t => t.floor === floor);

  const stepX = w + 4;
  const stepY = h + 5;

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 8 + col * stepX;
      const y = 10 + row * stepY;

      // Stay within the canvas bounds
      if (x + w / 2 > 98 || y + h / 2 > 98) continue;

      const collision = floorTables.some(t => {
        const { w: tw, h: th } = SHAPE_SIZE[t.shape];
        return overlaps(x, y, w, h, t.x, t.y, tw, th);
      });

      if (!collision) return { x, y };
    }
  }

  return { x: 8, y: 10 }; // fallback
}

// ── Stats ──────────────────────────────────────────────────────────────────

function computeStats(tables: Table[]): TableStats {
  const total     = tables.length;
  const available = tables.filter(t => t.status === 'Available').length;
  const occupied  = tables.filter(t => t.status === 'Occupied').length;
  const reserved  = tables.filter(t => t.status === 'Reserved').length;
  const cleaning  = tables.filter(t => t.status === 'Cleaning').length;
  const blocked   = tables.filter(t => t.status === 'Blocked').length;
  const revenue   = tables.reduce((s, t) => s + (t.currentOrder?.amount ?? 0), 0);
  const covers    = tables.filter(t => t.status === 'Occupied').reduce((s, t) => s + t.seats, 0);

  return {
    total,
    available,
    occupied,
    reserved,
    cleaning,
    blocked,
    occupancyRate: `${Math.round((occupied / Math.max(total, 1)) * 100)}%`,
    avgTurnover:   '42 min',
    revenueToday:  `₹${(revenue + 47500).toLocaleString('en-IN')}`,
    coversTodday:  covers + 138,
  };
}

export const useTablesStore = create<TablesStore>()(
  persist(
    (set, _get) => ({
      tables:          seedTables,
      stats:           computeStats(seedTables),
      selectedTableId: null,
      selectedFloor:   1,
      viewMode:        'floor-map',
      showAddModal:    false,
      showEditModal:   false,
      filter: {
        section: 'All',
        status:  'All',
        floor:   'All',
        search:  '',
      },

      selectTable: (id) => set({ selectedTableId: id }),

      setFloor: (floor) => set({ selectedFloor: floor }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setFilter: (patch) =>
        set((s) => ({ filter: { ...s.filter, ...patch } })),

      updateTableStatus: (id, status) =>
        set((s) => {
          const tables = s.tables.map(t =>
            t.id === id
              ? { ...t, status, currentOrder: status !== 'Occupied' ? undefined : t.currentOrder }
              : t
          );
          return { tables, stats: computeStats(tables) };
        }),

      addTable: (t) =>
        set((s) => {
          const id  = Math.max(...s.tables.map(x => x.id)) + 1;
          const pos = findFreePosition(t.floor, t.shape, s.tables);
          const tables = [...s.tables, { ...t, id, x: pos.x, y: pos.y }];
          return { tables, stats: computeStats(tables) };
        }),

      updateTable: (id, patch) =>
        set((s) => {
          const tables = s.tables.map(t => t.id === id ? { ...t, ...patch } : t);
          return { tables, stats: computeStats(tables) };
        }),

      deleteTable: (id) =>
        set((s) => {
          const tables = s.tables.filter(t => t.id !== id);
          return { tables, stats: computeStats(tables), selectedTableId: null };
        }),

      setShowAddModal:  (v) => set({ showAddModal: v }),
      setShowEditModal: (v) => set({ showEditModal: v }),
    }),
    {
      name: 'admin-tables-store',
    }
  )
);