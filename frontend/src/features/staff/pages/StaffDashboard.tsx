import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  CalendarDays,
  Users,
  Package,
  UserCog,
  BarChart3,
  Megaphone,
  Settings,
  BellRing,
  Search,
  ChefHat,
  Droplets,
  Sparkles,
  CheckCircle2,
  Clock,
  TableProperties,
  User,
  Sun,
  Moon,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────

type TableStatus =
  | 'available'
  | 'occupied'
  | 'order_placed'
  | 'food_ready'
  | 'served'
  | 'needs_cleaning';

type Table = {
  id: number;
  tableNumber: string;
  status: TableStatus;
  section: string;
  guestCount?: number;
};

type CustomerRequest = {
  id: number;
  tableNumber: string;
  type: 'call_waiter' | 'water_refill' | 'extra_cutlery' | 'cleaning';
  time: string;
};

type FoodAlert = {
  id: number;
  tableNumber: string;
  items: string[];
  readyAt: string;
};

// ─── Theme ───────────────────────────────────────────────────

const darkTheme = {
  pageBg:        '#111111',
  sidebarBg:     '#1a1a1a',
  cardBg:        '#1e1e1e',
  cardBorder:    '#2a2a2a',
  inputBg:       '#1e1e1e',
  miniCardBg:    '#222222',
  textPrimary:   '#ffffff',
  textSecondary: '#888888',
  textMuted:     '#666666',
  sidebarBorder: '#2a2a2a',
  navInactive:   '#888888',
  pickedUpBtn:   { bg: 'transparent', color: '#888', border: '1px solid #333' },
};

const lightTheme = {
  pageBg:        '#f5f5f5',
  sidebarBg:     '#ffffff',
  cardBg:        '#ffffff',
  cardBorder:    '#e8e8e8',
  inputBg:       '#f0f0f0',
  miniCardBg:    '#f8f8f8',
  textPrimary:   '#1a1a1a',
  textSecondary: '#555555',
  textMuted:     '#999999',
  sidebarBorder: '#eeeeee',
  navInactive:   '#555555',
  pickedUpBtn:   { bg: '#f0f0f0', color: '#555', border: '1px solid #ddd' },
};

// ─── Placeholder Data ─────────────────────────────────────────

const placeholderTables: Table[] = [
  { id: 1,  tableNumber: 'T01', status: 'available',      section: 'Indoor'                 },
  { id: 2,  tableNumber: 'T02', status: 'occupied',       section: 'Indoor',  guestCount: 4 },
  { id: 3,  tableNumber: 'T03', status: 'food_ready',     section: 'Outdoor', guestCount: 2 },
  { id: 4,  tableNumber: 'T04', status: 'needs_cleaning', section: 'Indoor'                 },
  { id: 5,  tableNumber: 'T05', status: 'order_placed',   section: 'Indoor',  guestCount: 3 },
  { id: 6,  tableNumber: 'T06', status: 'served',         section: 'Outdoor', guestCount: 5 },
  { id: 7,  tableNumber: 'T07', status: 'available',      section: 'Indoor'                 },
  { id: 8,  tableNumber: 'T08', status: 'occupied',       section: 'Indoor',  guestCount: 2 },
  { id: 9,  tableNumber: 'T09', status: 'order_placed',   section: 'Outdoor', guestCount: 6 },
  { id: 10, tableNumber: 'T10', status: 'available',      section: 'Indoor'                 },
];

const placeholderRequests: CustomerRequest[] = [
  { id: 1, tableNumber: 'T03', type: 'water_refill',  time: '2 mins ago' },
  { id: 2, tableNumber: 'T05', type: 'call_waiter',   time: '5 mins ago' },
  { id: 3, tableNumber: 'T02', type: 'extra_cutlery', time: '1 min ago'  },
];

const placeholderFoodAlerts: FoodAlert[] = [
  { id: 1, tableNumber: 'T03', items: ['Paneer Butter Masala', 'Naan x2'], readyAt: '3 mins ago' },
  { id: 2, tableNumber: 'T06', items: ['Dal Tadka', 'Jeera Rice'],         readyAt: '1 min ago'  },
];

// ─── Config ───────────────────────────────────────────────────

const statusConfig: Record<TableStatus, { label: string; color: string; bg: string; dot: string }> = {
  available:      { label: 'Available',      color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  dot: '#22c55e' },
  occupied:       { label: 'Occupied',       color: '#f97316', bg: 'rgba(249,115,22,0.15)', dot: '#f97316' },
  order_placed:   { label: 'Order Placed',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', dot: '#f59e0b' },
  food_ready:     { label: 'Food Ready',     color: '#f97316', bg: 'rgba(249,115,22,0.2)',  dot: '#f97316' },
  served:         { label: 'Served',         color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', dot: '#8b5cf6' },
  needs_cleaning: { label: 'Needs Cleaning', color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  dot: '#ef4444' },
};

const requestConfig = {
  call_waiter:   { label: 'Call Waiter',   Icon: BellRing,        color: '#f97316' },
  water_refill:  { label: 'Water Refill',  Icon: Droplets,        color: '#3b82f6' },
  extra_cutlery: { label: 'Extra Cutlery', Icon: UtensilsCrossed, color: '#8b5cf6' },
  cleaning:      { label: 'Cleaning',      Icon: Sparkles,        color: '#22c55e' },
};

const navItems = [
  { label: 'Dashboard',           Icon: LayoutDashboard },
  { label: 'Orders',              Icon: ShoppingBag     },
  { label: 'Menu Management',     Icon: UtensilsCrossed },
  { label: 'Reservations',        Icon: CalendarDays    },
  { label: 'Customers',           Icon: Users           },
  { label: 'Inventory',           Icon: Package         },
  { label: 'Staff Management',    Icon: UserCog         },
  { label: 'Reports & Analytics', Icon: BarChart3       },
  { label: 'Marketing',           Icon: Megaphone       },
  { label: 'Settings',            Icon: Settings        },
];

// ─── TableCard ────────────────────────────────────────────────

const TableCard = ({
  table,
  theme,
  onStatusChange,
}: {
  table: Table;
  theme: typeof darkTheme;
  onStatusChange: (id: number, status: TableStatus) => void;
}) => {
  const config = statusConfig[table.status];

  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '20px', fontWeight: 600, color: theme.textPrimary, letterSpacing: '-0.5px', margin: 0 }}>
            {table.tableNumber}
          </p>
          <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '2px', marginBottom: 0 }}>
            {table.section}{table.guestCount ? ` · ${table.guestCount} guests` : ''}
          </p>
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: config.bg, color: config.color,
          padding: '4px 10px', borderRadius: '999px',
          fontSize: '11px', fontWeight: 500,
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: config.dot, display: 'inline-block',
          }} />
          {config.label}
        </span>
      </div>

      {table.status === 'food_ready' && (
        <button
          onClick={() => onStatusChange(table.id, 'served')}
          style={{
            background: '#f97316', color: '#fff', border: 'none',
            borderRadius: '10px', padding: '10px', fontSize: '13px',
            fontWeight: 500, cursor: 'pointer', width: '100%',
          }}
        >
          Mark as Served →
        </button>
      )}
      {table.status === 'served' && (
        <button
          onClick={() => onStatusChange(table.id, 'needs_cleaning')}
          style={{
            background: 'rgba(239,68,68,0.12)', color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px',
            padding: '10px', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', width: '100%',
          }}
        >
          Table Vacated
        </button>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────

const StaffDashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [tables, setTables] = useState<Table[]>(placeholderTables);
  const [requests, setRequests] = useState<CustomerRequest[]>(placeholderRequests);
  const [foodAlerts, setFoodAlerts] = useState<FoodAlert[]>(placeholderFoodAlerts);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = isDark ? darkTheme : lightTheme;

  // ── Reset body/html styles to remove white borders ──
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
    body.style.background = isDark ? '#111111' : '#f5f5f5';

    return () => {
      html.style.cssText = '';
      body.style.cssText = '';
    };
  }, [isDark]);

  const handleStatusChange = (id: number, newStatus: TableStatus) => {
    setTables(tables.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleResolveRequest = (id: number) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleFoodAction = (id: number) => {
    setFoodAlerts(alerts => alerts.filter(a => a.id !== id));
  };

  const filteredTables = tables.filter(t =>
    t.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Tables', value: tables.length,                                        color: '#f97316', Icon: TableProperties },
    { label: 'Occupied',     value: tables.filter(t => t.status !== 'available').length,  color: '#f59e0b', Icon: Users           },
    { label: 'Food Ready',   value: tables.filter(t => t.status === 'food_ready').length, color: '#22c55e', Icon: ChefHat         },
    { label: 'Pending Reqs', value: requests.length,                                      color: '#8b5cf6', Icon: BellRing        },
  ];

  return (
    <div style={{
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      background: theme.pageBg,
      color: theme.textPrimary,
      fontFamily: 'Inter, sans-serif',
      transition: 'background 0.3s, color 0.3s',
      overflow: 'hidden',
    }}>

      {/* ── Left Sidebar ── */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '4px',
        transition: 'background 0.3s',
        overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#f97316',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChefHat size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>Smart Dining</p>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>Service Staff</p>
          </div>
        </div>

        {/* Nav Items */}
        {navItems.map(({ label, Icon }) => (
          <button
            key={label}
            onClick={() => setActiveNav(label)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '12px', border: 'none',
              cursor: 'pointer', fontSize: '13.5px',
              fontWeight: activeNav === label ? 600 : 400,
              background: activeNav === label ? '#f97316' : 'transparent',
              color: activeNav === label ? '#fff' : theme.navInactive,
              width: '100%', textAlign: 'left', transition: 'all 0.2s',
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Staff info */}
        <div style={{
          background: theme.miniCardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: '12px', padding: '12px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '34px', height: '34px', background: '#f97316',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={16} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textPrimary, margin: 0 }}>Service Captain</p>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>Floor Staff</p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{
        flex: 1,
        minWidth: 0,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
              Good Evening! 👋
            </h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, marginTop: '4px', marginBottom: 0 }}>
               Here&apos;s what&apos;s happening on the floor today.
            </p>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', borderRadius: '20px', cursor: 'pointer',
              border: `1px solid ${theme.cardBorder}`,
              background: theme.cardBg,
              color: theme.textSecondary,
              fontSize: '12px', fontWeight: 500,
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: theme.inputBg, border: `1px solid ${theme.cardBorder}`,
          borderRadius: '12px', padding: '12px 16px',
        }}>
          <Search size={18} color={theme.textMuted} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tables, sections..."
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: theme.textPrimary, fontSize: '14px', width: '100%',
            }}
          />
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {stats.map(({ label, value, color, Icon }) => (
            <div key={label} style={{
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              borderRadius: '16px', padding: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>{label}</p>
                <div style={{ background: `${color}20`, padding: '6px', borderRadius: '8px' }}>
                  <Icon size={16} color={color} />
                </div>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 600, color, marginTop: '8px', marginBottom: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Food Ready Alerts */}
        {foodAlerts.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '16px', fontWeight: 600, color: theme.textPrimary,
              marginBottom: '12px', marginTop: 0,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{
                background: 'rgba(249,115,22,0.12)', padding: '4px 8px',
                borderRadius: '6px', color: '#f97316', fontSize: '12px', fontWeight: 600,
              }}>
                URGENT
              </span>
              Food Ready to Serve
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {foodAlerts.map(alert => (
                <div key={alert.id} style={{
                  background: theme.cardBg,
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: '16px', padding: '16px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(249,115,22,0.12)', padding: '10px', borderRadius: '12px' }}>
                      <ChefHat size={20} color="#f97316" />
                    </div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
                        Table {alert.tableNumber}
                      </p>
                      <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '2px', marginBottom: 0 }}>
                        {alert.items.join(', ')} · Ready {alert.readyAt}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => handleFoodAction(alert.id)}
                      style={{
                        background: theme.pickedUpBtn.bg,
                        color: theme.pickedUpBtn.color,
                        border: theme.pickedUpBtn.border,
                        borderRadius: '10px', padding: '8px 14px',
                        fontSize: '13px', fontWeight: 500,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      Picked Up
                    </button>
                    <button
                      onClick={() => handleFoodAction(alert.id)}
                      style={{
                        background: '#f97316', color: '#fff', border: 'none',
                        borderRadius: '10px', padding: '8px 16px',
                        fontSize: '13px', fontWeight: 500,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      Served →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tables Grid */}
        <section>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
              All Tables
            </h2>
            <span style={{ fontSize: '13px', color: theme.textMuted }}>
              {filteredTables.length} tables
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '12px',
          }}>
            {filteredTables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                theme={theme}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      </main>

      {/* ── Right Panel ── */}
      <aside style={{
        width: '280px',
        flexShrink: 0,
        background: theme.sidebarBg,
        borderLeft: `1px solid ${theme.sidebarBorder}`,
        padding: '24px 16px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        overflowY: 'auto',
        transition: 'background 0.3s',
      }}>
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Fast Service',  sub: 'On-time delivery',  color: '#f97316', Icon: Clock        },
            { label: 'Live Tracking', sub: 'Real-time updates', color: '#22c55e', Icon: CheckCircle2 },
          ].map(({ label, sub, color, Icon }) => (
            <div key={label} style={{
              background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`,
              borderRadius: '12px', padding: '12px',
            }}>
              <Icon size={18} color={color} />
              <p style={{ fontSize: '12px', fontWeight: 500, color: theme.textPrimary, marginTop: '6px', marginBottom: 0 }}>{label}</p>
              <p style={{ fontSize: '11px', color: theme.textMuted, marginTop: '2px', marginBottom: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Pending Requests */}
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
              Pending Requests
            </h3>
            {requests.length > 0 && (
              <span style={{
                background: '#f97316', color: '#fff',
                fontSize: '11px', fontWeight: 600,
                padding: '2px 8px', borderRadius: '999px',
              }}>
                {requests.length}
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <div style={{
              background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`,
              borderRadius: '12px', padding: '20px', textAlign: 'center',
            }}>
              <CheckCircle2 size={24} color="#22c55e" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>All requests resolved!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {requests.map(request => {
                const config = requestConfig[request.type];
                return (
                  <div key={request.id} style={{
                    background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`,
                    borderRadius: '12px', padding: '12px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: `${config.color}18`, padding: '8px', borderRadius: '10px' }}>
                        <config.Icon size={16} color={config.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textPrimary, margin: 0 }}>
                          Table {request.tableNumber}
                        </p>
                        <p style={{ fontSize: '11px', color: theme.textMuted, marginTop: '2px', marginBottom: 0 }}>
                          {config.label} · {request.time}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleResolveRequest(request.id)}
                      style={{
                        background: '#f97316', color: '#fff', border: 'none',
                        borderRadius: '8px', padding: '8px', fontSize: '12px',
                        fontWeight: 500, cursor: 'pointer', width: '100%',
                      }}
                    >
                      Resolve →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Legend */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: theme.textPrimary, marginBottom: '12px', marginTop: 0 }}>
            Status Legend
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: config.dot, display: 'inline-block', flexShrink: 0,
                }} />
                <span style={{ fontSize: '12px', color: theme.textSecondary }}>{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StaffDashboard;