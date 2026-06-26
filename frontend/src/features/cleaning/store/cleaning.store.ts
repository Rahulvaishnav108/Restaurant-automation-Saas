// src/features/cleaning/store/cleaning.store.ts

export type TableStatus =
  | 'Needs Cleaning'
  | 'Cleaning Requested'
  | 'In Progress'
  | 'Ready for Inspection'
  | 'Available';
export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface TableItem {
  id: string;
  area: string;
  seats: number;
  status: TableStatus;
  priority: PriorityLevel;
  timeAgo: string; // Time elapsed since vacant
  assignedTo: { name: string; avatar: string } | null;
  progress?: number; // Only for In Progress tables
  notes?: string;
  maintenanceIssue?: string;
}

export interface CleaningRequest {
  id: string;
  type: string;
  icon: string;
  iconColor: string;
  location: string;
  requestedBy: { name: string; avatar: string };
  priority: PriorityLevel;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Scheduled';
  requestedOn: string;
  requestedTime: string;
  notes?: string;
}

class CleaningStore {
  private static instance: CleaningStore;

  public tables: TableItem[] = [
    {
      id: 'T07',
      area: 'Dining Area A',
      seats: 4,
      status: 'Needs Cleaning',
      priority: 'High',
      timeAgo: 'Just Now',
      assignedTo: null,
    },
    {
      id: 'T12',
      area: 'Dining Area A',
      seats: 2,
      status: 'In Progress',
      priority: 'Medium',
      timeAgo: '2 min ago',
      assignedTo: {
        name: 'Ramesh K.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1EeclPIzb65zLML4Z-Ep8QnCj_Ey68uOYKOfFtZuK_k5ILmHPwi-DSDwYreE9ju4D4Z79Hp6UeAKZXSwBOURkmGSQ7hNQ8-lDeQGBfmjcHltnwofvxh67WrZSDukcUkwZiuZjqYa74AhkTFTcLWqysc21n_T9l3J9vkmkj_lFhXuaPU189ige8Tlb5foWMvGnW27LhowBJk4dHeUfzWcmeRluinE4acRYrVtfGNEr0sYCTnJ1sdGsg1NYN3HFCrqzkH0-TJrClE',
      },
      progress: 45,
    },
    {
      id: 'T03',
      area: 'Dining Area A',
      seats: 6,
      status: 'Cleaning Requested',
      priority: 'High',
      timeAgo: '4 min ago',
      assignedTo: null,
    },
    {
      id: 'T15',
      area: 'Terrace Area',
      seats: 3,
      status: 'Needs Cleaning',
      priority: 'Low',
      timeAgo: '5 min ago',
      assignedTo: {
        name: 'Vikram P.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA--L3CSbZtR0isayAQeKWVqEYUnJm50z5jjO9pkKQN7ksNy8Vgt62aZwgUrLRnYBtnpNDDk4IRK7ognEaSVtSVSsdI0zIDiq4N90jHPW5P1ONLpdO51I3sP-vvCRQnQTsfxs1Via1HEmQcJeHVGQ6-nNWKCActOegeFVwkpjBzRiXJlzDX15TkbA-90HDUzdz54FoQmsFcObFCGuXAmvK2KTyMt9nyMhl5nHPEV0d4sIjpe9An60OytiSZxSfYVdBG1nSHlTyW1aA',
      },
    },
    {
      id: 'T01',
      area: 'Dining Area A',
      seats: 4,
      status: 'Available',
      priority: 'Medium',
      timeAgo: '10:30 AM',
      assignedTo: {
        name: 'Anita S.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuANsaeL1qIrdjS8VjlskxOHt17ofWL0mQA8HTEyUyGUmb0WZEoFeVIhAYDxByw8LuxWxFKIdV270hwAPBmZFNJdIOoLB7X4CRStTLzQ66uJ709k9Kvpbt3yDChYZmi0IOgzaKGIARmUFWTp8fiuOG-poilaUus94iK5MEMaPofwxQGipJFvuis9fWEp53IS84fln5N1GSiP7xWII9WnJi1qTw5gFY4eKQQgrXVlslMwV6TbZi4nnm2vGRG3hjoOoFQyNc23SGR4j9U',
      },
    },
    {
      id: 'T02',
      area: 'Dining Area A',
      seats: 2,
      status: 'Available',
      priority: 'Medium',
      timeAgo: '10:18 AM',
      assignedTo: {
        name: 'Anita S.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuANsaeL1qIrdjS8VjlskxOHt17ofWL0mQA8HTEyUyGUmb0WZEoFeVIhAYDxByw8LuxWxFKIdV270hwAPBmZFNJdIOoLB7X4CRStTLzQ66uJ709k9Kvpbt3yDChYZmi0IOgzaKGIARmUFWTp8fiuOG-poilaUus94iK5MEMaPofwxQGipJFvuis9fWEp53IS84fln5N1GSiP7xWII9WnJi1qTw5gFY4eKQQgrXVlslMwV6TbZi4nnm2vGRG3hjoOoFQyNc23SGR4j9U',
      },
    },
  ];

  public requests: CleaningRequest[] = [
    {
      id: 'CR-2024-036',
      type: 'Spill Cleanup',
      icon: 'water_drop',
      iconColor: 'text-blue-500',
      location: 'Dining Area A',
      requestedBy: {
        name: 'Ramesh K.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1EeclPIzb65zLML4Z-Ep8QnCj_Ey68uOYKOfFtZuK_k5ILmHPwi-DSDwYreE9ju4D4Z79Hp6UeAKZXSwBOURkmGSQ7hNQ8-lDeQGBfmjcHltnwofvxh67WrZSDukcUkwZiuZjqYa74AhkTFTcLWqysc21n_T9l3J9vkmkj_lFhXuaPU189ige8Tlb5foWMvGnW27LhowBJk4dHeUfzWcmeRluinE4acRYrVtfGNEr0sYCTnJ1sdGsg1NYN3HFCrqzkH0-TJrClE',
      },
      priority: 'High',
      status: 'In Progress',
      requestedOn: 'May 15, 2024',
      requestedTime: '10:32 AM',
    },
    {
      id: 'CR-2024-035',
      type: 'Restroom Cleaning',
      icon: 'wc',
      iconColor: 'text-orange-500',
      location: 'Restroom - 2F',
      requestedBy: {
        name: 'Neha P.',
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCCqr4e8byTqYVEco_pDW4qhZEqlgAUl1EJtja5E7M0DsWBRQksSrV2cNSmUST_fov_CV2hnYcM50GF3AkdkQA9DyJZde8ZspYRdgShSSD26dFTuWIwAbzdIvstrRk30fD9pPGgoU4JRWaj2g0d1aG1CmfFRSuMEMHwaoYzmGlVXVxFevi1v5yCQ_IVcPyjTPBGHOwAap0atLBs5Dqs-X7eruzqijqYj8_pwZ-YMwRFz1A3UCbOAr_6HFTQ-k2FKDAEh88YYdGpaFU',
      },
      priority: 'Medium',
      status: 'In Progress',
      requestedOn: 'May 15, 2024',
      requestedTime: '09:15 AM',
    },
  ];

  public tasks: CleaningRequest[] = [];
  public addTask(newTask: CleaningRequest) {
    this.tasks = [newTask, ...this.tasks];
    this.notify();
  }

  public addCleaningRequest(newRequest: CleaningRequest) {
    this.requests = [newRequest, ...this.requests];
    this.notify();
  }
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (CleaningStore.instance) {
      return CleaningStore.instance;
    }
    CleaningStore.instance = this;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public startCleaning(id: string) {
    this.tables = this.tables.map((t) => {
      if (t.id === id) {
        this.requests = this.requests.map((r) =>
          r.location.includes(id) ? { ...r, status: 'In Progress' } : r
        );
        return { ...t, status: 'In Progress', progress: 10, timeAgo: 'Started Just Now' };
      }
      return t;
    });
    this.notify();
  }
  public updateProgress(id: string) {
    this.tables = this.tables.map((t) => {
      if (t.id === id && t.status === 'In Progress') {
        const currentProgress = t.progress || 0;
        if (currentProgress >= 90) {
          return { ...t, status: 'Ready for Inspection', progress: 100, timeAgo: 'Just Now' };
        }
        return { ...t, progress: currentProgress + 20, timeAgo: 'Updated Just Now' };
      }
      return t;
    });
    this.notify();
  }

  public completeInspection(id: string) {
    this.tables = this.tables.map((t) => {
      if (t.id === id) {
        this.requests = this.requests.map((r) =>
          r.location.includes(id) ? { ...r, status: 'Completed' } : r
        );
        return { ...t, status: 'Available', progress: undefined, timeAgo: 'Just Now' };
      }
      return t;
    });
    this.notify();
  }

  public reportMaintenance(id: string, issue: string) {
    this.tables = this.tables.map((t) => {
      if (t.id === id) {
        return { ...t, maintenanceIssue: issue, status: 'Needs Cleaning', priority: 'High' };
      }
      return t;
    });
    this.notify();
  }

  public addTable(newTable: TableItem) {
    this.tables = [newTable, ...this.tables];
    this.notify();
  }
}

export const cleaningStore = new CleaningStore();
