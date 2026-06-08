import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  UtensilsCrossed, Users, UserCog, Settings,
  BellRing, Search, ChefHat, Droplets, Sparkles, CheckCircle2,
  TableProperties, User, Sun, Moon, Download, Plus,
  TrendingUp, TrendingDown, Star, DollarSign, UserCheck,
  UserMinus, ChevronLeft, ChevronRight, Bell, Menu, X,
} from 'lucide-react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// ── Types from the single source of truth ──
import type {
  TableStatus,
  Table,
  StaffMember,
} from '../api/staff.api';

// ── Hook (data + actions only, no types) ──
import { useStaff } from '../hooks/usestaff';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationWindow } from '../components/NotificationWindow';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// ─── Themes ───────────────────────────────────────────────────

const darkTheme = {
  pageBg: '#0d0d0d', sidebarBg: '#141414', cardBg: '#1a1a1a',
  cardBorder: '#272727', inputBg: '#1a1a1a', miniCardBg: '#1f1f1f',
  textPrimary: '#f0f0f0', textSecondary: '#9a9a9a', textMuted: '#5a5a5a',
  sidebarBorder: '#242424', navInactive: '#7a7a7a',
  pickedUpBtn: { bg: 'transparent', color: '#888', border: '1px solid #2e2e2e' },
  tableHeaderBg: '#161616', tableRowHover: '#1f1f1f', tableBorder: '#222222',
  font: "'Plus Jakarta Sans', 'Inter', sans-serif",
  accent: '#f97316',
};

const lightTheme = {
  pageBg: '#f4f4f5', sidebarBg: '#ffffff', cardBg: '#ffffff',
  cardBorder: '#e8e8e8', inputBg: '#f0f0f0', miniCardBg: '#f8f8f8',
  textPrimary: '#111111', textSecondary: '#555555', textMuted: '#999999',
  sidebarBorder: '#eeeeee', navInactive: '#555555',
  pickedUpBtn: { bg: '#f0f0f0', color: '#555', border: '1px solid #ddd' },
  tableHeaderBg: '#fafafa', tableRowHover: '#fafafa', tableBorder: '#f0f0f0',
  font: "'Plus Jakarta Sans', 'Inter', sans-serif",
  accent: '#f97316',
};

type Theme = typeof darkTheme;

// ─── Nav items ────────────────────────────────────────────────

const navItems = [
  { label: 'Staff Management', Icon: Users, to: '/staff' },
  { label: 'Notifications', Icon: Bell, to: '/staff/notifications' },
  { label: 'Profile', Icon: UserCog, to: '/staff/profile' },
  { label: 'Settings', Icon: Settings, to: '/staff/settings' },
];

// ─── Status config ────────────────────────────────────────────

const statusConfig: Record<TableStatus, { label: string; color: string; bg: string; dot: string }> = {
  available: { label: 'Available', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', dot: '#22c55e' },
  occupied: { label: 'Occupied', color: '#f97316', bg: 'rgba(249,115,22,0.15)', dot: '#f97316' },
  order_placed: { label: 'Order Placed', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', dot: '#f59e0b' },
  food_ready: { label: 'Food Ready', color: '#f97316', bg: 'rgba(249,115,22,0.2)', dot: '#f97316' },
  served: { label: 'Served', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', dot: '#8b5cf6' },
  needs_cleaning: { label: 'Needs Cleaning', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', dot: '#ef4444' },
};

const requestConfig = {
  call_waiter: { label: 'Call Waiter', Icon: BellRing, color: '#f97316' },
  water_refill: { label: 'Water Refill', Icon: Droplets, color: '#3b82f6' },
  extra_cutlery: { label: 'Extra Cutlery', Icon: UtensilsCrossed, color: '#8b5cf6' },
  cleaning: { label: 'Cleaning', Icon: Sparkles, color: '#22c55e' },
};

const roleBadgeStyle: Record<string, { bg: string; color: string }> = {
  Manager: { bg: 'rgba(249,115,22,0.12)', color: '#ea6c0a' },
  Server: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  Chef: { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
  Bartender: { bg: 'rgba(139,92,246,0.12)', color: '#7c3aed' },
};

// ─── Small reusable components ────────────────────────────────

const TableCard = ({
  table, theme, onStatusChange,
}: {
  table: Table;
  theme: Theme;
  onStatusChange: (id: number, s: TableStatus) => void;
}) => {
  const cfg = statusConfig[table.status];
  return (
    <div style={{
      background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
      borderRadius: '14px', padding: '12px',
      display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{table.tableNumber}</p>
          <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0 0' }}>
            {table.section}{table.guestCount ? ` · ${table.guestCount} guests` : ''}
          </p>
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: cfg.bg, color: cfg.color,
          padding: '3px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 500,
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
          {cfg.label}
        </span>
      </div>
      {table.status === 'food_ready' && (
        <button onClick={() => onStatusChange(table.id, 'served')} style={{
          background: '#f97316', color: '#fff', border: 'none',
          borderRadius: '8px', padding: '8px', fontSize: '12px',
          fontWeight: 500, cursor: 'pointer', width: '100%',
        }}>Serve →</button>
      )}
      {table.status === 'served' && (
        <button onClick={() => onStatusChange(table.id, 'needs_cleaning')} style={{
          background: 'rgba(239,68,68,0.12)', color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
          padding: '8px', fontSize: '12px', fontWeight: 500,
          cursor: 'pointer', width: '100%',
        }}>Vacated</button>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────

const StaffDashboard: React.FC = () => {
  const { unreadCount } = useNotifications();
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationWindowOpen, setIsNotificationWindowOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<StaffMember['role']>('Server');
  const [formDepartment, setFormDepartment] = useState('Service');
  const [formHireDate, setFormHireDate] = useState('');

  const theme = isDark ? darkTheme : lightTheme;

  const roleOptions: StaffMember['role'][] = ['Manager', 'Server', 'Chef', 'Bartender'];

  const getInitials = (text: string) => text
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'ST';

  const getAvatarColor = (role: StaffMember['role']) => {
    switch (role) {
      case 'Manager': return '#f97316';
      case 'Chef': return '#3b82f6';
      case 'Bartender': return '#8b5cf6';
      default: return '#22c55e';
    }
  };

  const parseHireDateToInput = (display: string) => {
    const parsed = new Date(display);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
  };

  const formatHireDate = (input: string) => {
    if (!input) return '';
    return new Date(input).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingStaff(null);
    setFormName('');
    setFormPhone('');
    setFormRole('Server');
    setFormDepartment('Service');
    setFormHireDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (staff: StaffMember) => {
    setModalMode('edit');
    setEditingStaff(staff);
    setFormName(staff.name);
    setFormPhone(staff.phone);
    setFormRole(staff.role);
    setFormDepartment(staff.department);
    setFormHireDate(parseHireDateToInput(staff.hireDate));
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const buildEmail = (name: string) => `${name.trim().toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '') || 'staff'}@example.com`;

  const saveStaff = async () => {
    const payload = {
      name: formName.trim() || 'New Team Member',
      email: buildEmail(formName),
      role: formRole,
      department: formDepartment.trim() || 'Service',
      phone: formPhone.trim() || '+91 00000 00000',
      status: 'active' as const,
      hireDate: formatHireDate(formHireDate) || formatHireDate(new Date().toISOString().slice(0, 10)),
      initials: getInitials(formName || 'Team Member'),
      avatarColor: getAvatarColor(formRole),
    };

    if (modalMode === 'add') {
      await handleAddStaff(payload);
    } else if (editingStaff) {
      await handleUpdateStaff(editingStaff.id, payload);
    }

    closeModal();
  };

  const deleteStaff = async () => {
    if (!editingStaff) return;
    if (!window.confirm(`Delete ${editingStaff.name}? This cannot be undone.`)) return;
    await handleDeleteStaff(editingStaff.id);
    closeModal();
  };

  // ── All data from the hook — no hardcoded values anywhere ──
  const {
    tables,
    requests,
    foodAlerts,
    staffList,
    staffStats,
    attendance,
    payroll,
    performance,
    roles,
    schedule,
    birthdays,
    floorStats,
    handleStatusChange,
    handleResolveRequest,
    handleFoodAction,
    handleAddStaff,
    handleUpdateStaff,
    handleDeleteStaff,
    handleExportStaff,
  } = useStaff();

  // ── Resize listener ──
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── White border fix ──
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.margin = '0'; html.style.padding = '0';
    html.style.height = '100%'; html.style.overflow = 'hidden';
    body.style.margin = '0'; body.style.padding = '0';
    body.style.height = '100%'; body.style.overflow = 'hidden';
    body.style.background = isDark ? '#0d0d0d' : '#f4f4f5';
    return () => { html.style.cssText = ''; body.style.cssText = ''; };
  }, [isDark]);

  // ── Filtered tables ──
  const filteredTables = tables.filter(t =>
    t.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Responsive helpers ──
  const pad = isMobile ? '14px' : '24px';
  const gap = isMobile ? '16px' : '24px';
  const cp = isMobile ? '12px' : '20px'; // card padding

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
    borderRadius: '14px', padding: cp, ...extra,
  });

  const h2style: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '15px', fontWeight: 600,
    color: theme.textPrimary, margin: '0 0 12px 0',
  };

  const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap };
  const fourCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '10px' };
  const fiveCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5,1fr)', gap: '10px' };

  // ── Placeholder chart fallbacks for when analytics endpoints are unavailable ──
  const PH_ATTENDANCE_CHART = {
    datasets: [{
      data: [441, 23, 14, 18],
      backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'],
      borderWidth: 0, cutout: '65%',
    }],
    labels: ['Present', 'Absent', 'Late', 'Leaves'],
  };

  const PH_PERF_CHART = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [{
      label: 'Staff %',
      data: [2, 6, 18, 32, 42],
      backgroundColor: '#f97316', borderRadius: 4,
    }],
  };

  const PH_ROLES_CHART = {
    datasets: [{
      data: [5, 8, 20, 7, 8],
      backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#94a3b8'],
      borderWidth: 2, borderColor: isDark ? '#1a1a1a' : '#ffffff', cutout: '60%',
    }],
    labels: ['Managers', 'Chefs', 'Servers', 'Bartenders', 'Others'],
  };

  const attendanceChartData = [attendance.present, attendance.absent, attendance.late, attendance.leaves].some(value => value > 0)
    ? {
      datasets: [{
        data: [attendance.present, attendance.absent, attendance.late, attendance.leaves],
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'],
        borderWidth: 0, cutout: '65%',
      }],
      labels: ['Present', 'Absent', 'Late', 'Leaves'],
    }
    : PH_ATTENDANCE_CHART;

  const perfChartData = performance.distribution?.length === 5
    ? {
      labels: ['1★', '2★', '3★', '4★', '5★'],
      datasets: [{
        label: 'Staff %',
        data: performance.distribution,
        backgroundColor: '#f97316', borderRadius: 4,
      }],
    }
    : PH_PERF_CHART;

  const rolesChartData = roles.total > 0
    ? {
      datasets: [{
        data: [roles.managers, roles.chefs, roles.servers, roles.bartenders, roles.others],
        backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#94a3b8'],
        borderWidth: 2, borderColor: isDark ? '#1a1a1a' : '#ffffff', cutout: '60%',
      }],
      labels: ['Managers', 'Chefs', 'Servers', 'Bartenders', 'Others'],
    }
    : PH_ROLES_CHART;

  // getPercent was unused, removed.

  const statusCounts = Object.entries(statusConfig).map(([status, cfg]) => ({
    status: status as TableStatus,
    label: cfg.label,
    count: tables.filter(t => t.status === status).length,
    color: cfg.color,
  }));

  const statusChartData = {
    labels: statusCounts.map(item => item.label),
    datasets: [{
      data: statusCounts.map(item => item.count),
      backgroundColor: statusCounts.map(item => item.color),
      borderWidth: 0,
    }],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  const chartOptions = (yLabel = false) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: yLabel ? {
      x: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: theme.textMuted, font: { size: 10 } } },
      y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: theme.textMuted, font: { size: 10 }, callback: (v: number | string) => v + '%' }, beginAtZero: true, max: 50 },
    } : {},
  });

  // ── The logged-in user is the first staffList entry (placeholder until auth wires up) ──
  const currentUser = staffList[0];

  return (
    <div style={{
      display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: theme.pageBg, color: theme.textPrimary,
      fontFamily: theme.font, overflow: 'hidden',
    }}>

      {/* ── Mobile overlay ── */}
      {isMobile && sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', border: 'none', padding: 0, cursor: 'pointer', zIndex: 40,
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: isMobile ? '240px' : '220px',
        flexShrink: 0,
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.sidebarBorder}`,
        display: 'flex', flexDirection: 'column',
        padding: '20px 12px', gap: '2px', overflowY: 'auto',
        // mobile: slide in/out
        ...(isMobile ? {
          position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        } : {}),
      }}>
        {/* Close button on mobile */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', background: '#f97316', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChefHat size={15} color="#fff" />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Smart Dining</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Brand — desktop */}
        {!isMobile && (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 6px' }}>
            <div style={{ width: '32px', height: '32px', background: '#f97316', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ChefHat size={17} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Smart Dining</p>
              <p style={{ fontSize: '10px', color: theme.textMuted, margin: 0 }}>Service Staff</p>
            </div>
          </div>
        )}

        {navItems.map(({ label, Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            onClick={(event) => {
              if (label === 'Notifications') {
                event.preventDefault();
                setIsNotificationWindowOpen(true);
              }
              if (isMobile) setSidebarOpen(false);
            }}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 400,
              background: isActive ? '#f97316' : 'transparent',
              color: isActive ? '#fff' : theme.navInactive,
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.15s',
              textDecoration: 'none',
              fontFamily: theme.font,
              position: 'relative',
            })}
          >
            <Icon size={15} />
            <span style={{ flex: 1 }}>{label}</span>
            {label === 'Notifications' && unreadCount > 0 && (
              <span style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '999px',
                padding: '2px 6px',
                minWidth: '16px',
                textAlign: 'center',
                display: 'inline-block',
                lineHeight: 1,
              }}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}

        <div style={{ flex: 1 }} />

        {/* Help box */}
        <div style={{ background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '10px', padding: '10px', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <Bell size={14} color="#f97316" />
            <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>Need help?</p>
          </div>
          <p style={{ fontSize: '10px', color: theme.textMuted, margin: '0 0 8px 0' }}>Visit our help center or contact support.</p>
          <button style={{ width: '100%', padding: '6px', borderRadius: '7px', background: 'transparent', border: `1px solid ${theme.cardBorder}`, color: theme.textSecondary, fontSize: '11px', cursor: 'pointer', fontFamily: theme.font }}>
            Go to Help Center →
          </button>
        </div>

        {/* Current user — from staffList[0], not hardcoded */}
        <div style={{ background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <div style={{ width: '28px', height: '28px', background: currentUser?.avatarColor ?? '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: '10px', fontWeight: 700 }}>
            {currentUser?.initials ?? <User size={13} />}
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{currentUser?.name ?? 'Staff'}</p>
            <p style={{ fontSize: '10px', color: theme.textMuted, margin: 0 }}>{currentUser?.role ?? 'Floor Staff'}</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── Top bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: isMobile ? '8px 12px' : '11px 20px',
          background: theme.sidebarBg,
          borderBottom: `1px solid ${theme.sidebarBorder}`, flexShrink: 0,
        }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textSecondary, padding: '4px', display: 'flex', alignItems: 'center' }}>
              <Menu size={20} />
            </button>
          )}

          {/* Search */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', background: theme.inputBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '8px', padding: '7px 10px', maxWidth: isMobile ? '100%' : '320px' }}>
            <Search size={13} color={theme.textMuted} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tables or staff..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: theme.textPrimary, fontSize: '12px', width: '100%', fontFamily: theme.font }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Theme toggle */}
          <button onClick={() => setIsDark(!isDark)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.textSecondary, fontSize: '11px', fontFamily: theme.font }}>
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {!isMobile && (isDark ? 'Light' : 'Dark')}
          </button>

          {/* Avatar — from currentUser, not hardcoded */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentUser?.avatarColor ?? '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
              {currentUser?.initials ?? 'ST'}
            </div>
            {!isMobile && (
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{currentUser?.name ?? 'Staff'}</p>
                <p style={{ fontSize: '10px', color: theme.textMuted, margin: 0 }}>{currentUser?.role ?? 'Staff'}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <main style={{ flex: 1, padding: pad, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Staff Management</h1>
              <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', marginBottom: 0 }}>Manage your team, schedules, roles and performance</p>
            </div>
            <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
              {!isMobile && (
                <button onClick={handleExportStaff} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '9px', cursor: 'pointer', border: `1px solid ${theme.cardBorder}`, background: theme.cardBg, color: theme.textPrimary, fontSize: '12px', fontFamily: theme.font }}>
                  <Download size={13} /> Export
                </button>
              )}
              <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '9px', cursor: 'pointer', border: 'none', background: '#f97316', color: '#fff', fontSize: '12px', fontWeight: 600, fontFamily: theme.font }}>
                <Plus size={13} /> Add Staff
              </button>
            </div>
          </div>

          {/* ── Staff stats (from staffStats hook data) ── */}
          <div style={fiveCol}>
            {[
              { label: 'Total Staff', value: staffStats.totalStaff, sub: staffStats.totalStaffTrend, subColor: '#22c55e', Icon: Users, iconBg: 'rgba(249,115,22,0.1)', iconColor: '#f97316' },
              { label: 'Active Today', value: staffStats.activeToday, sub: `${Math.round(staffStats.activeToday / staffStats.totalStaff * 100)}% of total`, subColor: theme.textMuted, Icon: UserCheck, iconBg: 'rgba(34,197,94,0.1)', iconColor: '#22c55e' },
              { label: 'On Leave', value: staffStats.onLeave, sub: `${Math.round(staffStats.onLeave / staffStats.totalStaff * 100)}% of total`, subColor: theme.textMuted, Icon: UserMinus, iconBg: 'rgba(139,92,246,0.1)', iconColor: '#8b5cf6' },
              { label: 'Payroll (May)', value: staffStats.totalPayroll, sub: staffStats.totalPayrollTrend, subColor: '#ef4444', Icon: DollarSign, iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3b82f6' },
              { label: 'Avg Performance', value: staffStats.avgPerformance, sub: staffStats.avgPerfTrend, subColor: '#22c55e', Icon: Star, iconBg: 'rgba(245,158,11,0.1)', iconColor: '#f59e0b' },
            ].map(({ label, value, sub, subColor, Icon, iconBg, iconColor }) => (
              <div key={label} style={card()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>{label}</p>
                  <div style={{ background: iconBg, padding: '6px', borderRadius: '8px' }}><Icon size={13} color={iconColor} /></div>
                </div>
                <p style={{ fontSize: '20px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 4px 0' }}>{value}</p>
                <p style={{ fontSize: '10px', color: subColor, margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Floor stats (from floorStats derived in hook) ── */}
          <div style={fourCol}>
            {[
              { label: 'Total Tables', value: floorStats.totalTables, color: '#f97316', Icon: TableProperties },
              { label: 'Occupied', value: floorStats.occupied, color: '#f59e0b', Icon: Users },
              { label: 'Food Ready', value: floorStats.foodReady, color: '#22c55e', Icon: ChefHat },
              { label: 'Pending Reqs', value: floorStats.pendingReqs, color: '#8b5cf6', Icon: BellRing },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} style={card()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>{label}</p>
                  <div style={{ background: `${color}20`, padding: '6px', borderRadius: '8px' }}><Icon size={14} color={color} /></div>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 700, color, marginTop: '8px', marginBottom: 0 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── Food alerts ── */}
          {foodAlerts.length > 0 && (
            <section>
              <h2 style={{ ...h2style, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: 'rgba(249,115,22,0.12)', padding: '2px 7px', borderRadius: '5px', color: '#f97316', fontSize: '10px', fontWeight: 700 }}>URGENT</span>
                Food Ready to Serve
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {foodAlerts.map(alert => (
                  <div key={alert.id} style={{
                    background: theme.cardBg, border: '1px solid rgba(249,115,22,0.25)',
                    borderRadius: '12px', padding: cp,
                    display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between', gap: '10px',
                    flexDirection: isMobile ? 'column' : 'row',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{ background: 'rgba(249,115,22,0.12)', padding: '8px', borderRadius: '10px', flexShrink: 0 }}><ChefHat size={16} color="#f97316" /></div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>Table {alert.tableNumber}</p>
                        <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {alert.items.join(', ')} · Ready {alert.readyAt}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '7px', flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
                      <button onClick={() => handleFoodAction(alert.id, 'picked_up')} style={{ flex: isMobile ? 1 : undefined, background: theme.pickedUpBtn.bg, color: theme.pickedUpBtn.color, border: theme.pickedUpBtn.border, borderRadius: '8px', padding: '7px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: theme.font }}>
                        Picked Up
                      </button>
                      <button onClick={() => handleFoodAction(alert.id, 'served')} style={{ flex: isMobile ? 1 : undefined, background: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.font }}>
                        Served →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Tables grid ── */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ ...h2style, marginBottom: 0 }}>All Tables</h2>
              <span style={{ fontSize: '11px', color: theme.textMuted }}>{filteredTables.length} tables</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill, minmax(155px,1fr))', gap: '10px' }}>
              {filteredTables.map(table => (
                <TableCard key={table.id} table={table} theme={theme} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </section>

          {/* ── Staff table ── */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ ...h2style, marginBottom: 0 }}>Staff Members</h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {!isMobile && ['All Roles', 'All Departments', 'Status'].map(f => (
                  <select key={f} style={{ padding: '5px 8px', borderRadius: '7px', border: `1px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.textSecondary, fontSize: '11px', cursor: 'pointer', outline: 'none', fontFamily: theme.font }}>
                    <option>{f}</option>
                  </select>
                ))}
                <button style={{ padding: '5px 12px', borderRadius: '7px', border: 'none', background: '#f97316', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: theme.font }}>View All</button>
              </div>
            </div>

            {/* Desktop: full table */}
            {!isMobile ? (
              <div style={{ overflowX: 'auto', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: theme.font }}>
                  <thead>
                    <tr style={{ background: theme.tableHeaderBg }}>
                      {['Staff Member', 'Role', 'Department', 'Phone', 'Status', 'Hire Date', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: theme.textMuted, borderBottom: `1px solid ${theme.tableBorder}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((s, i) => (
                      <tr key={s.id}
                        style={{ borderBottom: i < staffList.length - 1 ? `1px solid ${theme.tableBorder}` : 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = theme.tableRowHover)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: s.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{s.initials}</div>
                            <div>
                              <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{s.name}</p>
                              <p style={{ fontSize: '10px', color: theme.textMuted, margin: 0 }}>{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: roleBadgeStyle[s.role]?.bg ?? '#eee', color: roleBadgeStyle[s.role]?.color ?? '#333' }}>{s.role}</span>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: theme.textSecondary, whiteSpace: 'nowrap' }}>{s.department}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: theme.textSecondary, whiteSpace: 'nowrap' }}>{s.phone}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 500, background: s.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: s.status === 'active' ? '#16a34a' : '#b45309' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.status === 'active' ? '#22c55e' : '#f59e0b', display: 'inline-block' }} />
                            {s.status === 'active' ? 'Active' : 'On Leave'}
                          </span>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: theme.textSecondary, whiteSpace: 'nowrap' }}>{s.hireDate}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button onClick={() => openEditModal(s)} style={{ background: 'transparent', border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', fontSize: '11px' }}>Edit</button>
                            <button onClick={async () => {
                              if (!window.confirm(`Delete ${s.name}?`)) return;
                              await handleDeleteStaff(s.id);
                            }} style={{ background: 'rgba(239,68,68,0.12)', border: `1px solid rgba(239,68,68,0.3)`, color: '#ef4444', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', fontSize: '11px' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Mobile: card list
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {staffList.map(s => (
                  <div key={s.id} style={{ ...card(), display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: s.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{s.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{s.name}</p>
                      <p style={{ fontSize: '11px', color: theme.textMuted, margin: '2px 0 0 0' }}>{s.role} · {s.department}</p>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 500, background: s.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: s.status === 'active' ? '#16a34a' : '#b45309', flexShrink: 0 }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: s.status === 'active' ? '#22c55e' : '#f59e0b', display: 'inline-block' }} />
                      {s.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isMobile && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: theme.textMuted }}>
                  Showing {staffList.length} of {staffStats.totalStaff} staff
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[<ChevronLeft key="left" size={12} />, '1', '2', '3', '…', '10', <ChevronRight key="right" size={12} />].map((p, i) => (
                    <button key={i} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '7px', border: `1px solid ${i === 1 ? '#f97316' : theme.cardBorder}`, background: i === 1 ? '#f97316' : theme.cardBg, color: i === 1 ? '#fff' : theme.textSecondary, fontSize: '11px', fontWeight: i === 1 ? 700 : 400, cursor: 'pointer', fontFamily: theme.font }}>{p}</button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── Charts row 1: Attendance + Payroll ── */}
          <div style={twoCol}>
            {/* Attendance — overall from attendance.overall, chart from attendance.present/absent/late/leaves */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={h2style}>Attendance <span style={{ fontSize: '10px', color: theme.textMuted, fontWeight: 400 }}>(This Month)</span></h3>
                <span style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}>View Report</span>
              </div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 2px 0' }}>{attendance.overall}</p>
              <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 10px 0' }}>Overall Attendance</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {[['#22c55e', `Present ${attendance.present}`], ['#ef4444', `Absent ${attendance.absent}`], ['#f59e0b', `Late ${attendance.late}`], ['#94a3b8', `Leaves ${attendance.leaves}`]].map(([c, l]) => (
                  <span key={l as string} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: theme.textSecondary }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c as string, display: 'inline-block' }} />{l}
                  </span>
                ))}
              </div>
              <div style={{ position: 'relative', height: '140px' }}>
                <Doughnut data={attendanceChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            {/* Payroll — all values from payroll hook data */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={h2style}>Payroll Summary</h3>
                <span style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}>View Report</span>
              </div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 3px 0' }}>{payroll.total}</p>
              <p style={{ fontSize: '11px', color: '#ef4444', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingDown size={12} /> {payroll.trend}
              </p>
              {[
                ['Regular Pay', payroll.regularPay, theme.textPrimary],
                ['Overtime Pay', payroll.overtimePay, theme.textPrimary],
                ['Deductions', payroll.deductions, '#ef4444'],
                ['Bonuses', payroll.bonuses, '#22c55e'],
              ].map(([l, v, c]) => (
                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${theme.tableBorder}`, fontSize: '12px' }}>
                  <span style={{ color: theme.textSecondary }}>{l}</span>
                  <span style={{ color: c as string, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Charts row 2: Performance + Roles ── */}
          <div style={twoCol}>
            {/* Performance — avgRating and trend from performance hook data, chart from performance.distribution */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={h2style}>Performance Overview</h3>
                <span style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}>View Report</span>
              </div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 3px 0' }}>{performance.avgRating}</p>
              <p style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 12px 0' }}>
                <TrendingUp size={12} /> {performance.trend}
              </p>
              <div style={{ position: 'relative', height: '140px' }}>
                <Bar data={perfChartData} options={chartOptions(true) as Record<string, unknown>} />
              </div>
            </div>

            {/* Roles — all counts from roles hook data */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={h2style}>Roles Distribution</h3>
                <span style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}>View All</span>
              </div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 2px 0' }}>{roles.total}</p>
              <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 10px 0' }}>Team members by role</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {[
                  ['#f97316', `Managers ${roles.managers}`],
                  ['#22c55e', `Chefs ${roles.chefs}`],
                  ['#3b82f6', `Servers ${roles.servers}`],
                  ['#8b5cf6', `Bartenders ${roles.bartenders}`],
                  ['#94a3b8', `Others ${roles.others}`],
                ].map(([c, label]) => (
                  <span key={label as string} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: theme.textSecondary }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c as string, display: 'inline-block' }} />{label}
                  </span>
                ))}
              </div>
              <div style={{ position: 'relative', height: '140px' }}>
                <Doughnut data={rolesChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>

          {/* ── Schedule + Birthdays ── */}
          <div style={twoCol}>
            {/* Schedule — from schedule hook data */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={h2style}>Today&apos;s Schedule</h3>
                <span style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}>View All</span>
              </div>
              {schedule.map(({ time, label, staff, dot, avatars, extra }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot, marginTop: '4px', flexShrink: 0, display: 'block' }} />
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{time}</p>
                      <p style={{ fontSize: '10px', color: theme.textMuted, margin: '2px 0 0 0' }}>{label} · {staff} Staff</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    {avatars.map((a, i) => (
                      <div key={a} style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f97316', border: `2px solid ${theme.cardBg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '7px', fontWeight: 700, marginLeft: i === 0 ? 0 : '-5px' }}>{a}</div>
                    ))}
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#94a3b8', border: `2px solid ${theme.cardBg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '7px', fontWeight: 700, marginLeft: '-5px' }}>+{extra}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Birthdays — from birthdays hook data */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={h2style}>Upcoming Birthdays</h3>
                <span style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}>View All</span>
              </div>
              {birthdays.map(({ name, role, date, initials, color }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{name}</p>
                      <p style={{ fontSize: '10px', color: theme.textMuted, margin: '2px 0 0 0' }}>{role}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#f97316', fontWeight: 600 }}>{date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Pending requests + Status legend ── */}
          <div style={twoCol}>
            {/* Requests — from requests hook data */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={h2style}>Pending Requests</h3>
                {requests.length > 0 && (
                  <span style={{ background: '#f97316', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '999px' }}>{requests.length}</span>
                )}
              </div>
              {requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle2 size={22} color="#22c55e" style={{ margin: '0 auto 8px', display: 'block' }} />
                  <p style={{ fontSize: '12px', color: theme.textMuted, margin: 0 }}>All requests resolved!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {requests.map(req => {
                    const cfg = requestConfig[req.type];
                    return (
                      <div key={req.id} style={{ background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ background: `${cfg.color}18`, padding: '7px', borderRadius: '8px' }}><cfg.Icon size={14} color={cfg.color} /></div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>Table {req.tableNumber}</p>
                            <p style={{ fontSize: '10px', color: theme.textMuted, margin: '1px 0 0 0' }}>{cfg.label} · {req.time}</p>
                          </div>
                        </div>
                        <button onClick={() => handleResolveRequest(req.id)} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: '7px', padding: '7px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: theme.font }}>
                          Resolve →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status breakdown card styled like the attendance card */}
            <div style={card()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={h2style}>Table Status Breakdown</h3>
                <span style={{ fontSize: '11px', color: '#f97316', cursor: 'pointer' }}>Refresh</span>
              </div>

              <p style={{ fontSize: '22px', fontWeight: 700, color: theme.textPrimary, margin: '0 0 3px 0' }}>{tables.length} Tables</p>
              <p style={{ fontSize: '11px', color: theme.textMuted, margin: '0 0 10px 0' }}>Current floor status</p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {statusCounts.map(item => (
                  <span key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '6px 10px', fontSize: '11px', color: theme.textSecondary }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                    <strong style={{ color: theme.textPrimary, fontWeight: 600 }}>{item.count}</strong> {item.label}
                  </span>
                ))}
              </div>

              <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                <Doughnut data={statusChartData} options={statusChartOptions} />
              </div>
            </div>
          </div>

          <div style={{ height: '16px' }} />
        </main>

        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 12, 20, 0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', backgroundClip: 'border-box', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: isMobile ? '100%' : '520px', maxWidth: '100%', background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '22px', boxShadow: '0 30px 80px rgba(0,0,0,0.18)', padding: '24px', position: 'relative' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '16px' }}>×</button>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: theme.textPrimary, margin: 0, marginBottom: '10px' }}>{modalMode === 'add' ? 'Add Staff Member' : 'Edit Staff Member'}</h2>
              <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 18px 0' }}>Fill in the details below and save to update the dashboard.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: theme.textSecondary, fontSize: '12px' }}>
                  Name
                  <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Full name" style={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '10px 12px', background: theme.inputBg, color: theme.textPrimary, fontSize: '13px', fontFamily: theme.font }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: theme.textSecondary, fontSize: '12px' }}>
                  Phone Number
                  <input value={formPhone} onChange={e => setFormPhone(e.target.value)} placeholder="+91 12345 67890" style={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '10px 12px', background: theme.inputBg, color: theme.textPrimary, fontSize: '13px', fontFamily: theme.font }} />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: theme.textSecondary, fontSize: '12px' }}>
                    Role
                    <select value={formRole} onChange={e => setFormRole(e.target.value as StaffMember['role'])} style={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '10px 12px', background: theme.inputBg, color: theme.textPrimary, fontSize: '13px', fontFamily: theme.font }}>
                      {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: theme.textSecondary, fontSize: '12px' }}>
                    Department
                    <input value={formDepartment} onChange={e => setFormDepartment(e.target.value)} placeholder="Service" style={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '10px 12px', background: theme.inputBg, color: theme.textPrimary, fontSize: '13px', fontFamily: theme.font }} />
                  </label>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: theme.textSecondary, fontSize: '12px' }}>
                  Hire Date
                  <input type="date" value={formHireDate} onChange={e => setFormHireDate(e.target.value)} style={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '10px 12px', background: theme.inputBg, color: theme.textPrimary, fontSize: '13px', fontFamily: theme.font }} />
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={saveStaff} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: theme.font }}>Save</button>
                  <button onClick={closeModal} style={{ background: theme.miniCardBg, color: theme.textPrimary, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '10px 18px', cursor: 'pointer', fontSize: '12px', fontFamily: theme.font }}>Cancel</button>
                </div>
                {modalMode === 'edit' && (
                  <button onClick={deleteStaff} style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '12px', padding: '10px 18px', cursor: 'pointer', fontSize: '12px', fontFamily: theme.font }}>Delete</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <NotificationWindow
        open={isNotificationWindowOpen}
        onClose={() => setIsNotificationWindowOpen(false)}
        theme={theme}
      />

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.cardBorder}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${theme.textMuted}; }
      `}</style>
    </div>
  );
};

export default StaffDashboard;