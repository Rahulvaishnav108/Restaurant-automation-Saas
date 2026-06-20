import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────

export type StaffRole       = 'Manager' | 'Chef' | 'Server' | 'Bartender' | 'Host' | 'Cleaner';
export type StaffDepartment = 'Management' | 'Kitchen' | 'Service' | 'Bar' | 'Front Desk' | 'Cleaning';
export type StaffStatus     = 'Active' | 'On Leave' | 'Inactive';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';
export type ShiftTime       = 'Morning' | 'Evening' | 'Night';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: StaffRole;
  department: StaffDepartment;
  phone: string;
  status: StaffStatus;
  hireDate: string;
  performance: number; // 1-5
  salary: number; // in INR
}

export interface Shift {
  id: string;
  label: string;
  time: string;
  staffCount: number;
  staffAvatars: string[];
  extra: number;
}

export interface UpcomingBirthday {
  id: string;
  name: string;
  avatar: string;
  date: string;
}

export interface AttendanceBreakdown {
  label: AttendanceStatus;
  count: number;
  color: string;
}

export interface PayrollLine {
  label: string;
  amount: string;
}

export interface StaffStats {
  totalStaff: number;
  totalStaffChange: string;
  activeToday: number;
  activeTodayPct: string;
  onLeave: number;
  onLeavePct: string;
  totalPayroll: string;
  totalPayrollChange: string;
  avgPerformance: string;
  avgPerformanceChange: string;
  attendancePct: number;
}

export interface RoleDistribution {
  role: StaffRole;
  count: number;
  pct: string;
  color: string;
}

interface StaffStore {
  stats: StaffStats;
  members: StaffMember[];
  shifts: Shift[];
  birthdays: UpcomingBirthday[];
  attendanceBreakdown: AttendanceBreakdown[];
  payrollLines: PayrollLine[];
  roleDistribution: RoleDistribution[];

  // filters
  searchQuery: string;
  roleFilter: StaffRole | 'All Roles';
  departmentFilter: StaffDepartment | 'All Departments';
  statusFilter: StaffStatus | 'All';
  currentPage: number;
  perPage: number;
  showAll: boolean;

  setSearchQuery: (q: string) => void;
  setRoleFilter: (r: StaffRole | 'All Roles') => void;
  setDepartmentFilter: (d: StaffDepartment | 'All Departments') => void;
  setStatusFilter: (s: StaffStatus | 'All') => void;
  setCurrentPage: (p: number) => void;
  setShowAll: (v: boolean) => void;
  updateMemberStatus: (id: string, status: StaffStatus) => void;
  addMember: (m: Omit<StaffMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<StaffMember>) => void;
  deleteMember: (id: string) => void;
}

// ── Seed Data ──────────────────────────────────────────────────────────────

const seedMembers: StaffMember[] = [
  { id: 's1',  name: 'John Smith',      email: 'john.smith@email.com',    avatar: 'JS', role: 'Manager',   department: 'Management', phone: '+91 98765 43210', status: 'Active',   hireDate: 'Jan 15, 2023', performance: 4.8, salary: 65000 },
  { id: 's2',  name: 'Sarah Johnson',   email: 'sarah.j@email.com',       avatar: 'SJ', role: 'Server',    department: 'Service',    phone: '+91 98765 43211', status: 'Active',   hireDate: 'Feb 10, 2023', performance: 4.2, salary: 32000 },
  { id: 's3',  name: 'Michael Brown',   email: 'michael.b@email.com',     avatar: 'MB', role: 'Chef',      department: 'Kitchen',    phone: '+91 98765 43212', status: 'Active',   hireDate: 'Mar 5, 2023',  performance: 4.6, salary: 55000 },
  { id: 's4',  name: 'Emily Davis',     email: 'emily.d@email.com',       avatar: 'ED', role: 'Bartender', department: 'Bar',        phone: '+91 98765 43213', status: 'Active',   hireDate: 'Mar 20, 2023', performance: 4.1, salary: 38000 },
  { id: 's5',  name: 'David Wilson',    email: 'david.w@email.com',       avatar: 'DW', role: 'Server',    department: 'Service',    phone: '+91 98765 43214', status: 'On Leave', hireDate: 'Apr 8, 2023',  performance: 3.9, salary: 30000 },
  { id: 's6',  name: 'Lisa Martinez',   email: 'lisa.m@email.com',        avatar: 'LM', role: 'Host',      department: 'Front Desk', phone: '+91 98765 43215', status: 'Active',   hireDate: 'May 12, 2023', performance: 4.4, salary: 35000 },
  { id: 's7',  name: 'Robert Taylor',   email: 'robert.t@email.com',      avatar: 'RT', role: 'Chef',      department: 'Kitchen',    phone: '+91 98765 43216', status: 'Active',   hireDate: 'Jun 1, 2023',  performance: 4.7, salary: 52000 },
  { id: 's8',  name: 'Amanda White',    email: 'amanda.w@email.com',      avatar: 'AW', role: 'Server',    department: 'Service',    phone: '+91 98765 43217', status: 'Inactive', hireDate: 'Jul 18, 2023', performance: 3.5, salary: 29000 },
  { id: 's9',  name: 'James Garcia',    email: 'james.g@email.com',       avatar: 'JG', role: 'Bartender', department: 'Bar',        phone: '+91 98765 43218', status: 'Active',   hireDate: 'Aug 3, 2023',  performance: 4.3, salary: 40000 },
  { id: 's10', name: 'Priya Sharma',    email: 'priya.s@email.com',       avatar: 'PS', role: 'Manager',   department: 'Management', phone: '+91 98765 43219', status: 'Active',   hireDate: 'Sep 9, 2023',  performance: 4.9, salary: 70000 },
];

let idCounter = 100;

// ── Store ──────────────────────────────────────────────────────────────────

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
      stats: {
        totalStaff: 48,
        totalStaffChange: '+12.5%',
        activeToday: 32,
        activeTodayPct: '66.7% of total staff',
        onLeave: 4,
        onLeavePct: '8.3% of total staff',
        totalPayroll: '₹18,750.00',
        totalPayrollChange: '↓ 5.4% vs last month',
        avgPerformance: '4.6 / 5.0',
        avgPerformanceChange: '↑ 0.3 vs last month',
        attendancePct: 92,
      },

      members: seedMembers,

      shifts: [
        { id: 'sh1', label: 'Morning Shift', time: '09:00 AM – 05:00 PM', staffCount: 12, staffAvatars: ['JS','SJ','MB','ED'], extra: 8  },
        { id: 'sh2', label: 'Evening Shift', time: '05:00 PM – 01:00 AM', staffCount: 15, staffAvatars: ['DW','LM','RT','AW'], extra: 11 },
        { id: 'sh3', label: 'Night Shift',   time: '01:00 AM – 09:00 AM', staffCount: 5,  staffAvatars: ['JG','PS'],           extra: 3  },
      ],

      birthdays: [
        { id: 'b1', name: 'Sarah Johnson', avatar: 'SJ', date: 'May 24' },
        { id: 'b2', name: 'Michael Brown', avatar: 'MB', date: 'May 26' },
        { id: 'b3', name: 'Emily Davis',   avatar: 'ED', date: 'May 28' },
        { id: 'b4', name: 'David Wilson',  avatar: 'DW', date: 'Jun 2'  },
        { id: 'b5', name: 'Lisa Martinez', avatar: 'LM', date: 'Jun 10' },
      ],

      attendanceBreakdown: [
        { label: 'Present', count: 441, color: '#22c55e' },
        { label: 'Absent',  count: 23,  color: '#ef4444' },
        { label: 'Late',    count: 14,  color: '#f97316' },
        { label: 'Leave',   count: 18,  color: '#a855f7' },
      ],

      payrollLines: [
        { label: 'Regular Pay',  amount: '₹14,250.00' },
        { label: 'Overtime Pay', amount: '₹2,260.00'  },
        { label: 'Deductions',   amount: '₹750.00'    },
        { label: 'Bonuses',      amount: '₹1,290.00'  },
      ],

      roleDistribution: [
        { role: 'Manager',   count: 5,  pct: '10.4%', color: '#f97316' },
        { role: 'Chef',      count: 8,  pct: '16.7%', color: '#22c55e' },
        { role: 'Server',    count: 20, pct: '41.7%', color: '#3b82f6' },
        { role: 'Bartender', count: 7,  pct: '14.6%', color: '#a855f7' },
        { role: 'Host',      count: 0,  pct: '0%',    color: '#eab308' },
        { role: 'Cleaner',   count: 8,  pct: '16.7%', color: '#64748b' },
      ],

      searchQuery: '',
      roleFilter: 'All Roles',
      departmentFilter: 'All Departments',
      statusFilter: 'All',
      currentPage: 1,
      perPage: 5,
      showAll: false,

      setSearchQuery:      (q) => set({ searchQuery: q, currentPage: 1 }),
      setRoleFilter:       (r) => set({ roleFilter: r, currentPage: 1 }),
      setDepartmentFilter: (d) => set({ departmentFilter: d, currentPage: 1 }),
      setStatusFilter:     (s) => set({ statusFilter: s, currentPage: 1 }),
      setCurrentPage:      (p) => set({ currentPage: p }),
      setShowAll:          (v) => set({ showAll: v, currentPage: 1 }),

      updateMemberStatus: (id, status) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, status } : m)),
        })),

      addMember: (m) =>
        set((state) => ({
          members: [
            ...state.members,
            { ...m, id: `s${++idCounter}` },
          ],
          stats: {
            ...state.stats,
            totalStaff: state.stats.totalStaff + 1,
          },
        })),

      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),

      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          stats: {
            ...state.stats,
            totalStaff: Math.max(0, state.stats.totalStaff - 1),
          },
        })),
    }),
    {
      name: 'admin-staff-store',
    }
  )
);