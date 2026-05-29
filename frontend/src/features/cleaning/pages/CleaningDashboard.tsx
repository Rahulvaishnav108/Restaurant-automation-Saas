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
  ChefHat,
  User,
  Sun,
  Moon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Search,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────

type CleaningStatus = 'pending' | 'in_progress' | 'completed';
type Priority = 'high' | 'normal' | 'low';

type CleaningTask = {
  id: number;
  tableNumber: number;
  status: CleaningStatus;
  priority: Priority;
  timeSinceVacant: number;
  requestedBy: 'customer' | 'system';
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
};

// ─── Placeholder Data ─────────────────────────────────────────

const placeholderTasks: CleaningTask[] = [
  { id: 1, tableNumber: 4,  status: 'pending',     priority: 'high',   timeSinceVacant: 15, requestedBy: 'customer' },
  { id: 2, tableNumber: 7,  status: 'in_progress', priority: 'normal', timeSinceVacant: 8,  requestedBy: 'system'   },
  { id: 3, tableNumber: 2,  status: 'pending',     priority: 'low',    timeSinceVacant: 3,  requestedBy: 'system'   },
  { id: 4, tableNumber: 9,  status: 'pending',     priority: 'high',   timeSinceVacant: 20, requestedBy: 'customer' },
  { id: 5, tableNumber: 11, status: 'completed',   priority: 'normal', timeSinceVacant: 30, requestedBy: 'system'   },
];

// ─── Config ───────────────────────────────────────────────────

const priorityConfig: Record<Priority, { color: string; bg: string; label: string }> = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  label: 'High Priority' },
  normal: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Normal'        },
  low:    { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  label: 'Low Priority'  },
};

const statusConfig: Record<CleaningStatus, { color: string; label: string }> = {
  pending:     { color: '#f59e0b', label: 'Pending'     },
  in_progress: { color: '#3b82f6', label: 'In Progress' },
  completed:   { color: '#22c55e', label: 'Completed'   },
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

// ─── CleaningTaskCard ─────────────────────────────────────────

const CleaningTaskCard = ({
  task,
  theme,
  onAction,
}: {
  task: CleaningTask;
  theme: typeof darkTheme;
  onAction: (id: number, status: CleaningStatus) => void;
}) => {
  const priority = priorityConfig[task.priority];
  const status   = statusConfig[task.status];

  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderLeft: `4px solid ${priority.color}`,
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '18px', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
            Table {task.tableNumber}
          </p>
          <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', marginBottom: 0 }}>
            Vacant for {task.timeSinceVacant} mins
            · {task.requestedBy === 'customer' ? '👤 Customer request' : '🤖 System alert'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span style={{
            background: priority.bg,
            color: priority.color,
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
          }}>
            {priority.label}
          </span>
          <span style={{
            color: status.color,
            fontSize: '11px',
            fontWeight: 600,
          }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      {task.status === 'pending' && (
        <button
          onClick={() => onAction(task.id, 'in_progress')}
          style={{
            background: '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Accept Task →
        </button>
      )}
      {task.status === 'in_progress' && (
        <button
          onClick={() => onAction(task.id, 'completed')}
          style={{
            background: 'rgba(34,197,94,0.15)',
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Mark Completed ✓
        </button>
      )}
      {task.status === 'completed' && (
        <div style={{
          background: 'rgba(34,197,94,0.1)',
          color: '#22c55e',
          borderRadius: '10px',
          padding: '10px',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          ✓ Table Now Available
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────

const CleaningDashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [tasks, setTasks] = useState<CleaningTask[]>(placeholderTasks);
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

  const handleAction = (id: number, newStatus: CleaningStatus) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  const pending    = tasks.filter(t => t.status === 'pending');
  const inProgress = tasks.filter(t => t.status === 'in_progress');
  const completed  = tasks.filter(t => t.status === 'completed');

  const highPriority   = pending.filter(t => t.priority === 'high');
  const otherPending   = pending.filter(t => t.priority !== 'high');

  const _filteredTasks = tasks.filter(t =>
  String(t.tableNumber).includes(searchQuery) ||
  t.priority.includes(searchQuery.toLowerCase()) ||
  t.status.includes(searchQuery.toLowerCase())
  );

  const filteredTasks = searchQuery ? _filteredTasks : [];

  const stats = [
    { label: 'Pending',      value: pending.length,    color: '#f59e0b', Icon: Clock         },
    { label: 'In Progress',  value: inProgress.length, color: '#3b82f6', Icon: Sparkles      },
    { label: 'Completed',    value: completed.length,  color: '#22c55e', Icon: CheckCircle2  },
    { label: 'High Priority',value: highPriority.length,color: '#ef4444',Icon: AlertTriangle },
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
        overflowY: 'auto',
        transition: 'background 0.3s',
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
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>Cleaning Staff</p>
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
            <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textPrimary, margin: 0 }}>Cleaning Lead</p>
            <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0 }}>Housekeeping</p>
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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>
              Cleaning Tasks 🧹
            </h1>
            <p style={{ fontSize: '14px', color: theme.textMuted, marginTop: '4px', marginBottom: 0 }}>
              Manage table cleanup and track progress in real time.
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
              transition: 'all 0.2s', flexShrink: 0,
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
            placeholder="Search by table, priority, status..."
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

        {/* Search Results Section */}
        {searchQuery && (
          <section>
            <h2 style={{
              fontSize: '16px', fontWeight: 600, color: theme.textPrimary,
              marginBottom: '12px', marginTop: 0,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{
                background: 'rgba(139,92,246,0.12)', padding: '4px 8px',
                borderRadius: '6px', color: '#8b5cf6', fontSize: '12px', fontWeight: 600,
              }}>
                SEARCH RESULTS
              </span>
              Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </h2>
            {filteredTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTasks.map(task => (
                  <CleaningTaskCard key={task.id} task={task} theme={theme} onAction={handleAction} />
                ))}
              </div>
            ) : (
              <div style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
              }}>
                <Search size={32} color={theme.textMuted} style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>
                  No tasks match "{searchQuery}"
                </p>
              </div>
            )}
          </section>
        )}

        {/* Show default sections only when not searching */}
        {!searchQuery && (
          <>
            {/* High Priority Section */}
            {highPriority.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '16px', fontWeight: 600, color: theme.textPrimary,
              marginBottom: '12px', marginTop: 0,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{
                background: 'rgba(239,68,68,0.12)', padding: '4px 8px',
                borderRadius: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600,
              }}>
                URGENT
              </span>
              High Priority Tasks
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {highPriority.map(task => (
                <CleaningTaskCard key={task.id} task={task} theme={theme} onAction={handleAction} />
              ))}
            </div>
          </section>
        )}

        {/* In Progress Section */}
        {inProgress.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '16px', fontWeight: 600, color: theme.textPrimary,
              marginBottom: '12px', marginTop: 0,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{
                background: 'rgba(59,130,246,0.12)', padding: '4px 8px',
                borderRadius: '6px', color: '#3b82f6', fontSize: '12px', fontWeight: 600,
              }}>
                IN PROGRESS
              </span>
              Being Cleaned
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inProgress.map(task => (
                <CleaningTaskCard key={task.id} task={task} theme={theme} onAction={handleAction} />
              ))}
            </div>
          </section>
        )}

        {/* Other Pending */}
        {otherPending.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '16px', fontWeight: 600, color: theme.textPrimary,
              marginBottom: '12px', marginTop: 0,
            }}>
              Other Tasks
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {otherPending.map(task => (
                <CleaningTaskCard key={task.id} task={task} theme={theme} onAction={handleAction} />
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '16px', fontWeight: 600, color: theme.textPrimary,
              marginBottom: '12px', marginTop: 0,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{
                background: 'rgba(34,197,94,0.12)', padding: '4px 8px',
                borderRadius: '6px', color: '#22c55e', fontSize: '12px', fontWeight: 600,
              }}>
                DONE
              </span>
              Completed
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completed.map(task => (
                <CleaningTaskCard key={task.id} task={task} theme={theme} onAction={handleAction} />
              ))}
            </div>
          </section>
        )}
          </>
        )}
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
            { label: 'Fast Cleanup',  sub: 'Quick turnaround', color: '#f97316', Icon: Clock        },
            { label: 'All Tracked',   sub: 'Real-time updates', color: '#22c55e', Icon: CheckCircle2 },
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

        {/* Task Summary */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: theme.textPrimary, marginBottom: '12px', marginTop: 0 }}>
            Task Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Pending',      count: pending.length,    color: '#f59e0b' },
              { label: 'In Progress',  count: inProgress.length, color: '#3b82f6' },
              { label: 'Completed',    count: completed.length,  color: '#22c55e' },
              { label: 'High Priority',count: highPriority.length,color: '#ef4444'},
            ].map(({ label, count, color }) => (
              <div key={label} style={{
                background: theme.miniCardBg, border: `1px solid ${theme.cardBorder}`,
                borderRadius: '10px', padding: '12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', color: theme.textSecondary }}>{label}</span>
                <span style={{
                  background: `${color}20`, color,
                  fontSize: '13px', fontWeight: 700,
                  padding: '2px 10px', borderRadius: '999px',
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Legend */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: theme.textPrimary, marginBottom: '12px', marginTop: 0 }}>
            Priority Legend
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(priorityConfig).map(([key, config]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: config.color, display: 'inline-block', flexShrink: 0,
                }} />
                <span style={{ fontSize: '12px', color: theme.textSecondary }}>{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* All clear state */}
        {pending.length === 0 && inProgress.length === 0 && (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '12px', padding: '20px', textAlign: 'center',
          }}>
            <CheckCircle2 size={28} color="#22c55e" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', margin: 0 }}>All Clean!</p>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px', marginBottom: 0 }}>
              No pending tasks right now.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CleaningDashboard;