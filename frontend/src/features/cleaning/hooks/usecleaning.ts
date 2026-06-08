import { useCallback, useEffect, useMemo, useState } from 'react';
import { cleaningAPI, type CleaningMetric, type CleaningTask, type FloorTable, type UrgentTask, type CleaningStaffMember, type ActiveJob, type RecentActivity, type WeeklyRequestPoint, type JobStatusSegment, type DiningTable, type KitchenTable, type Washroom, type KitchenWashroom } from '../api/cleaning.api';
import { profileSyncEventName, type ProfileSyncPayload } from '../../../shared/profile/profileSync';

export interface UseCleaningResult {
  metrics: CleaningMetric[];
  floorTables: FloorTable[];
  diningTables: DiningTable[];
  kitchenTables: KitchenTable[];
  washrooms: Washroom[];
  kitchenWashrooms: KitchenWashroom[];
  urgentTasks: UrgentTask[];
  staffMembers: CleaningStaffMember[];
  activeJobs: ActiveJob[];
  recentActivity: RecentActivity[];
  weeklyRequests: WeeklyRequestPoint[];
  jobStatus: JobStatusSegment[];
  loading: boolean;
  error: string | null;
  assignTask: (taskId: string) => void;
  startTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  verifyTask: (taskId: string) => void;
  addDiningTable: (tableNumber: number) => void;
  deleteDiningTable: (tableId: number) => void;
  addWashroom: (label: string) => void;
  deleteWashroom: (washroomId: number) => void;
  addKitchenTable: (tableNumber: number) => void;
  deleteKitchenTable: (tableId: number) => void;
  addKitchenWashroom: (label: string) => void;
  deleteKitchenWashroom: (washroomId: number) => void;
  addStaffMember: (member: Omit<CleaningStaffMember, 'id'>) => void;
  editStaffMember: (memberId: number, updates: Partial<CleaningStaffMember>) => void;
  deleteStaffMember: (memberId: number) => void;
  refresh: () => void;
}

const placeholderMetrics: CleaningMetric[] = [
  { label: 'Pending Requests', value: '8', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { label: 'Cleaning Completed', value: '25', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { label: 'Requests Today', value: '13', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  { label: 'Service Rating', value: '4.9/5', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
];

const placeholderFloorTables: FloorTable[] = [
  { id: 1, label: 'All Floors', status: 'Normal', tone: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100' },
  { id: 2, label: 'Kitchen', status: 'In progress', tone: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  { id: 3, label: 'Dining', status: 'High priority', tone: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { id: 4, label: 'Lobby', status: 'Low', tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
];

const placeholderUrgentTasks: UrgentTask[] = [
  { id: '1', title: 'Table 2 cleanup', subtitle: 'Glassware & napkin replacement', priority: 'High', badgeColor: '#ef4444', badgeBg: 'rgba(239,68,68,0.15)', waiting: '10 min' },
  { id: '2', title: 'Spill on floor', subtitle: 'Near the buffet area', priority: 'Medium', badgeColor: '#f59e0b', badgeBg: 'rgba(245,158,11,0.15)', waiting: '5 min' },
  { id: '3', title: 'Inspection prep', subtitle: 'Finish guest room 118', priority: 'Low', badgeColor: '#0ea5e9', badgeBg: 'rgba(14,165,233,0.15)', waiting: '2 min' },
];

const placeholderStaffMembers: CleaningStaffMember[] = [
  { id: 1, initials: 'AM', name: 'Anita M.', status: 'Available', place: 'Floor 2', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-300' },
  { id: 2, initials: 'JL', name: 'Jason L.', status: 'On task', place: 'Kitchen', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  { id: 3, initials: 'NL', name: 'Nina L.', status: 'Break', place: 'Lobby', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
];

const placeholderActiveJobs: ActiveJob[] = [
  { id: 1, title: 'Restock toiletries', detail: 'Room 205', staff: 'Anita M.', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' },
  { id: 2, title: 'Polish mirrors', detail: 'Gym & Spa', staff: 'Jason L.', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  { id: 3, title: 'Waste collection', detail: 'Basement', staff: 'Nina L.', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
];

const placeholderRecentActivity: RecentActivity[] = [
  { id: 1, label: 'Room 104 cleared', time: '5 min ago', actor: 'Anita M.', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 2, label: 'Cleaning request queued', time: '12 min ago', actor: 'System', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  { id: 3, label: 'Staff shift updated', time: '25 min ago', actor: 'Jason L.', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
];

const placeholderDiningTables: DiningTable[] = [
  { id: 1, number: 1, label: 'Table 1', status: 'Available' },
  { id: 2, number: 2, label: 'Table 2', status: 'Needs Cleaning' },
  { id: 3, number: 3, label: 'Table 3', status: 'Occupied' },
  { id: 4, number: 4, label: 'Table 4', status: 'Available' },
];

const placeholderKitchenTables: KitchenTable[] = [
  { id: 1, number: 1, label: 'Kitchen Table 1', status: 'Available' },
  { id: 2, number: 2, label: 'Kitchen Table 2', status: 'Occupied' },
];

const placeholderWashrooms: Washroom[] = [
  { id: 1, label: 'Washroom A', status: 'Ready' },
  { id: 2, label: 'Washroom B', status: 'Occupied' },
];

const placeholderKitchenWashrooms: KitchenWashroom[] = [
  { id: 1, label: 'Kitchen Washroom A', status: 'Ready' },
];

const placeholderWeeklyRequests: WeeklyRequestPoint[] = [
  { day: 'Mon', count: 5 },
  { day: 'Tue', count: 9 },
  { day: 'Wed', count: 7 },
  { day: 'Thu', count: 10 },
  { day: 'Fri', count: 8 },
  { day: 'Sat', count: 12 },
  { day: 'Sun', count: 6 },
];

const placeholderJobStatus: JobStatusSegment[] = [
  { label: 'Pending', value: 8, color: '#f59e0b' },
  { label: 'In Progress', value: 14, color: '#0ea5e9' },
  { label: 'Resolved', value: 23, color: '#22c55e' },
];

export function useCleaning(): UseCleaningResult {
  const [metrics, setMetrics] = useState<CleaningMetric[]>(placeholderMetrics);
  const [floorTables, setFloorTables] = useState<FloorTable[]>(placeholderFloorTables);
  const [diningTables, setDiningTables] = useState<DiningTable[]>(placeholderDiningTables);
  const [kitchenTables, setKitchenTables] = useState<KitchenTable[]>(placeholderKitchenTables);
  const [washrooms, setWashrooms] = useState<Washroom[]>(placeholderWashrooms);
  const [kitchenWashrooms, setKitchenWashrooms] = useState<KitchenWashroom[]>(placeholderKitchenWashrooms);
  const [urgentTasks, setUrgentTasks] = useState<UrgentTask[]>(placeholderUrgentTasks);
  const [staffMembers, setStaffMembers] = useState<CleaningStaffMember[]>(placeholderStaffMembers);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>(placeholderActiveJobs);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(placeholderRecentActivity);
  const [weeklyRequests, setWeeklyRequests] = useState<WeeklyRequestPoint[]>(placeholderWeeklyRequests);
  const [jobStatus, setJobStatus] = useState<JobStatusSegment[]>(placeholderJobStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await cleaningAPI.getTasks();

      if (!response.success || !response.data) {
        setError('Unable to load cleaning tasks. Using cached placeholder state.');
        setLoading(false);
        return;
      }

      const tasks = response.data.tasks;
      const pendingCount = tasks.filter((task) => task.status === 'PENDING').length;
      const inProgressCount = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
      const completedCount = tasks.filter((task) => task.status === 'COMPLETED' || task.status === 'VERIFIED').length;

      setMetrics([
        { label: 'Pending Requests', value: `${pendingCount}`, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        { label: 'Cleaning Completed', value: `${completedCount}`, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        { label: 'Requests Today', value: `${tasks.length}`, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
        { label: 'Service Rating', value: '4.9/5', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
      ]);

      setUrgentTasks(
        tasks.map((task) => {
          const statusLabel =
            task.status === 'IN_PROGRESS'
              ? 'In progress'
              : task.status === 'PENDING'
              ? 'Pending'
              : task.status === 'COMPLETED'
              ? 'Completed'
              : task.status === 'VERIFIED'
              ? 'Verified'
              : task.status;

          return {
            id: task._id,
            title: `Cleaning task ${task._id.slice(-5)}`,
            subtitle: `Table ${task.tableId}`,
            priority: statusLabel,
            badgeColor:
              task.status === 'IN_PROGRESS'
                ? '#0ea5e9'
                : task.status === 'PENDING'
                ? '#f59e0b'
                : '#22c55e',
            badgeBg:
              task.status === 'IN_PROGRESS'
                ? 'rgba(14,165,233,0.15)'
                : task.status === 'PENDING'
                ? 'rgba(245,158,11,0.15)'
                : 'rgba(34,197,94,0.15)',
            waiting:
              task.status === 'PENDING'
                ? 'Waiting'
                : task.status === 'IN_PROGRESS'
                ? 'In progress'
                : 'Finished',
          };
        })
      );

      setJobStatus([
        { label: 'Pending', value: pendingCount, color: '#f59e0b' },
        { label: 'In Progress', value: inProgressCount, color: '#0ea5e9' },
        { label: 'Resolved', value: completedCount, color: '#22c55e' },
      ]);
    } catch (err) {
      setError('Unable to load cleaning tasks. Using cached placeholder state.');
      console.error('[useCleaning] loadDashboard failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const onProfileSync = (event: Event) => {
      const detail = (event as CustomEvent<ProfileSyncPayload>).detail;
      if (!detail || detail.roleContext !== 'cleaning') return;

      setStaffMembers((current) => {
        const targetIndex = current.findIndex((member) =>
          member.id === detail.profile.id ||
          member.name === detail.previousName ||
          member.name === detail.profile.name
        );

        const patchMember = (member: CleaningStaffMember): CleaningStaffMember => ({
          ...member,
          name: detail.profile.name,
          role: detail.profile.role,
          phone: detail.profile.phone,
          joinDate: detail.profile.joinDate || member.joinDate,
          avatarUrl: detail.profile.avatarUrl ?? member.avatarUrl ?? null,
          initials: detail.profile.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part[0]?.toUpperCase())
            .join('') || member.initials,
        });

        if (targetIndex === -1) {
          return current.map((member, index) => (index === 0 ? patchMember(member) : member));
        }

        return current.map((member, index) => (index === targetIndex ? patchMember(member) : member));
      });
    };

    window.addEventListener(profileSyncEventName, onProfileSync as EventListener);
    return () => window.removeEventListener(profileSyncEventName, onProfileSync as EventListener);
  }, []);

  const addDiningTable = useCallback((tableNumber: number) => {
    setDiningTables((current) => {
      if (current.some((table) => table.number === tableNumber)) return current;
      const nextId = current.length ? Math.max(...current.map((table) => table.id)) + 1 : 1;
      return [...current, { id: nextId, number: tableNumber, label: `Table ${tableNumber}`, status: 'Available' }]
        .sort((a, b) => a.number - b.number);
    });

    void cleaningAPI.addDiningTable(tableNumber).then((response) => {
      if (!response.success) {
        setError('Could not add new dining table.');
      }
    });
  }, []);

  const deleteDiningTable = useCallback((tableId: number) => {
    setDiningTables((current) => current.filter((table) => table.id !== tableId));
    void cleaningAPI.deleteDiningTable(tableId).then((response) => {
      if (!response.success) {
        setError('Could not delete dining table.');
      }
    });
  }, []);

  const addWashroom = useCallback((label: string) => {
    setWashrooms((current) => {
      const nextId = current.length ? Math.max(...current.map((washroom) => washroom.id)) + 1 : 1;
      return [...current, { id: nextId, label, status: 'Ready' }];
    });

    void cleaningAPI.addWashroom(label).then((response) => {
      if (!response.success) {
        setError('Could not add new washroom.');
      }
    });
  }, []);

  const deleteWashroom = useCallback((washroomId: number) => {
    setWashrooms((current) => current.filter((washroom) => washroom.id !== washroomId));
    void cleaningAPI.deleteWashroom(washroomId).then((response) => {
      if (!response.success) {
        setError('Could not delete washroom.');
      }
    });
  }, []);

  const addKitchenTable = useCallback((tableNumber: number) => {
    setKitchenTables((current) => {
      if (current.some((table) => table.number === tableNumber)) return current;
      const nextId = current.length ? Math.max(...current.map((table) => table.id)) + 1 : 1;
      return [...current, { id: nextId, number: tableNumber, label: `Kitchen Table ${tableNumber}`, status: 'Available' }]
        .sort((a, b) => a.number - b.number);
    });

    void cleaningAPI.addKitchenTable(tableNumber).then((response) => {
      if (!response.success) {
        setError('Could not add new kitchen table.');
      }
    });
  }, []);

  const deleteKitchenTable = useCallback((tableId: number) => {
    setKitchenTables((current) => current.filter((table) => table.id !== tableId));
    void cleaningAPI.deleteKitchenTable(tableId).then((response) => {
      if (!response.success) {
        setError('Could not delete kitchen table.');
      }
    });
  }, []);

  const addKitchenWashroom = useCallback((label: string) => {
    setKitchenWashrooms((current) => {
      const nextId = current.length ? Math.max(...current.map((washroom) => washroom.id)) + 1 : 1;
      return [...current, { id: nextId, label, status: 'Ready' }];
    });

    void cleaningAPI.addKitchenWashroom(label).then((response) => {
      if (!response.success) {
        setError('Could not add new kitchen washroom.');
      }
    });
  }, []);

  const deleteKitchenWashroom = useCallback((washroomId: number) => {
    setKitchenWashrooms((current) => current.filter((washroom) => washroom.id !== washroomId));
    void cleaningAPI.deleteKitchenWashroom(washroomId).then((response) => {
      if (!response.success) {
        setError('Could not delete kitchen washroom.');
      }
    });
  }, []);

  const makeInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'ST';
  }, []);

  const getStaffColor = useCallback((status: string) => {
    if (status.toLowerCase().includes('available')) return 'bg-sky-500/10 text-sky-600 dark:text-sky-300';
    if (status.toLowerCase().includes('on task')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    if (status.toLowerCase().includes('break')) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    return 'bg-slate-500/10 text-slate-500 dark:text-slate-300';
  }, []);

  const addStaffMember = useCallback((member: Omit<CleaningStaffMember, 'id'>) => {
    setStaffMembers((current) => {
      const nextId = current.length ? Math.max(...current.map((item) => item.id)) + 1 : 1;
      const newMember: CleaningStaffMember = {
        ...member,
        id: nextId,
        initials: makeInitials(member.name),
        color: getStaffColor(member.status),
      };

      void cleaningAPI.addStaffMember(newMember).then((response) => {
        if (!response.success) {
          setError('Could not add cleaning staff member.');
        }
      });

      return [...current, newMember];
    });
  }, [makeInitials, getStaffColor]);

  const editStaffMember = useCallback((memberId: number, updates: Partial<CleaningStaffMember>) => {
    setStaffMembers((current) =>
      current.map((member) =>
        member.id !== memberId
          ? member
          : {
              ...member,
              ...updates,
              initials: updates.name ? makeInitials(updates.name) : member.initials,
              color: updates.status ? getStaffColor(updates.status) : member.color,
            }
      )
    );

    void cleaningAPI.updateStaffMember(memberId, updates).then((response) => {
      if (!response.success) {
        setError('Could not update cleaning staff member.');
      }
    });
  }, [makeInitials, getStaffColor]);

  const deleteStaffMember = useCallback((memberId: number) => {
    setStaffMembers((current) => current.filter((member) => member.id !== memberId));
    void cleaningAPI.deleteStaffMember(memberId).then((response) => {
      if (!response.success) {
        setError('Could not delete cleaning staff member.');
      }
    });
  }, []);

  const assignTask = useCallback(
    (taskId: string) => {
      setUrgentTasks((current) =>
        current.map((task) => {
          if (task.id !== taskId) return task;
          if (task.priority === 'In progress') return task;

          return {
            ...task,
            subtitle: 'Assignment started',
            priority: 'In progress',
            badgeColor: '#0ea5e9',
            badgeBg: 'rgba(14,165,233,0.15)',
          };
        })
      );

      void cleaningAPI.assignTask(taskId).then((response) => {
        if (!response.success) {
          setError('Could not assign task to cleaning staff.');
        }
      });
    },
    []
  );

  const startTask = useCallback((taskId: string) => {
    setUrgentTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, subtitle: 'Cleaning started', priority: 'In progress', badgeColor: '#0ea5e9', badgeBg: 'rgba(14,165,233,0.15)' }
          : task
      )
    );

    void cleaningAPI.startTask(taskId).then((response) => {
      if (!response.success) {
        setError('Could not start cleaning task.');
      }
    });
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setUrgentTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, subtitle: 'Cleaning completed', priority: 'Completed', badgeColor: '#22c55e', badgeBg: 'rgba(34,197,94,0.15)' }
          : task
      )
    );

    void cleaningAPI.completeTask(taskId).then((response) => {
      if (!response.success) {
        setError('Could not complete cleaning task.');
      }
    });
  }, []);

  const verifyTask = useCallback((taskId: string) => {
    setUrgentTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, subtitle: 'Cleaning verified', priority: 'Verified', badgeColor: '#22c55e', badgeBg: 'rgba(34,197,94,0.15)' }
          : task
      )
    );

    void cleaningAPI.verifyTask(taskId).then((response) => {
      if (!response.success) {
        setError('Could not verify cleaning task.');
      }
    });
  }, []);

  const refresh = useCallback(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const metricsWithFallback = useMemo(() => metrics ?? placeholderMetrics, [metrics]);
  const floorTablesWithFallback = useMemo(() => floorTables ?? placeholderFloorTables, [floorTables]);

  return {
    metrics: metricsWithFallback,
    floorTables: floorTablesWithFallback,
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
    loading,
    error,
    assignTask,
    startTask,
    completeTask,
    verifyTask,
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
    refresh,
  };
}
