/**
 * staff.api.ts
 * Location: src/features/staff/api/staff.api.ts
 *
 * ── Single source of truth for ALL types used across the staff feature ──
 * Both usestaff.ts and StaffDashboard.tsx import types from here.
 * Never define the same type in the hook or the dashboard.
 *
 * Backend integration: set VITE_API_URL in your .env file.
 * All endpoint functions are stubbed with TODO comments.
 * Uncomment the fetchAPI line and delete the placeholder return to go live.
 */

import type { AxiosRequestConfig } from 'axios';
import { apiClient } from '../../../shared/services/apiClient';

// ─── Generic response wrapper ─────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Fetch helper ─────────────────────────────────────────────

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method: (options.method as AxiosRequestConfig['method']) || 'GET',
      headers: options.headers ? (options.headers as AxiosRequestConfig['headers']) : undefined,
      data: options.body ? JSON.parse(options.body as string) : undefined,
    };

    const response = await apiClient.request<{ success: boolean; data: T; error?: string }>(config);
    const payload = response.data;
    if (!payload.success) {
      return { success: false, error: payload.error ?? 'Unknown error' };
    }
    return { success: true, data: payload.data };
  } catch (err) {
    // Narrow unknown error safely without `any`
    const isObj = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object';
    const unknownErr = err as unknown;
    let errorStr = 'Unknown error';
    if (isObj(unknownErr)) {
      const resp = unknownErr['response'];
      if (isObj(resp)) {
        const data = resp['data'];
        if (isObj(data)) {
          const e = data['error'];
          if (typeof e === 'string') errorStr = e;
          else if (isObj(e) && typeof e['message'] === 'string') errorStr = e['message'] as string;
        }
      }
      if (typeof unknownErr['message'] === 'string') errorStr = unknownErr['message'] as string;
    }
    console.error(`[Staff API] ${endpoint}:`, errorStr);
    return { success: false, error: String(errorStr) };
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── TYPES (canonical — import these everywhere, never redefine)
// ═══════════════════════════════════════════════════════════════

// ── Tables ──

export type TableStatus =
  | 'available'
  | 'occupied'
  | 'order_placed'
  | 'food_ready'
  | 'served'
  | 'needs_cleaning';

export interface Table {
  id: number;
  tableNumber: string;
  status: TableStatus;
  section: string;
  guestCount?: number;
}

// ── Requests & Alerts ──

export interface CustomerRequest {
  id: number;
  tableNumber: string;
  type: 'call_waiter' | 'water_refill' | 'extra_cutlery' | 'cleaning';
  time: string;
}

export interface FoodAlert {
  id: number;
  tableNumber: string;
  items: string[];
  readyAt: string;
}

// ── Staff ──

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: 'Manager' | 'Server' | 'Chef' | 'Bartender';
  department: string;
  phone: string;
  status: 'active' | 'on_leave';
  hireDate: string;
  initials: string;
  avatarColor: string;
}

// ── Stats (what /api/staff/stats returns) ──
// Note: trend fields are display strings like "↑ 12.5% vs last month"

export interface StaffStats {
  totalStaff: number;
  activeToday: number;
  onLeave: number;
  totalPayroll: string;       // display string e.g. "$18,750"
  avgPerformance: string;     // display string e.g. "4.6 / 5.0"
  totalPayrollTrend: string;
  totalStaffTrend: string;
  avgPerfTrend: string;
}

// ── Analytics ──

export interface AttendanceData {
  present: number;
  absent: number;
  late: number;
  leaves: number;             // field name is `leaves`, not `onLeave`
  overall: string;            // display string e.g. "92%"
}

export interface PayrollData {
  total: string;              // display string e.g. "$18,750.00"
  trend: string;
  regularPay: string;
  overtimePay: string;
  deductions: string;         // negative display string e.g. "-$750.00"
  bonuses: string;            // positive display string e.g. "+$1,250.00"
}

export interface PerformanceData {
  avgRating: string;          // display string e.g. "4.6 / 5.0"
  trend: string;
  distribution: number[];     // array of 5 values — index 0 = 1-star, index 4 = 5-star
}

export interface RolesData {
  managers: number;
  chefs: number;
  servers: number;
  bartenders: number;
  others: number;
  total: number;              // sum of all roles
}

// ── Schedule & misc ──

export interface ScheduleItem {
  time: string;               // e.g. "09:00 AM – 05:00 PM"
  label: string;              // e.g. "Morning Shift"
  staff: number;
  dot: string;                // hex color for the shift indicator dot
  avatars: string[];          // array of initials strings
  extra: number;              // count of additional staff beyond shown avatars
}

export interface BirthdayItem {
  name: string;
  role: string;               // e.g. "Server · Service"
  date: string;               // e.g. "May 24"
  initials: string;
  color: string;              // hex avatar color
}
function mapBackendRoleToStaffRole(role?: string): StaffMember['role'] {
  switch (role) {
    case 'kitchen-staff':
      return 'Chef';
    case 'cleaning-staff':
      return 'Bartender';
    case 'restaurant-admin':
      return 'Manager';
    case 'service-staff':
    case 'staff':
    default:
      return 'Server';
  }
}

function buildStaffProfile(user: Partial<StaffMember> & { mobile?: string; role?: string; restaurantName?: string; id?: string }): StaffMember {
  const name = user.name || 'Staff Member';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST';

  return {
    id: typeof user.id === 'string' ? Number(user.id) || 0 : user.id ?? 0,
    name,
    email: user.email ?? '',
    role: mapBackendRoleToStaffRole(user.role),
    department: user.restaurantName ? `${user.restaurantName}` : 'Service',
    phone: user.mobile ?? '',
    status: 'active',
    hireDate: '',
    initials,
    avatarColor: '#f97316',
  };
}
// ═══════════════════════════════════════════════════════════════
// ─── API ENDPOINT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// ── Tables ──

export const tableAPI = {
  /** GET /staff/tables — fetch all tables */
  getTables: async (): Promise<ApiResponse<Table[]>> => {
    const res = await fetchAPI<{ tables: Table[]; meta?: unknown }>('/staff/tables');
    return {
      success: res.success,
      data: res.data?.tables,
      error: res.error,
    };
  },

  /** PATCH /staff/tables/:id/status — update a table's status */
  updateStatus: async (_id: number, _status: TableStatus): Promise<ApiResponse<Table>> => {
    // Backend currently supports specific status transitions via /staff/tables/:id/occupy, /reserve, /assign.
    // Keep this stub while the exact status-change API is being finalized.
    return Promise.resolve({ success: true, data: {} as Table });
  },
};

// ── Customer Requests ──

export const requestsAPI = {
  /** GET /staff/requests — fetch all staff requests */
  getPending: async (): Promise<ApiResponse<CustomerRequest[]>> => {
    const res = await fetchAPI<{ requests: CustomerRequest[]; meta?: unknown }>('/staff/requests');
    return {
      success: res.success,
      data: res.data?.requests,
      error: res.error,
    };
  },

  /** PATCH /staff/requests/:id/complete — resolve a staff request */
  resolve: (id: number): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/staff/requests/${id}/complete`, { method: 'PATCH' });
  },
};

// ── Food Alerts ──

export const foodAlertsAPI = {
  /** GET /food-alerts?status=active */
  getActive: (): Promise<ApiResponse<FoodAlert[]>> => {
    // TODO: return fetchAPI<FoodAlert[]>('/food-alerts?status=active');
    return Promise.resolve({ success: true, data: [] });
  },

  /** POST /food-alerts/:id/action  body: { action: 'picked_up' | 'served' } */
  action: (_id: number, _action: 'picked_up' | 'served'): Promise<ApiResponse<void>> => {
    // TODO: return fetchAPI(`/food-alerts/${id}/action`, {
    //   method: 'POST',
    //   body: JSON.stringify({ action }),
    // });
    return Promise.resolve({ success: true });
  },
};

// ── Staff ──

export const staffAPI = {
  /** GET /staff */
  getAll: (): Promise<ApiResponse<StaffMember[]>> => {
    // TODO: return fetchAPI<StaffMember[]>('/staff');
    return Promise.resolve({ success: true, data: [] });
  },

  /** GET /staff/stats */
  getStats: (): Promise<ApiResponse<StaffStats>> => {
    // TODO: return fetchAPI<StaffStats>('/staff/stats');
    return Promise.resolve({ success: true, data: {} as StaffStats });
  },

  /** POST /staff */
  create: (_staff: Omit<StaffMember, 'id'>): Promise<ApiResponse<StaffMember>> => {
    // TODO: return fetchAPI<StaffMember>('/staff', {
    //   method: 'POST',
    //   body: JSON.stringify(staff),
    // });
    return Promise.resolve({ success: true, data: {} as StaffMember });
  },

  /** PATCH /staff/:id */
  update: (_id: number, _updates: Partial<StaffMember>): Promise<ApiResponse<StaffMember>> => {
    // TODO: return fetchAPI<StaffMember>(`/staff/${id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(updates),
    // });
    return Promise.resolve({ success: true, data: {} as StaffMember });
  },

  /** DELETE /staff/:id */
  delete: (_id: number): Promise<ApiResponse<void>> => {
    // TODO: return fetchAPI<void>(`/staff/${id}`, { method: 'DELETE' });
    return Promise.resolve({ success: true });
  },
};

// ── Analytics ──

export const analyticsAPI = {
  /** GET /analytics/attendance */
  getAttendance: (): Promise<ApiResponse<AttendanceData>> => {
    // TODO: return fetchAPI<AttendanceData>('/analytics/attendance');
    return Promise.resolve({ success: true, data: {} as AttendanceData });
  },

  /** GET /analytics/payroll */
  getPayroll: (): Promise<ApiResponse<PayrollData>> => {
    // TODO: return fetchAPI<PayrollData>('/analytics/payroll');
    return Promise.resolve({ success: true, data: {} as PayrollData });
  },

  /** GET /analytics/performance */
  getPerformance: (): Promise<ApiResponse<PerformanceData>> => {
    // TODO: return fetchAPI<PerformanceData>('/analytics/performance');
    return Promise.resolve({ success: true, data: {} as PerformanceData });
  },

  /** GET /analytics/roles */
  getRoles: (): Promise<ApiResponse<RolesData>> => {
    // TODO: return fetchAPI<RolesData>('/analytics/roles');
    return Promise.resolve({ success: true, data: {} as RolesData });
  },

  /** GET /schedule/today */
  getSchedule: (): Promise<ApiResponse<ScheduleItem[]>> => {
    // TODO: return fetchAPI<ScheduleItem[]>('/schedule/today');
    return Promise.resolve({ success: true, data: [] });
  },

  /** GET /staff/birthdays/upcoming */
  getBirthdays: (): Promise<ApiResponse<BirthdayItem[]>> => {
    // TODO: return fetchAPI<BirthdayItem[]>('/staff/birthdays/upcoming');
    return Promise.resolve({ success: true, data: [] });
  },
};

// ── User / Auth ──

export const userAPI = {
  /** GET /auth/me — get authenticated user profile */
  getProfile: async (): Promise<ApiResponse<StaffMember>> => {
    const res = await fetchAPI<{ user: Partial<StaffMember> & { mobile?: string; role?: string; restaurantName?: string; id?: string } }>('/auth/me');
    return {
      success: res.success,
      data: res.data?.user ? buildStaffProfile(res.data.user) : undefined,
      error: res.error,
    };
  },

  /** PATCH /users/me — update profile */
  updateProfile: async (updates: Partial<StaffMember>): Promise<ApiResponse<StaffMember>> => {
    const res = await fetchAPI<{ user: Partial<StaffMember> & { mobile?: string; role?: string; restaurantName?: string; id?: string } }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return {
      success: res.success,
      data: res.data?.user ? buildStaffProfile(res.data.user) : undefined,
      error: res.error,
    };
  },

  /** POST /auth/logout */
  logout: (): Promise<ApiResponse<void>> => {
    return fetchAPI<void>('/auth/logout', { method: 'POST' });
  },
};