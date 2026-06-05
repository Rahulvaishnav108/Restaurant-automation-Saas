import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────────────────────────

export type ReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Walk-in';
export type TableStatus = 'Available' | 'Occupied' | 'Reserved';
export type TimeSlotBusyness = 'Available' | 'Busy' | 'Very Busy';

export interface Reservation {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  time: string;
  guests: number;
  tableId: number;
  status: ReservationStatus;
  date: string;
  specialRequest?: string;
  phone: string;
  email: string;
  occasion?: string;
}

export interface TableSlot {
  id: number;
  status: TableStatus;
  seats: number;
}

export interface TimeSlot {
  time: string;
  busyness: TimeSlotBusyness;
  tableCount: number;
}

export interface ReservationStats {
  total: number;
  totalChange: string;
  confirmed: number;
  confirmedPercent: string;
  pending: number;
  pendingPercent: string;
  cancelled: number;
  cancelledPercent: string;
  walkIns: number;
  walkInsPercent: string;
}

export interface ReservationAnalytics {
  noShowRate: string;
  noShowChange: string;
  avgPartySize: string;
  avgPartySizeChange: string;
  tableTurnover: string;
  tableTurnoverChange: string;
  peakTime: string;
  occupancyRate: string;
  occupancyChange: string;
}

export interface SelectedGuest {
  reservation: Reservation | null;
}

export interface ReservationsState {
  stats: ReservationStats;
  upcomingReservations: Reservation[];
  tables: TableSlot[];
  timeSlots: TimeSlot[];
  analytics: ReservationAnalytics;
  selectedDate: string;
  calendarView: 'Day' | 'Week' | 'Month';
  selectedGuest: Reservation | null;
}

// ── Seed Data ──────────────────────────────────────────────────────────────

const initialState: ReservationsState = {
  stats: {
    total: 48,
    totalChange: '+12.5% vs Yesterday',
    confirmed: 36,
    confirmedPercent: '75% of total',
    pending: 8,
    pendingPercent: '16.7% of total',
    cancelled: 4,
    cancelledPercent: '8.3% of total',
    walkIns: 12,
    walkInsPercent: '25% of total',
  },

  upcomingReservations: [
    {
      id: 'r1',
      name: 'John Smith',
      avatar: 'JS',
      avatarColor: 'bg-blue-500',
      time: '07:00 PM',
      guests: 4,
      tableId: 7,
      status: 'Confirmed',
      date: 'May 20, 2025',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      specialRequest: 'Prefer quiet corner table',
      occasion: 'Anniversary Dinner',
    },
    {
      id: 'r2',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      avatarColor: 'bg-purple-500',
      time: '07:30 PM',
      guests: 2,
      tableId: 12,
      status: 'Pending',
      date: 'May 20, 2025',
      phone: '+1 (555) 234-5678',
      email: 'sarah.j@email.com',
    },
    {
      id: 'r3',
      name: 'Michael Brown',
      avatar: 'MB',
      avatarColor: 'bg-green-500',
      time: '08:00 PM',
      guests: 6,
      tableId: 3,
      status: 'Confirmed',
      date: 'May 20, 2025',
      phone: '+1 (555) 345-6789',
      email: 'mbrown@email.com',
      specialRequest: 'High chair needed',
    },
    {
      id: 'r4',
      name: 'Emily Davis',
      avatar: 'ED',
      avatarColor: 'bg-pink-500',
      time: '08:30 PM',
      guests: 3,
      tableId: 9,
      status: 'Confirmed',
      date: 'May 20, 2025',
      phone: '+1 (555) 456-7890',
      email: 'emily.d@email.com',
    },
    {
      id: 'r5',
      name: 'David Wilson',
      avatar: 'DW',
      avatarColor: 'bg-orange-500',
      time: '09:00 PM',
      guests: 5,
      tableId: 11,
      status: 'Pending',
      date: 'May 20, 2025',
      phone: '+1 (555) 567-8901',
      email: 'dwilson@email.com',
      specialRequest: 'Birthday celebration',
    },
  ],

  tables: [
    { id: 1, status: 'Occupied', seats: 4 },
    { id: 2, status: 'Available', seats: 2 },
    { id: 3, status: 'Occupied', seats: 6 },
    { id: 4, status: 'Reserved', seats: 4 },
    { id: 5, status: 'Occupied', seats: 4 },
    { id: 6, status: 'Available', seats: 8 },
    { id: 7, status: 'Reserved', seats: 2 },
    { id: 8, status: 'Available', seats: 4 },
    { id: 9, status: 'Reserved', seats: 6 },
    { id: 10, status: 'Occupied', seats: 4 },
    { id: 11, status: 'Occupied', seats: 2 },
    { id: 12, status: 'Available', seats: 4 },
  ],

  timeSlots: [
    { time: '11:00 AM', busyness: 'Available', tableCount: 12 },
    { time: '01:00 PM', busyness: 'Busy', tableCount: 4 },
    { time: '07:00 PM', busyness: 'Very Busy', tableCount: 3 },
    { time: '09:00 PM', busyness: 'Available', tableCount: 8 },
  ],

  analytics: {
    noShowRate: '2.5%',
    noShowChange: '↓ 0.6% vs last month',
    avgPartySize: '3.6',
    avgPartySizeChange: '↑ 0.3 vs last month',
    tableTurnover: '4.2',
    tableTurnoverChange: '↓ 0.6 vs last month',
    peakTime: '07:00 PM – 09:00 PM',
    occupancyRate: '78%',
    occupancyChange: '↑ 8% vs last month',
  },

  selectedDate: 'Today, May 20',
  calendarView: 'Month',
  selectedGuest: null,
};

// ── Store ──────────────────────────────────────────────────────────────────

interface ReservationsStore extends ReservationsState {
  setSelectedGuest: (reservation: Reservation | null) => void;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  setCalendarView: (view: 'Day' | 'Week' | 'Month') => void;
  setSelectedDate: (date: string) => void;
}

export const useReservationsStore = create<ReservationsStore>((set) => ({
  ...initialState,

  setSelectedGuest: (reservation) =>
    set({ selectedGuest: reservation }),

  updateReservationStatus: (id, status) =>
    set((state) => ({
      upcomingReservations: state.upcomingReservations.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    })),

  setCalendarView: (view) => set({ calendarView: view }),

  setSelectedDate: (date) => set({ selectedDate: date }),
}));