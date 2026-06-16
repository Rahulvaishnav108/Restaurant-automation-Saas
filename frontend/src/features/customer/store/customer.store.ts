import { create } from 'zustand';
import { generateTableCode, getRecommendedItems } from '../utils/customer.utils';

export type CustomerMenuItem = {
  id: number;
  name: string;
  desc: string;
  price: number;
  rating: number;
  reviews: number;
  cat: string;
  veg: boolean;
  img: string;
  badge: string;
};

export type CustomerCartItem = {
  id: number;
  qty: number;
};

export type ServiceRequestItem = {
  id: string;
  label: string;
  description: string;
  type: 'waiter' | 'water' | 'cleaning' | 'other';
  status?: string;
};

export type TrackedOrder = {
  id: string;
  items: string;
  total: number;
  status: 'Placed' | 'Preparing' | 'Ready' | 'Served' | 'Completed';
  eta: string;
};

export const MENU_ITEMS: CustomerMenuItem[] = [
  { id: 1, name: 'Hyderabadi Biryani', desc: 'Aromatic basmati rice cooked with spices', price: 249, rating: 4.6, reviews: 230, cat: 'Biryani', veg: false, img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80', badge: 'Bestseller' },
  { id: 2, name: 'Butter Chicken', desc: 'Creamy tomato gravy with tender chicken', price: 229, rating: 4.5, reviews: 186, cat: 'Biryani', veg: false, img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', badge: '' },
  { id: 3, name: 'Veg Pizza', desc: 'Loaded with veggies & extra cheese', price: 199, rating: 4.4, reviews: 182, cat: 'Pizza', veg: true, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', badge: '' },
  { id: 4, name: 'Smash Burger', desc: 'Double patty with cheese & crispy fries', price: 259, rating: 4.8, reviews: 95, cat: 'Burgers', veg: false, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', badge: 'Hot' },
  { id: 5, name: 'Gulab Jamun', desc: 'Soft milk-solid dumplings in sugar syrup', price: 99, rating: 4.7, reviews: 148, cat: 'Desserts', veg: true, img: 'https://images.unsplash.com/photo-1542828183-4e0a0d95f83d?w=400&q=80', badge: '' },
  { id: 6, name: 'Mango Lassi', desc: 'Chilled yogurt drink with fresh mango', price: 89, rating: 4.5, reviews: 112, cat: 'Drinks', veg: true, img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', badge: '' },
  { id: 7, name: 'Paneer Tikka', desc: 'Grilled cottage cheese with mint chutney', price: 189, rating: 4.6, reviews: 204, cat: 'Biryani', veg: true, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', badge: 'Chef Special' },
  { id: 8, name: 'Cold Coffee', desc: 'Blended iced coffee with cream', price: 129, rating: 4.3, reviews: 89, cat: 'Drinks', veg: true, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', badge: '' },
];

export const MENU_CATEGORIES = [
  { label: 'All', icon: '🍽️' },
  { label: 'Biryani', icon: '🍛' },
  { label: 'Pizza', icon: '🍕' },
  { label: 'Burgers', icon: '🍔' },
  { label: 'Desserts', icon: '🧁' },
  { label: 'Drinks', icon: '🥤' },
];

type CustomerStore = {
  tableCode: string;
  category: string;
  search: string;
  vegOnly: boolean;
  cart: CustomerCartItem[];
  favourites: number[];
  orders: TrackedOrder[];
  serviceRequests: ServiceRequestItem[];
  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  toggleVegOnly: () => void;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleFavourite: (id: number) => void;
  placeOrder: () => TrackedOrder | null;
  reorder: (order: TrackedOrder) => void;
  requestService: (request: ServiceRequestItem) => void;
  getCartQuantity: (id: number) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getFilteredItems: () => CustomerMenuItem[];
  getRecommendedItems: () => CustomerMenuItem[];
  assignRandomTable: () => void;
};

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  tableCode: generateTableCode(),
  category: 'All',
  search: '',
  vegOnly: false,
  cart: [],
  favourites: [],
  orders: [
    { id: '#ORD-2841', items: 'Hyderabadi Biryani x1, Mango Lassi x1', total: 338, status: 'Preparing', eta: '12 min' },
    { id: '#ORD-2840', items: 'Smash Burger x2', total: 518, status: 'Served', eta: '-' },
  ],
  serviceRequests: [],
  setCategory: (category) => set({ category }),
  setSearch: (search) => set({ search }),
  toggleVegOnly: () => set((state) => ({ vegOnly: !state.vegOnly })),
  addToCart: (id) => set((state) => {
    const existing = state.cart.find((item) => item.id === id);
    return {
      cart: existing
        ? state.cart.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item)
        : [...state.cart, { id, qty: 1 }],
    };
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item).filter((item) => item.qty > 0),
  })),
  clearCart: () => set({ cart: [] }),
  toggleFavourite: (id) => set((state) => ({
    favourites: state.favourites.includes(id)
      ? state.favourites.filter((favouriteId) => favouriteId !== id)
      : [...state.favourites, id],
  })),
  placeOrder: () => {
    const { cart } = get();
    if (cart.length === 0) return null;

    const items = cart.map((cartItem) => {
      const item = MENU_ITEMS.find((menuItem) => menuItem.id === cartItem.id);
      return `${item?.name ?? 'Item'} x${cartItem.qty}`;
    }).join(', ');

    const order: TrackedOrder = {
      id: `#ORD-${Math.floor(3000 + Math.random() * 6000)}`,
      items,
      total: get().getTotalPrice(),
      status: 'Placed',
      eta: '18 min',
    };

    set((state) => ({ orders: [order, ...state.orders], cart: [] }));
    return order;
  },
  reorder: (order) => set((state) => ({
    orders: [{ ...order, id: `#ORD-${Math.floor(3000 + Math.random() * 6000)}`, status: 'Placed', eta: '18 min' }, ...state.orders],
  })),
  requestService: (request) => set((state) => ({ serviceRequests: [{ ...request, id: `${request.id}-${Date.now()}` }, ...state.serviceRequests] })),
  getCartQuantity: (id) => get().cart.find((item) => item.id === id)?.qty ?? 0,
  getTotalItems: () => get().cart.reduce((total, item) => total + item.qty, 0),
  getTotalPrice: () => get().cart.reduce((total, cartItem) => {
    const item = MENU_ITEMS.find((menuItem) => menuItem.id === cartItem.id);
    return total + (item?.price ?? 0) * cartItem.qty;
  }, 0),
  getFilteredItems: () => {
    const { category, search, vegOnly } = get();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = category === 'All' || item.cat === category;
      const matchesSearch = !search.trim() || `${item.name} ${item.desc} ${item.cat}`.toLowerCase().includes(search.toLowerCase());
      const matchesVeg = !vegOnly || item.veg;
      return matchesCategory && matchesSearch && matchesVeg;
    });
  },
  getRecommendedItems: () => getRecommendedItems(MENU_ITEMS, get().favourites, get().cart),
  assignRandomTable: () => set({ tableCode: generateTableCode() }),
}));
