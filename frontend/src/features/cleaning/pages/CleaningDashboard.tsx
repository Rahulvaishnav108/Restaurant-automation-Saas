import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  UserCog,
  Settings,
  ChefHat,
  User,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useCleaning } from '../hooks/usecleaning';
import { useThemeMode } from '../../../shared/hooks/useThemeMode';
import { NotificationWindow } from '../components/NotificationWindow';
import { useNotifications } from '../hooks/useNotifications';

// Register ChartJS components at module load so chart components work reliably
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
import type { LucideIcon } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────

type Theme = typeof darkTheme;

type MetricCard = {
  label: string;
  value: string;
  Icon: LucideIcon;
  color: string;
};

type FloorTable = {
  label: string;
  status: string;
  tone: string;
};

type UrgentTask = {
  id: number;
  title: string;
  subtitle: string;
  priority: string;
  badgeColor: string;
  waiting: string;
};

type StaffMember = {
  id: number;
  initials: string;
  name: string;
  status: string;
  place: string;
  color: string;
};

type ActiveJob = {
  id: number;
  title: string;
  detail: string;
  staff: string;
  color: string;
};

type ActivityItem = {
  label: string;
  time: string;
  actor: string;
  color: string;
};

// ─── Theme ───────────────────────────────────────────────────

const darkTheme = {
  pageBg: '#0d0d0d', sidebarBg: '#141414', cardBg: '#1a1a1a',
  cardBorder: '#272727', inputBg: '#1a1a1a', miniCardBg: '#1f1f1f',
  textPrimary: '#f0f0f0', textSecondary: '#9a9a9a', textMuted: '#5a5a5a',
  sidebarBorder: '#242424', navInactive: '#7a7a7a',
  font: "'Plus Jakarta Sans', 'Inter', sans-serif",
  accent: '#f97316',
};

const lightTheme = {
  pageBg: '#f4f4f5', sidebarBg: '#ffffff', cardBg: '#ffffff',
  cardBorder: '#e8e8e8', inputBg: '#f0f0f0', miniCardBg: '#f8f8f8',
  textPrimary: '#111111', textSecondary: '#555555', textMuted: '#999999',
  sidebarBorder: '#eeeeee', navInactive: '#555555',
  font: "'Plus Jakarta Sans', 'Inter', sans-serif",
  accent: '#f97316',
};

// ─── Data ───────────────────────────────────────────────────

const metricIcons: Record<string, LucideIcon> = {
  'Pending Requests': AlertTriangle,
  'Cleaning Completed': CheckCircle2,
  'Requests Today': Clock,
  'Service Rating': Sparkles,
};

const navItems = [
  { label: 'Cleaning', Icon: Sparkles, to: '/cleaning' },
  { label: 'Notifications', Icon: Bell, to: '/cleaning/notifications' },
  { label: 'Profile', Icon: UserCog, to: '/cleaning/profile' },
  { label: 'Settings', Icon: Settings, to: '/cleaning/settings' },
];

const CleaningDashboard = () => {
  const { unreadCount } = useNotifications();
  const { isDark, toggleThemeMode } = useThemeMode();
  const [activeNav, setActiveNav] = useState('Cleaning');
  const [isNotificationWindowOpen, setIsNotificationWindowOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffFormName, setStaffFormName] = useState('');
  const [staffFormPlace, setStaffFormPlace] = useState('Floor 2');
  const [staffFormStatus, setStaffFormStatus] = useState('Available');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    metrics,
    diningTables,
    kitchenTables,
    washrooms,
    kitchenWashrooms,
    urgentTasks,
    staffMembers,
    activeJobs,
    recentActivity,
    weeklyRequests,
    jobStatus,
    assignTask,
    addDiningTable,
    deleteDiningTable,
    addWashroom,
    deleteWashroom,
    addKitchenTable,
    deleteKitchenTable,
    addKitchenWashroom,
    deleteKitchenWashroom,
    addStaffMember,
    editStaffMember,
    deleteStaffMember,
  } = useCleaning();

  const theme = isDark ? darkTheme : lightTheme;
  const currentCleaningUser = staffMembers[0];

  const getTableStatusStyles = (status: string) => {
    switch (status) {
      case 'Occupied':
        return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
      case 'Needs Cleaning':
        return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' };
      default:
        return { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' };
    }
  };

  const promptAddTable = () => {
    const value = window.prompt('Enter table number');
    if (!value) return;
    const number = parseInt(value, 10);
    if (Number.isNaN(number) || number <= 0) {
      window.alert('Please enter a valid table number.');
      return;
    }
    if (diningTables.some((table) => table.number === number)) {
      window.alert(`Table ${number} already exists.`);
      return;
    }
    addDiningTable(number);
  };

  const promptAddWashroom = () => {
    const value = window.prompt('Enter washroom name');
    if (!value?.trim()) return;
    addWashroom(value.trim());
  };

  const promptAddKitchenTable = () => {
    const value = window.prompt('Enter kitchen table number');
    if (!value) return;
    const number = parseInt(value, 10);
    if (Number.isNaN(number) || number <= 0) {
      window.alert('Please enter a valid kitchen table number.');
      return;
    }
    if (kitchenTables.some((table) => table.number === number)) {
      window.alert(`Kitchen Table ${number} already exists.`);
      return;
    }
    addKitchenTable(number);
  };

  const promptAddKitchenWashroom = () => {
    const value = window.prompt('Enter kitchen washroom name');
    if (!value?.trim()) return;
    addKitchenWashroom(value.trim());
  };

  const openAddStaffModal = () => {
    setStaffFormName('');
    setStaffFormPlace('Floor 2');
    setStaffFormStatus('Available');
    setEditingStaff(null);
    setIsStaffModalOpen(true);
  };

  const openEditStaffModal = (staff: StaffMember) => {
    setStaffFormName(staff.name);
    setStaffFormPlace(staff.place);
    setStaffFormStatus(staff.status);
    setEditingStaff(staff);
    setIsStaffModalOpen(true);
  };

  const closeStaffModal = () => {
    setIsStaffModalOpen(false);
    setEditingStaff(null);
  };

  const saveStaffMember = () => {
    const initials = staffFormName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'ST';

    const member = {
      initials,
      name: staffFormName || 'New Staff',
      status: staffFormStatus,
      place: staffFormPlace,
      color:
        staffFormStatus.toLowerCase().includes('available')
          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300'
          : staffFormStatus.toLowerCase().includes('on task')
          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
          : 'bg-slate-500/10 text-slate-500 dark:text-slate-300',
    };

    if (editingStaff) {
      editStaffMember(editingStaff.id, member);
    } else {
      addStaffMember(member);
    }

    closeStaffModal();
  };

  const handleDeleteStaff = (staffId: number) => {
    if (window.confirm('Delete this cleaning staff member?')) {
      deleteStaffMember(staffId);
      if (editingStaff?.id === staffId) {
        closeStaffModal();
      }
    }
  };

  // Chart data: weekly requests (example data)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.margin = '0';
    html.style.padding = '0';
    html.style.height = '100%';
    html.style.overflow = 'hidden';

    body.style.margin = '0';
    body.style.padding = '0';
    body.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.background = theme.pageBg;

    return () => {
      html.style.cssText = '';
      body.style.cssText = '';
    };
  }, [isDark]);

  useEffect(() => {
    try {
      // Help debugging in the dev preview
      // eslint-disable-next-line no-console
      console.log('CleaningDashboard mounted — charts should be visible');
    } catch (e) {
      // ignore
    }
  }, []);

  // Chart data: weekly requests (example trends from hook state)
  const weeklyData = {
    labels: weeklyRequests.map((point) => point.day),
    datasets: [
      {
        label: 'Requests',
        data: weeklyRequests.map((point) => point.count),
        backgroundColor: 'rgba(249,115,22,0.85)',
        borderRadius: 6,
      },
    ],
  };

  const weeklyOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: theme.cardBorder }, beginAtZero: true, ticks: { stepSize: 2 } },
    },
    maintainAspectRatio: false,
  } as any;

  // Doughnut: job status distribution
  const jobStatusData = {
    labels: jobStatus.map((segment) => segment.label),
    datasets: [
      {
        data: jobStatus.map((segment) => segment.value),
        backgroundColor: jobStatus.map((segment) => segment.color),
      },
    ],
  };

  const doughnutOptions = { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false } as any;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      background: theme.pageBg,
      color: theme.textPrimary,
      fontFamily: theme.font,
      transition: 'background 0.3s, color 0.3s',
      overflowY: isMobile ? 'auto' : 'hidden',
      overflowX: 'hidden',
    }}>
      {isMobile && sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            zIndex: 40,
          }}
        />
      )}

      <aside style={{
        width: isMobile ? '240px' : '220px',
        flexShrink: 0,
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '4px',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'transform 0.25s ease, background 0.3s',
        boxSizing: 'border-box',
        ...(isMobile ? {
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        } : {}),
      }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', background: '#f97316',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChefHat size={17} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Smart Dining</p>
              <p style={{ fontSize: '10px', color: theme.textMuted, margin: 0 }}>Cleaning Staff</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.textSecondary,
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {navItems.map(({ label, Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            onClick={(event) => {
              setActiveNav(label);
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
              fontWeight: activeNav === label ? 600 : 400,
              background: isActive ? '#f97316' : 'transparent',
              color: isActive ? '#fff' : theme.navInactive,
              width: '100%',
              boxSizing: 'border-box',
              textAlign: 'left',
              transition: 'all 0.15s',
              textDecoration: 'none',
              fontFamily: theme.font,
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
        <div style={{ background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '10px', padding: '10px', marginTop: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <Bell size={14} color="#f97316" />
            <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>Need help?</p>
          </div>
          <p style={{ fontSize: '10px', color: theme.textMuted, margin: '0 0 8px 0' }}>Visit our help center or contact support.</p>
          <button style={{ width: '100%', padding: '6px', borderRadius: '7px', background: 'transparent', border: `1px solid ${theme.cardBorder}`, color: theme.textSecondary, fontSize: '11px', cursor: 'pointer', fontFamily: theme.font }}>
            Go to Help Center →
          </button>
        </div>

        <div style={{
          background: theme.miniCardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '10px', padding: '10px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{
            width: '28px', height: '28px', background: '#f97316',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden', color: '#fff', fontSize: '10px', fontWeight: 700,
          }}>
            {currentCleaningUser?.avatarUrl ? (
              <img src={currentCleaningUser.avatarUrl} alt={currentCleaningUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              currentCleaningUser?.initials ?? <User size={13} color="#fff" />
            )}
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>{currentCleaningUser?.name ?? 'Cleaning Lead'}</p>
            <p style={{ fontSize: '10px', color: theme.textMuted, margin: 0 }}>{currentCleaningUser?.role ?? 'Housekeeping'}</p>
          </div>
        </div>
      </aside>

      <main style={{
        flex: 1,
        minWidth: 0,
        padding: isMobile ? '16px' : '24px',
        overflowY: isMobile ? 'visible' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.textSecondary,
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Menu size={24} />
              </button>
            )}
            <div>
              <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
                Cleaning Operations Dashboard
              </h1>
              <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', marginBottom: 0 }}>
                Monitor requests, jobs, staff, and floor status in one view.
              </p>
            </div>
          </div>
          <button
            onClick={toggleThemeMode}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '20px', cursor: 'pointer',
              border: `1px solid ${theme.cardBorder}`,
              background: theme.cardBg,
              color: theme.textSecondary,
              fontSize: '12px', fontWeight: 500,
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            {!isMobile && (isDark ? 'Light Mode' : 'Dark Mode')}
          </button>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', gap: isMobile ? '12px' : '18px' }}>
          {metrics.map(card => {
            const Icon = metricIcons[card.label] ?? AlertTriangle;
            return (
              <div key={card.label} style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '22px',
                padding: '22px',
                boxShadow: theme.pageBg === '#0d0d0d' ? '0 14px 35px rgba(0,0,0,0.08)' : '0 12px 28px rgba(15,23,42,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, color: theme.textMuted, fontSize: '11px' }}>{card.label}</p>
                    <p style={{ margin: '10px 0 0', color: theme.textPrimary, fontSize: '20px', fontWeight: 700 }}>{card.value}</p>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '16px',
                    background: `${card.color}20`, display: 'grid', placeItems: 'center',
                  }}>
                    <Icon size={20} color={card.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Charts section */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '16px', marginBottom: '18px' }}>
          <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '12px', height: '220px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>Requests — Last 7 days</p>
            <div style={{ height: '170px', marginTop: '8px' }}>
              <Bar data={weeklyData} options={weeklyOptions} />
            </div>
          </div>

          <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '12px', padding: '12px', height: '220px' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>Job Status</p>
            <div style={{ height: '170px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '140px', height: '140px' }}>
                <Doughnut data={jobStatusData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr', gap: '20px' }}>
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '24px',
            padding: isMobile ? '16px' : '24px',
            boxShadow: theme.pageBg === '#0d0d0d' ? '0 18px 45px rgba(0,0,0,0.08)' : '0 14px 35px rgba(15,23,42,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, color: theme.textMuted, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Restaurant Floor Map
                </p>
                <h2 style={{ margin: '10px 0 0', fontSize: '22px', color: theme.textPrimary }}>
                  Live dining room overview
                </h2>
              </div>
              <button style={{
                background: 'transparent',
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '14px',
                color: theme.textSecondary,
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '12px',
              }}>
                View Full Map
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
              gap: '14px',
            }}>
              <div style={{
                borderRadius: '24px',
                background: theme.miniCardBg,
                border: `1px solid ${theme.cardBorder}`,
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Dining Area Map
                    </p>
                    <h3 style={{ margin: '10px 0 0', fontSize: '20px', color: theme.textPrimary }}>Live dining room overview</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      onClick={promptAddTable}
                      style={{
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: '14px',
                        padding: '10px 14px',
                        background: theme.cardBg,
                        color: theme.textSecondary,
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Add Table
                    </button>
                    <button
                      onClick={promptAddWashroom}
                      style={{
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: '14px',
                        padding: '10px 14px',
                        background: theme.cardBg,
                        color: theme.textSecondary,
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Add Washroom
                    </button>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  alignItems: 'start',
                }}>
                  {diningTables.map((table) => {
                    const statusStyles = getTableStatusStyles(table.status);
                    return (
                      <div key={table.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '20px',
                        border: `1px solid ${theme.cardBorder}`,
                        background: theme.cardBg,
                        minHeight: '120px',
                      }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>{table.label}</p>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>Table {table.number}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            padding: '6px 10px',
                            borderRadius: '999px',
                            background: statusStyles.bg,
                            color: statusStyles.color,
                            fontSize: '11px',
                            fontWeight: 700,
                          }}>
                            {table.status}
                          </span>
                          <button
                            onClick={() => deleteDiningTable(table.id)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: theme.textSecondary,
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                  {washrooms.map((washroom) => (
                    <div key={washroom.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px',
                      background: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: '18px',
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>{washroom.label}</p>
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>{washroom.status}</p>
                      </div>
                      <button
                        onClick={() => deleteWashroom(washroom.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: theme.textSecondary,
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                borderRadius: '24px',
                background: theme.miniCardBg,
                border: `1px solid ${theme.cardBorder}`,
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Kitchen Area Map
                    </p>
                    <h3 style={{ margin: '10px 0 0', fontSize: '20px', color: theme.textPrimary }}>Kitchen overview</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      onClick={promptAddKitchenTable}
                      style={{
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: '14px',
                        padding: '10px 14px',
                        background: theme.cardBg,
                        color: theme.textSecondary,
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Add Kitchen Table
                    </button>
                    <button
                      onClick={promptAddKitchenWashroom}
                      style={{
                        border: `1px solid ${theme.cardBorder}`,
                        borderRadius: '14px',
                        padding: '10px 14px',
                        background: theme.cardBg,
                        color: theme.textSecondary,
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Add Kitchen Washroom
                    </button>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  alignItems: 'start',
                }}>
                  {kitchenTables.map((table) => {
                    const statusStyles = getTableStatusStyles(table.status);
                    return (
                      <div key={table.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '20px',
                        border: `1px solid ${theme.cardBorder}`,
                        background: theme.cardBg,
                        minHeight: '120px',
                      }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>{table.label}</p>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>Table {table.number}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            padding: '6px 10px',
                            borderRadius: '999px',
                            background: statusStyles.bg,
                            color: statusStyles.color,
                            fontSize: '11px',
                            fontWeight: 700,
                          }}>
                            {table.status}
                          </span>
                          <button
                            onClick={() => deleteKitchenTable(table.id)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: theme.textSecondary,
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                  {kitchenWashrooms.map((washroom) => (
                    <div key={washroom.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px',
                      background: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: '18px',
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>{washroom.label}</p>
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>{washroom.status}</p>
                      </div>
                      <button
                        onClick={() => deleteKitchenWashroom(washroom.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: theme.textSecondary,
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: '24px',
            padding: '24px',
            boxShadow: theme.pageBg === '#0d0d0d' ? '0 18px 45px rgba(0,0,0,0.08)' : '0 14px 35px rgba(15,23,42,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <p style={{ margin: 0, color: theme.textMuted, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Urgent Tasks
                </p>
                <h2 style={{ margin: '10px 0 0', fontSize: '22px', color: theme.textPrimary }}>
                  Focus on top priority alerts
                </h2>
              </div>
              <button style={{
                background: 'transparent',
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '14px',
                color: theme.textSecondary,
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '12px',
              }}>
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {urgentTasks.map(task => (
                <div key={task.id} style={{
                  background: theme.miniCardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: '22px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: theme.textPrimary }}>{task.title}</p>
                      <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>{task.subtitle}</p>
                    </div>
                    <span style={{
                      background: task.badgeBg ?? 'rgba(0,0,0,0.08)',
                      color: task.badgeColor,
                      borderRadius: '999px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}>
                      {task.priority}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                    <span style={{ color: theme.textSecondary, fontSize: '12px' }}>{task.waiting} waiting</span>
                    <button
                      onClick={() => assignTask(task.id)}
                      disabled={task.priority === 'In progress'}
                      style={{
                        maxWidth: '170px',
                        width: '100%',
                        border: 'none',
                        borderRadius: '14px',
                        padding: '12px',
                        background: task.priority === 'In progress' ? '#333' : '#f97316',
                        color: '#fff',
                        opacity: task.priority === 'In progress' ? 0.6 : 1,
                        fontWeight: 600,
                        cursor: task.priority === 'In progress' ? 'not-allowed' : 'pointer',
                        fontFamily: theme.font,
                      }}
                    >
                      {task.priority === 'In progress' ? 'Assigned' : 'Assign Staff'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <aside style={{
        width: isMobile ? '100%' : '320px',
        flexShrink: 0,
        background: theme.sidebarBg,
        borderLeft: isMobile ? 'none' : `1px solid ${theme.sidebarBorder}`,
        borderTop: isMobile ? `1px solid ${theme.sidebarBorder}` : 'none',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        overflowY: isMobile ? 'visible' : 'auto',
        overflowX: 'hidden',
        transition: 'background 0.3s',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Available Staff', value: staffMembers.length, note: 'Ready to assign', color: '#22c55e' },
            { label: 'Active Jobs', value: activeJobs.length, note: 'In progress', color: '#f97316' },
          ].map(card => (
            <div key={card.label} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: '20px',
              padding: '18px',
            }}>
              <p style={{ margin: 0, fontSize: '12px', color: theme.textMuted }}>{card.label}</p>
              <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 700, color: card.color }}>{card.value}</p>
              <p style={{ margin: '8px 0 0', fontSize: '11px', color: theme.textSecondary }}>{card.note}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '24px',
          padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Available Staff</p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>View All Staff</p>
            </div>
            <button onClick={openAddStaffModal} style={{
              background: 'transparent',
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textSecondary,
              borderRadius: '14px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px',
            }}>
              + Add
            </button>
          </div>
          {staffMembers.map(member => (
            <div key={member.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '12px 0',
              borderBottom: `1px solid ${theme.cardBorder}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '14px',
                  background: theme.miniCardBg,
                  display: 'grid', placeItems: 'center',
                  color: theme.textPrimary,
                  fontWeight: 700,
                }}>
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                  ) : (
                    member.initials
                  )}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>{member.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: theme.textSecondary }}>
                    {member.role ? `${member.role} · ` : ''}{member.place}
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                width: '100%',
                paddingLeft: '52px',
                marginTop: '2px',
              }}>
                <span style={{ color: member.color, fontSize: '11px', fontWeight: 700 }}>{member.status}</span>
                <button onClick={() => openEditStaffModal(member)} style={{
                  border: '1px solid rgba(37,99,235,0.2)',
                  background: 'transparent',
                  color: '#2563eb',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}>Edit</button>
                <button onClick={() => handleDeleteStaff(member.id)} style={{
                  border: '1px solid rgba(239,68,68,0.2)',
                  background: 'transparent',
                  color: '#ef4444',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '24px',
          padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Active Jobs</p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>Current cleaning work</p>
            </div>
            <ChevronRight size={18} color={theme.textSecondary} />
          </div>
          {activeJobs.map(job => (
            <div key={job.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
              padding: '12px 0', borderBottom: `1px solid ${theme.cardBorder}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>{job.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: theme.textSecondary }}>{job.detail}</p>
              </div>
              <span style={{ color: job.color, fontSize: '11px', fontWeight: 700 }}>{job.staff}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '24px',
          padding: '22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: theme.textPrimary }}>Recent Activity</p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>Latest status updates</p>
            </div>
            <ChevronRight size={18} color={theme.textSecondary} />
          </div>
          {recentActivity.map(item => (
            <div key={`${item.time}-${item.label}`} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${theme.cardBorder}` }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: item.color,
                marginTop: '6px',
                flexShrink: 0,
              }} />
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: theme.textPrimary }}>{item.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: theme.textSecondary }}>{item.actor} · {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
      {isStaffModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
          display: 'grid', placeItems: 'center', padding: '20px', zIndex: 50,
        }}>
          <div style={{
            width: '100%', maxWidth: '440px', background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`, borderRadius: '24px', padding: '28px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.textPrimary }}>
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>
                  Manage cleaning staff assignments and availability.
                </p>
              </div>
              <button onClick={closeStaffModal} style={{
                background: 'transparent', border: 'none', color: theme.textSecondary,
                cursor: 'pointer', fontSize: '18px', lineHeight: 1,
              }}>×</button>
            </div>

            <label style={{ display: 'block', marginBottom: '12px', color: theme.textSecondary, fontSize: '12px' }}>
              Name
              <input value={staffFormName} onChange={(e) => setStaffFormName(e.target.value)} placeholder="Jane Doe" style={{
                width: '100%', marginTop: '6px', padding: '12px 14px', borderRadius: '14px',
                border: `1px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.textPrimary,
              }} />
            </label>
            <label style={{ display: 'block', marginBottom: '12px', color: theme.textSecondary, fontSize: '12px' }}>
              Place
              <input value={staffFormPlace} onChange={(e) => setStaffFormPlace(e.target.value)} placeholder="Floor 2" style={{
                width: '100%', marginTop: '6px', padding: '12px 14px', borderRadius: '14px',
                border: `1px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.textPrimary,
              }} />
            </label>
            <label style={{ display: 'block', marginBottom: '22px', color: theme.textSecondary, fontSize: '12px' }}>
              Status
              <select value={staffFormStatus} onChange={(e) => setStaffFormStatus(e.target.value)} style={{
                width: '100%', marginTop: '6px', padding: '12px 14px', borderRadius: '14px',
                border: `1px solid ${theme.cardBorder}`, background: theme.inputBg, color: theme.textPrimary,
              }}>
                <option>Available</option>
                <option>On task</option>
                <option>Break</option>
              </select>
            </label>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={closeStaffModal} style={{
                border: `1px solid ${theme.cardBorder}`, background: theme.miniCardBg,
                color: theme.textSecondary, borderRadius: '14px', padding: '12px 18px', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={saveStaffMember} style={{
                border: 'none', background: '#2563eb', color: '#fff', borderRadius: '14px', padding: '12px 18px', cursor: 'pointer',
              }}>
                {editingStaff ? 'Save Changes' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
      <NotificationWindow
        open={isNotificationWindowOpen}
        onClose={() => setIsNotificationWindowOpen(false)}
        theme={theme}
      />
    </div>
  );
};

export default CleaningDashboard;
