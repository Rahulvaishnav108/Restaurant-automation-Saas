// Clean handcrafted API contract interfaces and persistence layer
export interface KdsOrder {
  id: string;
  table: string;
  item: string;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'DELAYED' | 'REJECTED';
  quantity: number;
  notes?: string;
  createdAt: string;
}

export interface KdsBatch {
  id: string;
  item: string;
  quantity: number;
  orders: string[]; // associated order IDs
  status: 'PENDING' | 'PREPARING' | 'READY';
  createdAt: string;
}

export interface KdsLoad {
  load: 'Low' | 'Medium' | 'High';
  activeOrdersCount: number;
}

export interface KdsPerformance {
  avgPrepTime: string;
  efficiency: string;
  completedToday: number;
}

const STORAGE_KEY_ORDERS = 'kds_rebuilt_orders';
const STORAGE_KEY_BATCHES = 'kds_rebuilt_batches';

const defaultOrders: KdsOrder[] = [
  { id: '1', table: 'Table 4', item: 'Paneer Butter Masala', status: 'PREPARING', quantity: 2, notes: 'Make it extra spicy, serve hot', createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: '2', table: 'Table 8', item: 'Veg Biryani Special', status: 'READY', quantity: 1, createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
  { id: '3', table: 'Table 2', item: 'Chicken Curry Combo', status: 'DELAYED', quantity: 3, notes: 'Strictly no onions or garlic', createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: '4', table: 'Table 1', item: 'Garlic Naan (Basket)', status: 'PLACED', quantity: 4, createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: '5', table: 'Table 5', item: 'Paneer Butter Masala', status: 'PLACED', quantity: 1, createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString() }
];

const defaultBatches: KdsBatch[] = [
  { id: 'b1', item: 'Paneer Butter Masala', quantity: 3, orders: ['1', '5'], status: 'PREPARING', createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() }
];

// Helper helpers to load/save state
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.warn(`Failed to read ${key} from localStorage`, e);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage`, e);
  }
};

// Seed storage initially if empty
if (!localStorage.getItem(STORAGE_KEY_ORDERS)) {
  saveToStorage(STORAGE_KEY_ORDERS, defaultOrders);
}
if (!localStorage.getItem(STORAGE_KEY_BATCHES)) {
  saveToStorage(STORAGE_KEY_BATCHES, defaultBatches);
}

// Emulate backend network latency
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const kdsApi = {
  getOrders: async (): Promise<KdsOrder[]> => {
    await delay(300);
    return loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
  },

  acceptOrder: async (id: string): Promise<KdsOrder> => {
    await delay(450);
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    const target = orders.find(o => o.id === id);
    if (!target) throw new Error('Order not found');
    target.status = 'PREPARING';
    saveToStorage(STORAGE_KEY_ORDERS, orders);
    return target;
  },

  readyOrder: async (id: string): Promise<KdsOrder> => {
    await delay(450);
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    const target = orders.find(o => o.id === id);
    if (!target) throw new Error('Order not found');
    target.status = 'READY';
    saveToStorage(STORAGE_KEY_ORDERS, orders);
    return target;
  },

  delayOrder: async (id: string): Promise<KdsOrder> => {
    await delay(450);
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    const target = orders.find(o => o.id === id);
    if (!target) throw new Error('Order not found');
    target.status = 'DELAYED';
    saveToStorage(STORAGE_KEY_ORDERS, orders);
    return target;
  },

  rejectOrder: async (id: string): Promise<KdsOrder> => {
    await delay(450);
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    const target = orders.find(o => o.id === id);
    if (!target) throw new Error('Order not found');
    target.status = 'REJECTED';
    saveToStorage(STORAGE_KEY_ORDERS, orders);
    return target;
  },

  acceptAllOrders: async (): Promise<KdsOrder[]> => {
    await delay(500);
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    orders.forEach(o => {
      if (o.status === 'PLACED') o.status = 'PREPARING';
    });
    saveToStorage(STORAGE_KEY_ORDERS, orders);
    return orders;
  },

  delayAllOrders: async (): Promise<KdsOrder[]> => {
    await delay(500);
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    orders.forEach(o => {
      if (o.status === 'PREPARING') o.status = 'DELAYED';
    });
    saveToStorage(STORAGE_KEY_ORDERS, orders);
    return orders;
  },

  getBatches: async (): Promise<KdsBatch[]> => {
    await delay(300);
    return loadFromStorage<KdsBatch[]>(STORAGE_KEY_BATCHES, defaultBatches);
  },

  createBatch: async (item: string, ordersIds: string[]): Promise<KdsBatch> => {
    await delay(400);
    const batches = loadFromStorage<KdsBatch[]>(STORAGE_KEY_BATCHES, defaultBatches);
    const newBatch: KdsBatch = {
      id: `b-${Date.now()}`,
      item,
      quantity: ordersIds.length,
      orders: ordersIds,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    batches.push(newBatch);
    saveToStorage(STORAGE_KEY_BATCHES, batches);
    return newBatch;
  },

  updateBatchStatus: async (id: string, status: 'PENDING' | 'PREPARING' | 'READY'): Promise<KdsBatch> => {
    await delay(400);
    const batches = loadFromStorage<KdsBatch[]>(STORAGE_KEY_BATCHES, defaultBatches);
    const target = batches.find(b => b.id === id);
    if (!target) throw new Error('Batch not found');
    target.status = status;
    saveToStorage(STORAGE_KEY_BATCHES, batches);

    // Side-effects: sync status of orders in the batch
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    target.orders.forEach(oid => {
      const order = orders.find(o => o.id === oid);
      if (order) {
        if (status === 'PREPARING') order.status = 'PREPARING';
        if (status === 'READY') order.status = 'READY';
      }
    });
    saveToStorage(STORAGE_KEY_ORDERS, orders);
    return target;
  },

  getLoad: async (): Promise<KdsLoad> => {
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    const active = orders.filter(o => o.status !== 'READY' && o.status !== 'REJECTED');
    let load: 'Low' | 'Medium' | 'High' = 'Low';
    if (active.length > 5) {
      load = 'High';
    } else if (active.length > 2) {
      load = 'Medium';
    }
    return { load, activeOrdersCount: active.length };
  },

  getPerformance: async (): Promise<KdsPerformance> => {
    const orders = loadFromStorage<KdsOrder[]>(STORAGE_KEY_ORDERS, defaultOrders);
    const readyCount = orders.filter(o => o.status === 'READY').length;
    return {
      avgPrepTime: '11 min',
      efficiency: '88%',
      completedToday: 24 + readyCount
    };
  }
};
